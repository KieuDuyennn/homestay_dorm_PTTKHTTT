const supabase = require('../config/supabase');

class chiNhanhDao {
  // Lấy thông tin chi nhánh theo mã
  static async selectByMaCN(macn) {
    const { data, error } = await supabase
      .from('chi_nhanh')
      .select('macn, tencn, noiquy, quydinhcoc')
      .eq('macn', macn)
      .single();

    if (error) {
      console.error('Lỗi chiNhanhDao.selectByMaCN:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }
}

module.exports = chiNhanhDao;
