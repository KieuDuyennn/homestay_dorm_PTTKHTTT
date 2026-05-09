const supabase = require('../config/supabase');

class giuongDao {
  // Lấy tình trạng của 1 giường cụ thể
  static async selectTinhTrang(magiuong, maphong) {
    const { data, error } = await supabase
      .from('giuong')
      .select('magiuong, maphong, tinhtrang')
      .eq('magiuong', magiuong)
      .eq('maphong', maphong)
      .single();

    if (error) {
      console.error('Lỗi giuongDao.selectTinhTrang:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  // Cập nhật tình trạng giường
  // Giá trị hợp lệ (schema mới): 'Chưa sử dụng' | 'Đang sử dụng' | 'Đang giữ chỗ'
  static async updateTinhTrang(magiuong, maphong, tinhtrang) {
    const { data, error } = await supabase
      .from('giuong')
      .update({ tinhtrang })
      .eq('magiuong', magiuong)
      .eq('maphong', maphong)
      .select()
      .single();

    if (error) {
      console.error('Lỗi giuongDao.updateTinhTrang:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }
}

module.exports = giuongDao;
