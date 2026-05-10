const express = require('express');
const router = express.Router();
const HopDong_BUS = require('../services/hopDong.service');
const BienBanTraPhong_BUS = require('../services/bienBanTraPhong.service');
const BangDoiSoat_BUS = require('../services/bangDoiSoat.service');
const BienBanBanGiao_BUS = require('../services/bienBanBanGiao.service');
const BaoCao_BUS = require('../services/baoCaoTinhTrangPhong.service');
const LichTraPhong_BUS = require('../services/lichTraPhong.service');
const authService = require('../services/auth.service');
const authMiddleware = require('../middlewares/auth.middleware');

// Contract routes - Direct BUS mapping
router.get('/contracts', async (req, res, next) => {
  try {
    const { status } = req.query;
    const contracts = await HopDong_BUS.LayTheoTrangThai(status || 'Đã đối soát');
    res.json(contracts);
  } catch (error) {
    next(error);
  }
});

router.get('/contracts/search', async (req, res, next) => {
  try {
    const { keyword, status } = req.query;
    console.log("API CALL /contracts/search", {keyword, status});
    const searchStatus = status === 'all' ? null : (status || 'Đã đối soát');
    console.log("searchStatus mapped to:", searchStatus);
    const contracts = await HopDong_BUS.TimKiem(searchStatus, keyword);
    console.log("Returned contracts length:", contracts ? contracts.length : 0);
    res.json(contracts);
  } catch (error) {
    next(error);
  }
});

router.get('/contracts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await HopDong_BUS.LayTheoMa(id);
    res.json(contract);
  } catch (error) {
    next(error);
  }
});

router.get('/available-slots', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Thiếu thông tin ngày" });
    }
    const slots = await LichTraPhong_BUS.LayKhungGioTrong(date);
    res.json(slots);
  } catch (error) {
    next(error);
  }
});

// Checkout report routes - Direct BUS mapping
router.post('/return-schedules', authMiddleware, async (req, res) => {
  try {
    const { maHD, ngay, gio } = req.body;
    let maNV = req.user?.maNV;

    if (!maNV && req.user?.id) {
      const currentUser = await authService.LayThongTin(req.user.id);
      maNV = currentUser?.maNV;
    }

    if (!maNV) {
      throw new Error('Không xác định được mã nhân viên đăng nhập');
    }

    const result = await LichTraPhong_BUS.DangKyLichTraPhong(
      maHD,
      ngay,
      gio,
      maNV
    );

    res.status(201).json(result);

  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/reports', async (req, res, next) => {
  try {
    const { maHD, maNV } = req.body;
    const report = await BienBanTraPhong_BUS.Tao(maHD, maNV);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

router.get('/reports/creation-data', async (req, res, next) => {
  try {
    const { maHD } = req.query;

    const [reconciliation, handover, roomReport] = await Promise.all([
      BangDoiSoat_BUS.LayTheoMaHD(maHD),
      BienBanBanGiao_BUS.LayTaiSanTheoHopDong(maHD),
      BaoCao_BUS.LayTheoHopDong(maHD)
    ]);

    res.json({
      reconciliation,
      handover,
      roomReport
    });
  } catch (error) {
    next(error);
  }
});

router.get('/reports/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await BienBanTraPhong_BUS.LayTheoMa(id);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
