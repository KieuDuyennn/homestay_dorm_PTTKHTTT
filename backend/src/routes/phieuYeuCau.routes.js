const express = require('express');
const router = express.Router();
const TimKiemPhong_BUS = require('../services/TimKiemPhong_BUS');
const PhieuYeuCau_BUS = require('../services/PhieuYeuCau_BUS');

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

    const result = await PhieuYeuCau_BUS.taoPhieuYeuCau(data);
    
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

    const result = await TimKiemPhong_BUS.timKiemPhong({ hinhThucThue, soNguoi, mucGia, chiNhanh, gioiTinh });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/phieu-yeu-cau/danh-sach?trangthai=...&keyword=...
router.get('/danh-sach', async (req, res, next) => {
  try {
    const { trangthai, keyword } = req.query;
    const result = await PhieuYeuCau_BUS.getDanhSach(trangthai, keyword);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});


// PATCH /api/phieu-yeu-cau/cap-nhat-lich-hen - Cập nhật thoigianhenxem cho phiếu
router.patch('/cap-nhat-lich-hen', async (req, res, next) => {
  try {
    const { mayc, thoigianhenxem } = req.body;
    console.log('=== PATCH /cap-nhat-lich-hen ===');
    console.log('Payload nhận:', { mayc, thoigianhenxem });
    if (!mayc || !thoigianhenxem) {
      return res.status(400).json({ success: false, message: 'Thiếu mayc hoặc thoigianhenxem' });
    }
    const result = await PhieuYeuCau_BUS.capNhatLichHen(mayc, thoigianhenxem);
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
    const result = await PhieuYeuCau_BUS.layChiTiet(mayc);
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
    const result = await PhieuYeuCau_BUS.layGioBanTheoNgay(manv, ngay);
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

    const result = await PhieuYeuCau_BUS.updateTrangThaiChot(mayc, maphong, magiuong, trangthaichot);
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
    const result = await PhieuYeuCau_BUS.deleteChiTiet(mayc, maphong, magiuong);
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

    const result = await PhieuYeuCau_BUS.huyLich(mayc);
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

    const result = await PhieuYeuCau_BUS.updateTrangThai(mayc, trangthai);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
