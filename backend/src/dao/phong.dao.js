const supabase = require('../config/supabase');

class phongDao {
  /**
   * Tìm phòng nguyên căn còn trống theo chi nhánh và giá
   * @param {string} macn - Mã chi nhánh (optional)
   * @param {number} mucGiaMax - Mức giá tối đa
   */
  static async timPhongNguyenCan({ macn, mucGiaMax, gioiTinh }) {
    let query = supabase
      .from('phong')
      .select(`
        maphong,
        soluonggiuong,
        sogiuongtrong,
        gioitinh,
        tienthuethang,
        trangthai,
        macn,
        chi_nhanh (tencn, diachi)
      `)
      // Thuê nguyên căn: phòng phải còn đủ 100% giường trống
      .eq('trangthai', 'Còn giường trống');

    if (macn) query = query.eq('macn', macn);
    if (mucGiaMax && mucGiaMax > 0) query = query.lte('tienthuethang', mucGiaMax);
    if (gioiTinh) query = query.in('gioitinh', [gioiTinh, 'Hỗn hợp']);

    const { data, error } = await query.order('tienthuethang', { ascending: true });

    if (error) {
      console.error('Lỗi phongDao.timPhongNguyenCan:', error);
      return { success: false, error };
    }
    
    // Lọc thêm: đảm bảo phòng còn trống hoàn toàn (SoGiuongTrong == SoLuongGiuong)
    const filtered = (data || []).filter(p => p.sogiuongtrong === p.soluonggiuong);
    
    return { success: true, data: filtered };
  }

  /**
   * Tìm phòng ở ghép còn đủ giường trống cho số người muốn thuê
   * @param {string} macn - Mã chi nhánh (optional)
   * @param {number} soNguoi - Số người cần thuê
   * @param {number} mucGiaMax - Mức giá tối đa (mỗi giường)
   */
  static async timPhongOGhep({ macn, soNguoi, mucGiaMax, gioiTinh }) {
    let query = supabase
      .from('phong')
      .select(`
        maphong,
        soluonggiuong,
        sogiuongtrong,
        gioitinh,
        tienthuethang,
        trangthai,
        macn,
        chi_nhanh (tencn, diachi),
        giuong (magiuong, giagiuong, tinhtrang)
      `)
      .eq('trangthai', 'Còn giường trống')
      .gte('sogiuongtrong', soNguoi); // Dùng cột suy diễn để lọc nhanh

    if (macn) query = query.eq('macn', macn);
    if (gioiTinh) query = query.in('gioitinh', [gioiTinh, 'Hỗn hợp']);

    const { data, error } = await query.order('tienthuethang', { ascending: true });

    if (error) {
      console.error('Lỗi phongDao.timPhongOGhep:', error);
      return { success: false, error };
    }

    // Lọc thêm giá (nếu mức giá tính theo giường trong phòng ở ghép)
    const ketQua = (data || []).filter(phong => {
      const thoaGia = !mucGiaMax || mucGiaMax <= 0 || phong.tienthuethang <= mucGiaMax;
      return thoaGia;
    });

    return { success: true, data: ketQua };
  }

  /**
   * Tìm giường đơn còn trống (cho thuê cá nhân)
   * @param {string} macn - Mã chi nhánh (optional)
   * @param {number} mucGiaMax - Mức giá tối đa mỗi giường
   */
  static async timGiuongDon({ macn, mucGiaMax, gioiTinh }) {
    let query = supabase
      .from('giuong')
      .select(`
        magiuong,
        giagiuong,
        tinhtrang,
        maphong,
        phong (
          maphong,
          gioitinh,
          loaihinh,
          tienthuethang,
          trangthai,
          macn,
          chi_nhanh (tencn, diachi)
        )
      `)
      .eq('tinhtrang', 'Chưa sử dụng');

    if (mucGiaMax && mucGiaMax > 0) query = query.lte('giagiuong', mucGiaMax);

    const { data, error } = await query.order('giagiuong', { ascending: true });

    if (error) {
      console.error('Lỗi phongDao.timGiuongDon:', error);
      return { success: false, error };
    }

    // Lọc theo chi nhánh và giới tính sau (vì Supabase khó filter nested)
    let ketQua = data || [];
    if (macn) ketQua = ketQua.filter(g => g.phong && g.phong.macn === macn);
    // Lọc giới tính: lấy giường ở phòng đúng giới tính hoặc phòng Hỗn hợp
    if (gioiTinh) ketQua = ketQua.filter(g => !g.phong || g.phong.gioitinh === gioiTinh || g.phong.gioitinh === 'Hỗn hợp');

    return { success: true, data: ketQua };
  }

  // Lấy trạng thái hiện tại của phòng
  static async selectTrangThai(maphong) {
    const { data, error } = await supabase
      .from('phong')
      .select('maphong, trangthai')
      .eq('maphong', maphong)
      .single();

    if (error) {
      console.error('Lỗi phongDao.selectTrangThai:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  // Cập nhật trạng thái phòng
  // Giá trị hợp lệ (schema mới): 'Còn giường trống' | 'Hết giường' | 'Đang giữ chỗ'
  static async updateTrangThai(maphong, trangthai) {
    const { data, error } = await supabase
      .from('phong')
      .update({ trangthai })
      .eq('maphong', maphong)
      .select()
      .single();

    if (error) {
      console.error('Lỗi phongDao.updateTrangThai:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }
}

module.exports = phongDao;
