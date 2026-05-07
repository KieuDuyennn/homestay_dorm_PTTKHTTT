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

  static async updateLichHen(mayc, thoigianhenxem) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .update({ thoigianhenxem })
      .eq('mayc', mayc)
      .select()
      .single();

    if (error) {
      console.error('Lỗi PhieuYeuCau_DAO.updateLichHen:', error);
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
      console.error('Lỗi PhieuYeuCau_DAO.getChiTiet:', error);
      return { success: false, error };
    }

    // get chi_tiet rows joined to giuong->phong
    const { data: chiTietData, error: chiTietError } = await supabase
      .from('chi_tiet_phieu_yeu_cau')
      .select(`mayc, magiuong, maphong, trangthaichot, giuong (*, phong (*))`)
      .eq('mayc', mayc);

    if (chiTietError) {
      console.error('Lỗi PhieuYeuCau_DAO.getChiTiet chi_tiet:', chiTietError);
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
      console.error('Lỗi PhieuYeuCau_DAO.updateTrangThaiChot:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  static async deleteChiTiet(mayc, maphong, magiuong) {
    const { data, error } = await supabase
      .from('chi_tiet_phieu_yeu_cau')
      .delete()
      .eq('mayc', mayc)
      .eq('maphong', maphong)
      .eq('magiuong', magiuong)
      .select();

    if (error) {
      console.error('Lỗi PhieuYeuCau_DAO.deleteChiTiet:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  static async deletePhieu(mayc) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .delete()
      .eq('mayc', mayc)
      .select();

    if (error) {
      console.error('Lỗi PhieuYeuCau_DAO.deletePhieu:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  static async updateTrangThai(mayc, trangthai) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .update({ trangthai })
      .eq('mayc', mayc)
      .select();

    if (error) {
      console.error('Lỗi PhieuYeuCau_DAO.updateTrangThai:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  static async getDanhSach(trangthai, keyword) {
    let query = supabase
      .from('phieu_yeu_cau_xem_phong')
      .select(`
        mayc, soluongdukien, loaiphong, mucgia,
        thoigiandukienvao, thoihanthue, thoigianhenxem,
        gioitinh, ngayguiyeucau, trangthai, loaihinhthue,
        manv, makh,
        khach_hang (makh, hoten, sdt, email, gioitinh, socccd)
      `)
      .order('ngayguiyeucau', { ascending: false });

    if (trangthai) {
      query = query.eq('trangthai', trangthai);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Lỗi PhieuYeuCau_DAO.getDanhSach:', error);
      return { success: false, error };
    }

    let result = data || [];
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(p =>
        p.mayc?.toLowerCase().includes(kw) ||
        p.khach_hang?.hoten?.toLowerCase().includes(kw) ||
        p.khach_hang?.sdt?.includes(kw)
      );
    }

    return { success: true, data: result };
  }
}

module.exports = PhieuYeuCau_DAO;
