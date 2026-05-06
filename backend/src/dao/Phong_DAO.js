const supabase = require('../config/supabase');

class Phong_DAO {
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
        gioitinh,
        loaihinh,
        tienthuethang,
        trangthai,
        macn,
        chi_nhanh (tencn, diachi)
      `)
      .eq('loaihinh', 'Nguyên phòng')
      .eq('trangthai', 'Còn trống');

    if (macn) query = query.eq('macn', macn);
    if (mucGiaMax && mucGiaMax > 0) query = query.lte('tienthuethang', mucGiaMax);
    // Lọc giới tính: chọ phòng đúng giới tính hoặc phòng Hỗn hợp
    if (gioiTinh) query = query.in('gioitinh', [gioiTinh, 'Hỗn hợp']);

    const { data, error } = await query.order('tienthuethang', { ascending: true });

    if (error) {
      console.error('Lỗi Phong_DAO.timPhongNguyenCan:', error);
      return { success: false, error };
    }
    return { success: true, data };
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
        gioitinh,
        loaihinh,
        tienthuethang,
        trangthai,
        macn,
        chi_nhanh (tencn, diachi),
        giuong (magiuong, giagiuong, tinhtrang)
      `)
      .eq('loaihinh', 'Ở ghép')
      .eq('trangthai', 'Còn trống');

    if (macn) query = query.eq('macn', macn);
    // Lọc giới tính: chọ phòng đúng giới tính hoặc phòng Hỗn hợp
    if (gioiTinh) query = query.in('gioitinh', [gioiTinh, 'Hỗn hợp']);

    const { data, error } = await query.order('tienthuethang', { ascending: true });

    if (error) {
      console.error('Lỗi Phong_DAO.timPhongOGhep:', error);
      return { success: false, error };
    }

    // Lọc phòng có đủ số giường trống theo yêu cầu
    const ketQua = (data || []).filter(phong => {
      const giuongTrong = (phong.giuong || []).filter(g => g.tinhtrang === 'Chưa sử dụng');
      const thoaGia = !mucGiaMax || mucGiaMax <= 0 || phong.tienthuethang <= mucGiaMax;
      return giuongTrong.length >= soNguoi && thoaGia;
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
      console.error('Lỗi Phong_DAO.timGiuongDon:', error);
      return { success: false, error };
    }

    // Lọc theo chi nhánh và giới tính sau (vì Supabase khó filter nested)
    let ketQua = data || [];
    if (macn) ketQua = ketQua.filter(g => g.phong && g.phong.macn === macn);
    // Lọc giới tính: lấy giường ở phòng đúng giới tính hoặc phòng Hỗn hợp
    if (gioiTinh) ketQua = ketQua.filter(g => !g.phong || g.phong.gioitinh === gioiTinh || g.phong.gioitinh === 'Hỗn hợp');

    return { success: true, data: ketQua };
  }
}

module.exports = Phong_DAO;
