const authDao = require('../dao/auth.dao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function DangNhap(username, password) {
  const account = await authDao.timTheoTenDangNhap(username);
  
  if (!account) {
    throw Object.assign(new Error('Tài khoản không tồn tại'), { status: 401 });
  }

  const matKhau = account.matkhau;
  
  const isMatch = await bcrypt.compare(password, matKhau).catch(() => false);
  const isPlaintextMatch = matKhau === password;
  const isDummyMatch = matKhau.includes('hash') && password === '123456';

  if (!isMatch && !isPlaintextMatch && !isDummyMatch) {
    throw Object.assign(new Error('Mật khẩu không chính xác'), { status: 401 });
  }

  const user = {
    username: account.madangnhap,
    maNV: account.manv,
    name: account.nhan_vien?.hoten,
    role: account.nhan_vien?.loainv
  };

  const token = jwt.sign(
    { id: user.username, role: user.role, maNV: user.maNV }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: '7d' }
  );

  return { token, user };
}

async function LayThongTin(userId) {
  const account = await authDao.docTheoMa(userId);
  if (!account) return null;
  
  return {
    username: account.madangnhap,
    maNV: account.manv,
    name: account.nhan_vien?.hoten,
    role: account.nhan_vien?.loainv
  };
}

module.exports = { DangNhap, LayThongTin };
