const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const thanhToanService = require('../services/thanhToan.service');
const authMiddleware = require('../middlewares/auth.middleware');

const depositLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

router.use(depositLimiter);
router.use(authMiddleware);

// GET /api/deposit
router.get('/', async (req, res, next) => {
  try {
    const list = await thanhToanService.getAll();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/deposit/:id
router.get('/:id', async (req, res, next) => {
  try {
    const item = await thanhToanService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/deposit/:id/evidence
router.post('/:id/evidence', async (req, res, next) => {
  try {
    const result = await thanhToanService.ghiNhanMinhChung(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/deposit/:id/approve
router.patch('/:id/approve', async (req, res, next) => {
  try {
    const result = await thanhToanService.pheDuyetGiaoDich(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
