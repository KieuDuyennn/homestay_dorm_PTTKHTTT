const express = require('express');
const router = express.Router();
const ycttService = require('../services/LapYCTTKyDau.service');
const authMiddleware = require('../middlewares/auth.middleware');

// Tất cả routes yêu cầu đăng nhập
router.use(authMiddleware);

// GET /api/yeu-cau-thanh-toan/hop-dong — Lấy DS hợp đồng đã ký xác nhận
router.get('/hop-dong', async (req, res, next) => {
  try {
    const data = await ycttService.layDSHDChoYCTT();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/yeu-cau-thanh-toan/hop-dong/tim-kiem?q= — Tìm kiếm hợp đồng
router.get('/hop-dong/tim-kiem', async (req, res, next) => {
  try {
    const data = await ycttService.timKiemHopDong(req.query.q);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/yeu-cau-thanh-toan/hop-dong/:maHD — Chi tiết hợp đồng + DV + tiền cọc
router.get('/hop-dong/:maHD', async (req, res, next) => {
  try {
    const hd = await ycttService.kiemTraHopDongDaKyXacNhan(req.params.maHD);
    const dsDichVu = await ycttService.layDVTheoHopDong(req.params.maHD);
    const tienCoc = await require('../dao/LapYCTTKyDau.dao').layTienCocTheoHD(req.params.maHD);
    const tongPhiDV = ycttService.tinhTongPhiDV(dsDichVu);
    res.json({ hopDong: hd, dsDichVu, tienCoc, tongPhiDV });
  } catch (err) {
    next(err);
  }
});

// POST /api/yeu-cau-thanh-toan/tao/:maHD — Tạo YCTT kỳ đầu
router.post('/tao/:maHD', async (req, res, next) => {
  try {
    const maNVKT = req.user.manv;
    const result = await ycttService.taoYCTTKyDau(req.params.maHD, maNVKT);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/yeu-cau-thanh-toan/:maTT — Chi tiết YCTT
router.get('/:maTT', async (req, res, next) => {
  try {
    const data = await ycttService.layChiTietYCTT(req.params.maTT);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/yeu-cau-thanh-toan/:maTT/xac-nhan — Xác nhận YCTT
router.patch('/:maTT/xac-nhan', async (req, res, next) => {
  try {
    const data = await ycttService.xacNhanYCTT(req.params.maTT);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
