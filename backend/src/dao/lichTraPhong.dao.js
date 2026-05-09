const supabase = require('../config/supabase');

async function kiemTraTrungLich(ngay, gio) {
  const { data, error } = await supabase
    .from('lich_tra_phong')
    .select('*')
    .eq('ngay', ngay)
    .eq('gio', gio);

  if (error) throw error;

  return data.length > 0;
}

async function taoMoi(ngay, gio, maHD, maNV) {
  // Kiểm tra trùng lịch
  const isDuplicated = await kiemTraTrungLich(ngay, gio);

  if (isDuplicated) {
    throw new Error('Khung giờ này đã có lịch trả phòng');
  }

  // Đếm số lượng lịch hiện có
  const { count, error: countError } = await supabase
    .from('lich_tra_phong')
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  // Tạo mã lịch
  const nextId = count + 1;
  const maLichTraPhong = `LTP${nextId.toString().padStart(2, '0')}`;

  // Insert
  const { data, error } = await supabase
    .from('lich_tra_phong')
    .insert([
      {
        malichtraphong: maLichTraPhong,
        ngay,
        gio,
        trangthai: 'Chưa xác nhận',
        mahd: maHD,
        manv: maNV
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

module.exports = {
  taoMoi,
  kiemTraTrungLich
};