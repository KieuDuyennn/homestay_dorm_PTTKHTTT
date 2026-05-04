const authDao = require('../dao/auth.dao');
const jwt = require('jsonwebtoken');

/**
 * Đăng nhập — so sánh MatKhau trực tiếp (không bcrypt)
 */
async function login(maDangNhap, matKhau) {
  const taiKhoan = await authDao.findByMaDangNhap(maDangNhap);
  if (!taiKhoan) throw Object.assign(new Error('Tài khoản không tồn tại'), { status: 401 });

  // So sánh mật khẩu trực tiếp (y chang database)
  if (taiKhoan.matkhau !== matKhau) {
    throw Object.assign(new Error('Mật khẩu không chính xác'), { status: 401 });
  }

  const nhanVien = taiKhoan.nhan_vien;
  const token = jwt.sign(
    { manv: nhanVien.manv, loainv: nhanVien.loainv },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      manv: nhanVien.manv,
      hoten: nhanVien.hoten,
      email: nhanVien.email,
      loainv: nhanVien.loainv,
      sodienthoai: nhanVien.sodienthoai,
    },
  };
}

/**
 * Lấy thông tin user hiện tại theo MaNV
 */
async function getMe(manv) {
  return authDao.findById(manv);
}

module.exports = { login, getMe };
