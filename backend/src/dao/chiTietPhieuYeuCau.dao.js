const supabase = require('../config/supabase');

class chiTietPhieuYeuCauDao {
  static async insertChiTietMany(items) {
    console.log('=== chiTietPhieuYeuCauDao.insertChiTietMany ===');
    console.log('Items nhận:', items);
    
    if (!Array.isArray(items) || items.length === 0) {
      console.log('Items không hợp lệ hoặc rỗng');
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from('chi_tiet_phieu_yeu_cau')
      .insert(items)
      .select();

    if (error) {
      console.error('Lỗi chiTietPhieuYeuCauDao.insertChiTietMany:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  static async getChiTiet(mayc) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .select(`*, khach_hang (*), chi_tiet:chi_tiet_phieu_yeu_cau(*)`)
      .eq('mayc', mayc)
      .single();

    if (error) {
      console.error('Lỗi chiTietPhieuYeuCauDao.getChiTiet:', error);
      return { success: false, error };
    }

    const { data: chiTietData, error: chiTietError } = await supabase
      .from('chi_tiet_phieu_yeu_cau')
      .select(`mayc, magiuong, maphong, trangthaichot, giuong (*, phong (*))`)
      .eq('mayc', mayc);

    if (chiTietError) {
      console.error('Lỗi chiTietPhieuYeuCauDao.getChiTiet chi_tiet:', chiTietError);
      return { success: true, data: { ...data, chi_tiet: [] }, warning: chiTietError };
    }

    return { success: true, data: { ...data, chi_tiet: chiTietData } };
  }

  static async updateTrangThaiChot(mayc, maphong, magiuong, trangthaichot) {
    const { data, error } = await supabase
      .from('chi_tiet_phieu_yeu_cau')
      .update({ trangthaichot })
      .eq('mayc', mayc)
      .eq('maphong', maphong)
      .eq('magiuong', magiuong)
      .select();

    if (error) {
      console.error('Lỗi chiTietPhieuYeuCauDao.updateTrangThaiChot:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  static async deleteAllByMaYC(mayc) {
    const { data, error } = await supabase
      .from('chi_tiet_phieu_yeu_cau')
      .delete()
      .eq('mayc', mayc)
      .select();

    if (error) {
      console.error('Lỗi chiTietPhieuYeuCauDao.deleteAllByMaYC:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }
}

module.exports = chiTietPhieuYeuCauDao;
