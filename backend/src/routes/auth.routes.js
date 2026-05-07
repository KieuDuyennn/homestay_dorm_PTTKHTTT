const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authService = require('../services/auth.service');
const authMiddleware = require('../middlewares/auth.middleware');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const meLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.DangNhap(username, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login-simple - Đăng nhập đơn giản bằng madangnhap
router.post('/login-simple', authLimiter, async (req, res, next) => {
  try {
    const { madangnhap, matkhau } = req.body;
    // Delegate to auth service to keep controller thin
    const result = await authService.DangNhap(madangnhap, matkhau);
    // authService.DangNhap returns { token, user } or throws
    res.json({ success: true, data: result });
  } catch (err) {
    // Return auth error in JSON format
    if (err && err.status === 401) {
      return res.status(401).json({ success: false, message: err.message });
    }
    next(err);
  }
});


// GET /api/auth/me
router.get('/me', meLimiter, authMiddleware, async (req, res, next) => {
  try {
    const user = await authService.LayThongTin(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
