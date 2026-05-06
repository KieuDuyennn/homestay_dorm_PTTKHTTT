const supabase = require('../config/supabase');

class PhieuYeuCau_DAO {
  static async insert(phieuData) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .insert([phieuData])
      .select();

    if (error) {
      console.error('Lỗi PhieuYeuCau_DAO.insert:', error);
      return { success: false, error };
    }

    return { success: true, data: data[0] };
  }
}

module.exports = PhieuYeuCau_DAO;
