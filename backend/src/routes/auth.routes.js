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
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login-simple - Đăng nhập đơn giản bằng madangnhap
router.post('/login-simple', authLimiter, async (req, res, next) => {
  try {
    const { madangnhap, matkhau } = req.body;
    const supabase = require('../config/supabase');

    // Tìm tài khoản
    const { data: tk, error: tkErr } = await supabase
      .from('tai_khoan')
      .select('madangnhap, manv')
      .eq('madangnhap', madangnhap)
      .single();

    if (tkErr || !tk) {
      return res.json({ success: false, message: 'Tài khoản không tồn tại' });
    }

    // Lấy thông tin nhân viên
    const { data: nv } = await supabase
      .from('nhan_vien')
      .select('manv, hoten, loainv')
      .eq('manv', tk.manv)
      .single();

    // Lưu ý: matkhau trong DB là bcrypt hash, tạm thời dùng plaintext để demo
    // Nếu cần bcrypt, cài thêm package bcrypt
    const user = {
      manv: tk.manv,
      madangnhap: tk.madangnhap,
      name: nv?.hoten || madangnhap,
      role: nv?.loainv || 'Sale',
    };

    return res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});


// GET /api/auth/me
router.get('/me', meLimiter, authMiddleware, async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
