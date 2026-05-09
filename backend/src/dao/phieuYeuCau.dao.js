const supabase = require('../config/supabase');

class phieuYeuCauDao {
  static async insert(phieuData) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .insert([phieuData])
      .select();

    if (error) {
      console.error('Lỗi phieuYeuCauDao.insert:', error);
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
      console.error('Lỗi phieuYeuCauDao.updateLichHen:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  static async layGioBanTheoNgay(manv, ngay) {
    const startOfDay = `${ngay}T00:00:00`;
    const endOfDay = `${ngay}T23:59:59`;

    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .select('thoigianhenxem, trangthai, mayc')
      .eq('manv', manv)
      .gte('thoigianhenxem', startOfDay)
      .lte('thoigianhenxem', endOfDay)
      .not('trangthai', 'eq', 'Đã huỷ');

    if (error) {
      console.error('Lỗi phieuYeuCauDao.layGioBanTheoNgay:', error);
      return { success: false, error };
    }

    const gioBan = (data || []).map(p => {
      const gio = new Date(p.thoigianhenxem).getUTCHours();
      return { gio, mayc: p.mayc, trangthai: p.trangthai };
    });

    return { success: true, data: gioBan };
  }

  static async getChiTiet(mayc) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .select(`*, khach_hang (*), chi_tiet:chi_tiet_phieu_yeu_cau(*)`)
      .eq('mayc', mayc)
      .single();

    if (error) {
      console.error('Lỗi phieuYeuCauDao.getChiTiet:', error);
      return { success: false, error };
    }

    // get chi_tiet rows joined to giuong->phong
    const { data: chiTietData, error: chiTietError } = await supabase
      .from('chi_tiet_phieu_yeu_cau')
      .select(`mayc, magiuong, maphong, trangthaichot, giuong (*, phong (*))`)
      .eq('mayc', mayc);

    if (chiTietError) {
      console.error('Lỗi phieuYeuCauDao.getChiTiet chi_tiet:', chiTietError);
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
      console.error('Lỗi phieuYeuCauDao.updateTrangThaiChot:', error);
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
      console.error('Lỗi phieuYeuCauDao.deleteChiTiet:', error);
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
      console.error('Lỗi phieuYeuCauDao.deletePhieu:', error);
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
      console.error('Lỗi phieuYeuCauDao.updateTrangThai:', error);
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
      console.error('Lỗi phieuYeuCauDao.getDanhSach:', error);
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

  // Method: Lấy danh sách PYC trạng thái 'Cần xác nhận', có tìm kiếm keyword
  static async selectCanXacNhan(keyword) {
    let query = supabase
      .from('phieu_yeu_cau_xem_phong')
      .select(`
        mayc, trangthai, thoigiandukienvao, thoihanthue,
        loaihinhthue, loaiphong, lydohuy, ngayguiyeucau,
        khach_hang (makh, hoten, sdt, loaikhachhang)
      `)
      .eq('trangthai', 'Cần xác nhận')
      .order('ngayguiyeucau', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Lỗi phieuYeuCauDao.selectCanXacNhan:', error);
      return { success: false, error };
    }

    let result = data || [];
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(p =>
        p.khach_hang?.hoten?.toLowerCase().includes(kw) ||
        p.khach_hang?.sdt?.includes(kw)
      );
    }
    return { success: true, data: result };
  }

  // Method: Lưu lý do hủy + chuyển trạng thái 'Hủy thuê' trong 1 query
  static async updateLyDoHuy(mayc, lydohuy) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .update({ lydohuy, trangthai: 'Hủy thuê' })
      .eq('mayc', mayc)
      .select()
      .single();

    if (error) {
      console.error('Lỗi phieuYeuCauDao.updateLyDoHuy:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  // Method: Cập nhật thoigiandukienvao trong phiếu
  static async updateThoiGianVao(mayc, thoigiandukienvao) {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .update({ thoigiandukienvao })
      .eq('mayc', mayc)
      .select()
      .single();

    if (error) {
      console.error('Lỗi phieuYeuCauDao.updateThoiGianVao:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }
}

module.exports = phieuYeuCauDao;
