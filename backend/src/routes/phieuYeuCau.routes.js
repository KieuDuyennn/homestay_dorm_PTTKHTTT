const express = require('express');
const router = express.Router();
const PhieuYeuCau_BUS = require('../services/PhieuYeuCau_BUS');
const TimKiemPhong_BUS = require('../services/TimKiemPhong_BUS');
const LichHen_DAO = require('../dao/LichHen_DAO');

// POST /api/phieu-yeu-cau/dang-ky
router.post('/dang-ky', async (req, res, next) => {
  try {
    const data = req.body;
    
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

// PATCH /api/phieu-yeu-cau/cap-nhat-lich-hen - Cập nhật thoigianhenxem cho phiếu
router.patch('/cap-nhat-lich-hen', async (req, res, next) => {
  try {
    const { mayc, thoigianhenxem } = req.body;
    if (!mayc || !thoigianhenxem) {
      return res.status(400).json({ success: false, message: 'Thiếu mayc hoặc thoigianhenxem' });
    }
    const supabase = require('../config/supabase');
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .update({ thoigianhenxem })
      .eq('mayc', mayc)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error });
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// GET /api/phieu-yeu-cau/gio-boi?manv=NV02&ngay=2025-05-06
router.get('/gio-boi', async (req, res, next) => {
  try {
    const { manv, ngay } = req.query;
    if (!manv || !ngay) {
      return res.status(400).json({ success: false, message: 'Thiếu manv hoặc ngay' });
    }
    const result = await LichHen_DAO.layGioBoiTheoNgay(manv, ngay);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
