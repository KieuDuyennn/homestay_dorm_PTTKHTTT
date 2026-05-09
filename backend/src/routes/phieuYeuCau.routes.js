const express = require('express');
const router = express.Router();
const timKiemPhongService = require('../services/timKiemPhong.service');
const phieuYeuCauService = require('../services/phieuYeuCau.service');

// POST /api/phieu-yeu-cau/dang-ky
router.post('/dang-ky', async (req, res, next) => {
  try {
    const data = req.body;
    console.log('=== Route /dang-ky nhận request ===');
    console.log('Payload keys:', Object.keys(data));
    console.log('ChiTiet:', data.ChiTiet);
    
    // Basic validation
    if (!data.HoTen || !data.SoDienThoai || !data.CCCD || !data.DiaChi) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đủ họ tên, số điện thoại, CCCD và địa chỉ'
      });
    }

    const result = await phieuYeuCauService.taoPhieuYeuCau(data);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/phieu-yeu-cau/tim-kiem-phong?hinhThucThue=...&soNguoi=...&mucGia=...&chiNhanh=...&gioiTinh=...
router.get('/tim-kiem-phong', async (req, res, next) => {
  try {
    const { hinhThucThue, soNguoi, mucGia, chiNhanh, gioiTinh } = req.query;

    if (!hinhThucThue) {
      return res.status(400).json({ success: false, message: 'Thiếu hình thức thuê' });
    }

    const result = await timKiemPhongService.timKiemPhong({ hinhThucThue, soNguoi, mucGia, chiNhanh, gioiTinh });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/phieu-yeu-cau/danh-sach?trangthai=...&keyword=...
router.get('/danh-sach', async (req, res, next) => {
  try {
    const { trangthai, keyword } = req.query;
    const result = await phieuYeuCauService.getDanhSach(trangthai, keyword);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});


// PATCH /api/phieu-yeu-cau/cap-nhat-lich-hen - Cập nhật thoigianhenxem cho phiếu
router.patch('/cap-nhat-lich-hen', async (req, res, next) => {
  try {
    const { mayc, thoigianhenxem, manv } = req.body;
    if (!mayc || !thoigianhenxem) {
      return res.status(400).json({ success: false, message: 'Thiếu mayc hoặc thoigianhenxem' });
    }
    const result = await phieuYeuCauService.capNhatLichHen(mayc, thoigianhenxem, manv);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/phieu-yeu-cau/chi-tiet/:mayc
router.get('/chi-tiet/:mayc', async (req, res, next) => {
  try {
    const { mayc } = req.params;
    const result = await phieuYeuCauService.layChiTiet(mayc);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/phieu-yeu-cau/gio-ban?manv=NV02&ngay=2025-05-06
router.get('/gio-ban', async (req, res, next) => {
  try {
    const { manv, ngay } = req.query;
    if (!manv || !ngay) {
      return res.status(400).json({ success: false, message: 'Thiếu manv hoặc ngay' });
    }
    const result = await phieuYeuCauService.layGioBanTheoNgay(manv, ngay);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/phieu-yeu-cau/update-trang-thai-chot - Cập nhật trangthaichot = 'Chốt'
router.patch('/update-trang-thai-chot', async (req, res, next) => {
  try {
    const { mayc, maphong, magiuong, trangthaichot } = req.body;
    if (!mayc || !maphong || magiuong === undefined || !trangthaichot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu mayc, maphong, magiuong hoặc trangthaichot' 
      });
    }

    const result = await phieuYeuCauService.updateTrangThaiChot(mayc, maphong, magiuong, trangthaichot);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/phieu-yeu-cau/chi-tiet/:mayc/:maphong/:magiuong - Xóa chi tiết phiếu
router.delete('/chi-tiet/:mayc/:maphong/:magiuong', async (req, res, next) => {
  try {
    const { mayc, maphong, magiuong } = req.params;
    const result = await phieuYeuCauService.deleteChiTiet(mayc, maphong, magiuong);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/phieu-yeu-cau/huy-lich/:mayc - Xóa toàn bộ lịch hẹn và chi tiết
router.delete('/huy-lich/:mayc', async (req, res, next) => {
  try {
    const { mayc } = req.params;
    console.log('=== DELETE /huy-lich/:mayc ===');
    console.log('Param mayc:', mayc);
    if (!mayc) {
      return res.status(400).json({ success: false, message: 'Thiếu mayc' });
    }

    const result = await phieuYeuCauService.huyLich(mayc);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/phieu-yeu-cau/update-trang-thai - Cập nhật trạng thái phiếu
router.patch('/update-trang-thai', async (req, res, next) => {
  try {
    const { mayc, trangthai } = req.body;
    if (!mayc || !trangthai) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu mayc hoặc trangthai' 
      });
    }

    const result = await phieuYeuCauService.updateTrangThai(mayc, trangthai);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── ROUTE: Lấy danh sách PYC trạng thái "Cần xác nhận" ───────────────────
// GET /api/phieu-yeu-cau/can-xac-nhan?keyword=...
// Dùng cho tab "PYC Xem Phòng" ở màn hình MH_DanhSachPYCXemPhong
router.get('/can-xac-nhan', async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const result = await phieuYeuCauService.layDanhSachCanXacNhan(keyword || '');
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── ROUTE: Chi tiết PYC kèm tình trạng thực tế phòng/giường ──────────────
// GET /api/phieu-yeu-cau/chi-tiet-voi-tinh-trang/:mayc
// Dùng cho màn hình MH_ChiTietPYCXemPhong và MH_GhiNhanXacNhanThue
router.get('/chi-tiet-voi-tinh-trang/:mayc', async (req, res, next) => {
  try {
    const { mayc } = req.params;
    const result = await phieuYeuCauService.layChiTietVoiTinhTrang(mayc);
    if (!result.success) return res.status(result.message === 'Không tìm thấy hồ sơ' ? 404 : 500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── ROUTE: Cập nhật thông tin khách thuê ─────────────────────────────────
// PUT /api/phieu-yeu-cau/:mayc/thong-tin-khach
// Dùng khi nhân viên nhấn "Lưu" sau khi chỉnh sửa trong MH_ChiTietPYCXemPhong
router.put('/:mayc/thong-tin-khach', async (req, res, next) => {
  try {
    const { mayc } = req.params;
    const { hoTen, sdt, cccd, ngayVaoO } = req.body;

    if (!hoTen || !sdt || !cccd) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc: hoTen, sdt, cccd' });
    }

    const result = await phieuYeuCauService.capNhatThongTinKhach(mayc, { hoTen, sdt, cccd, ngayVaoO });
    if (!result.success) {
      // Lỗi validation trả 400, lỗi server trả 500
      return res.status(result.errors ? 400 : 500).json(result);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── ROUTE: Hủy thuê ───────────────────────────────────────────────────────
// PATCH /api/phieu-yeu-cau/:mayc/huy-thue
// Dùng khi nhân viên nhấn "Xác nhận hủy" trong ModalHuyThue ở MH_ChiTietPYCXemPhong
router.patch('/:mayc/huy-thue', async (req, res, next) => {
  try {
    const { mayc } = req.params;
    const { lyDoHuy } = req.body;

    if (!lyDoHuy) {
      return res.status(400).json({ success: false, message: 'Lý do hủy không được để trống' });
    }

    const result = await phieuYeuCauService.huyThue(mayc, lyDoHuy);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── ROUTE: Lấy nội quy chi nhánh ─────────────────────────────────────────
// GET /api/phieu-yeu-cau/noi-quy/:mayc
// Dùng cho màn hình MH_GhiNhanXacNhanThue — tái dùng layChiTietVoiTinhTrang
// Response đã có chiNhanh.noiQuy và chiNhanh.quyDinhCoc
router.get('/noi-quy/:mayc', async (req, res, next) => {
  try {
    const { mayc } = req.params;
    const result = await phieuYeuCauService.layChiTietVoiTinhTrang(mayc);
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── ROUTE: Xác nhận thuê (hành động chính UC4) ────────────────────────────
// POST /api/phieu-yeu-cau/:mayc/xac-nhan-thue
// Dùng khi nhân viên tick nội quy và nhấn "Chuyển hồ sơ xác nhận"
// trong MH_GhiNhanXacNhanThue
router.post('/:mayc/xac-nhan-thue', async (req, res, next) => {
  try {
    const { mayc } = req.params;
    const { dongYNoiQuy } = req.body;

    if (dongYNoiQuy !== true) {
      return res.status(400).json({ success: false, message: 'Khách hàng phải đồng ý nội quy trước khi xác nhận' });
    }

    const result = await phieuYeuCauService.ghiNhanXacNhanNoiQuy(mayc);
    if (!result.success) return res.status(500).json(result);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
