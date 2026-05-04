const supabase = require('../config/supabase');

/**
 * Tìm tài khoản theo MaDangNhap, join NHAN_VIEN
 */
async function findByMaDangNhap(maDangNhap) {
  const { data, error } = await supabase
    .from('tai_khoan')
    .select('madangnhap, matkhau, manv, nhan_vien(manv, hoten, sodienthoai, email, cccd, loainv)')
    .eq('madangnhap', maDangNhap)
    .single();

  if (error) return null;
  return data;
}

/**
 * Tìm nhân viên theo MaNV
 */
async function findById(manv) {
  const { data, error } = await supabase
    .from('nhan_vien')
    .select('manv, hoten, sodienthoai, email, cccd, loainv')
    .eq('manv', manv)
    .single();

  if (error) return null;
  return data;
}

module.exports = { findByMaDangNhap, findById };
