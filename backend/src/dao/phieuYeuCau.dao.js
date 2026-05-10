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

  static async updateLichHen(mayc, thoigianhenxem, manv = 'NV01') {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .update({ thoigianhenxem, manv })
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
    const startOfDay = `${ngay}T00:00:00Z`;
    const endOfDay = `${ngay}T23:59:59Z`;

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
      // Đảm bảo parse như giờ UTC (bù đắp việc DB bỏ mất chữ Z)
      const dateStr = p.thoigianhenxem.endsWith('Z') ? p.thoigianhenxem : p.thoigianhenxem + 'Z';
      const date = new Date(dateStr);
      // Giờ UTC + 7 để ra giờ VN (tương ứng với label trong DatLichHen.jsx)
      const gio = (date.getUTCHours() + 7) % 24; 
      return { gio, mayc: p.mayc, trangthai: p.trangthai };
    });

    return { success: true, data: gioBan };
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
        mayc, soluongdukien, loaihinhthue, mucgia,
        thoigiandukienvao, thoihanthue, thoigianhenxem,
        ngayguiyeucau, trangthai,
        manv, makh,
        khach_hang!inner (makh, hoten, sdt, email, gioitinh, socccd)
      `)
      .order('ngayguiyeucau', { ascending: false });

    if (trangthai) {
      query = query.eq('trangthai', trangthai);
    } else {
      query = query.not('trangthai', 'eq', 'Đang hẹn xem');
    }

    if (keyword) {
      const kw = `%${keyword}%`;
      // Tìm kiếm theo MaYC hoặc Tên khách hoặc SĐT khách
      // Lưu ý: Sử dụng !inner join ở trên cho phép ta filter theo khach_hang.hoten/sdt trực tiếp
      query = query.or(`mayc.ilike.${kw},khach_hang.hoten.ilike.${kw},khach_hang.sdt.ilike.${kw}`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Lỗi phieuYeuCauDao.getDanhSach:', error);
      return { success: false, error };
    }

    return { success: true, data: data || [] };
  }

  // Method: Lấy danh sách PYC trạng thái 'Cần xác nhận', có tìm kiếm keyword
  static async selectCanXacNhan(keyword) {
    let query = supabase
      .from('phieu_yeu_cau_xem_phong')
      .select(`
        mayc, trangthai, thoigiandukienvao, thoihanthue,
        loaihinhthue, lydohuy, ngayguiyeucau,
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

  // Sinh mã phiếu yêu cầu tăng dần
  static async sinhMaPhieuYeuCau() {
    const { data, error } = await supabase
      .from('phieu_yeu_cau_xem_phong')
      .select('mayc')
      .like('mayc', 'YC%');

    if (error) {
      console.error('Lỗi phieuYeuCauDao.sinhMaPhieuYeuCau:', error);
      return 'YC001'; // Fallback
    }

    if (!data || data.length === 0) return 'YC001';

    const nums = data.map(d => {
      const match = d.mayc.match(/^YC(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });

    const maxNum = Math.max(0, ...nums);
    return `YC${(maxNum + 1).toString().padStart(3, '0')}`;
  }
}

module.exports = phieuYeuCauDao;
