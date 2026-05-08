const supabase = require('../config/supabase');

async function taoMoi(ngay, maHD, maNV) {
  // Generate a MaLichTraPhong (e.g. LTP + timestamp or counter)
  // To keep it simple and robust without knowing the exact count format, use a timestamp-based ID or check count
  const { count, error: countError } = await supabase
    .from('lich_tra_phong')
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  // Simple sequential ID: LTP01, LTP02, etc. (assuming no deletes or padding to 2 digits)
  const nextId = count + 1;
  const maLichTraPhong = `LTP${nextId.toString().padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('lich_tra_phong')
    .insert([
      {
        malichtraphong: maLichTraPhong,
        ngay: ngay,
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
  taoMoi
};
