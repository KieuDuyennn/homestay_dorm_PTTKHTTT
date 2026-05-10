const supabase = require('../config/supabase');


async function taoMoi(ngay, gio, maHD, maNV) {
  // Kiểm tra trùng lịch
  const { data: checkData, error: checkError } = await supabase
    .from('lich_tra_phong')
    .select('*')
    .eq('ngay', ngay)
    .eq('gio', gio);

  if (checkError) throw checkError;

  if (checkData.length > 0) {
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

async function layLichTheoNgay(ngay) {
  const { data, error } = await supabase
    .from('lich_tra_phong')
    .select('gio')
    .eq('ngay', ngay);

  if (error) throw error;
  return data;
}

module.exports = {
  taoMoi,
  layLichTheoNgay
};