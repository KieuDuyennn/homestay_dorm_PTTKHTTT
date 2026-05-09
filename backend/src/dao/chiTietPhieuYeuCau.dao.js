const supabase = require('../config/supabase');

class chiTietPhieuYeuCauDao {
  static async insertChiTietMany(items) {
    console.log('=== chiTietPhieuYeuCauDao.insertChiTietMany ===');
    console.log('Items nhận:', items);
    
    if (!Array.isArray(items) || items.length === 0) {
      console.log('Items không hợp lệ hoặc rỗng');
      return { success: true, data: [] };
    }

    // Items from BUS are already in correct format: { mayc, maphong, magiuong, trangthaichot }
    console.log(`Chuẩn bị insert ${items.length} items`);
    const { data, error } = await supabase
      .from('chi_tiet_phieu_yeu_cau')
      .insert(items)
      .select();

    if (error) {
      console.error('Lỗi chiTietPhieuYeuCauDao.insertChiTietMany:', error);
      return { success: false, error };
    }
    console.log('Insert thành công! Data trả về:', data);
    return { success: true, data };
  }
}

module.exports = chiTietPhieuYeuCauDao;
