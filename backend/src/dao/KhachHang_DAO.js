const supabase = require('../config/supabase');

class KhachHang_DAO {
  static async insert(khachHangData) {
    const { data, error } = await supabase
      .from('khach_hang')
      .insert([khachHangData])
      .select();

    if (error) {
      console.error('Lỗi KhachHang_DAO.insert:', error);
      return { success: false, error };
    }

    return { success: true, data: data[0] };
  }

  static async findByCCCD(cccd) {
    const { data, error } = await supabase
      .from('khach_hang')
      .select('makh')
      .eq('socccd', cccd)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Lỗi KhachHang_DAO.findByCCCD:', error);
      return { success: false, error };
    }

    return { success: true, data: data || null };
  }
}

module.exports = KhachHang_DAO;
