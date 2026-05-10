const supabase = require('../config/supabase');

function extractBedOrder(magiuong) {
  const match = String(magiuong || '').match(/\d+/);
  return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

function chunkBeds(items, size) {
  const chunks = [];
  for (let index = 0; index + size <= items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

class phongDao {
  /**
   * Tìm phòng nguyên căn còn trống theo chi nhánh và giá
   * @param {string} macn - Mã chi nhánh (optional)
   * @param {number} mucGiaMax - Mức giá tối đa
   */
  static async timPhongNguyenCan({ macn, soNguoi, mucGiaMax, gioiTinh }) {
    const soNguoiThue = parseInt(soNguoi) || 1;
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
        giuong (magiuong, tinhtrang)
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
    // đủ số người muốn thuê, và giá hiển thị là tổng theo toàn bộ số giường của phòng
    const filtered = (data || [])
      .filter(p => p.sogiuongtrong === p.soluonggiuong && (p.soluonggiuong || 0) >= soNguoiThue)
      .map(p => {
        const tongTienThue = (p.tienthuethang || 0) * (p.soluonggiuong || 1);
        const dsGiuong = (p.giuong || []).filter(g => g.tinhtrang === 'Chưa sử dụng');
        const thoaGia = !mucGiaMax || mucGiaMax <= 0 || tongTienThue <= mucGiaMax;
        return thoaGia
          ? { ...p, giaMoiGiuong: p.tienthuethang, tongTienThue, dsGiuong, dsMagiuong: dsGiuong.map(g => g.magiuong) }
          : null;
      })
      .filter(Boolean);

    return { success: true, data: filtered };
  }

  /**
   * Tìm phòng ở ghép còn đủ giường trống cho số người muốn thuê
   * @param {string} macn - Mã chi nhánh (optional)
   * @param {number} soNguoi - Số người cần thuê
   * @param {number} mucGiaMax - Mức giá tối đa (mỗi giường)
   */
  static async timPhongOGhep({ macn, soNguoi, mucGiaMax, gioiTinh }) {
    const soNguoiThue = parseInt(soNguoi) || 1;
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
        giuong (magiuong, tinhtrang)
      `)
      .eq('trangthai', 'Còn giường trống')
      .gte('sogiuongtrong', soNguoiThue); // Dùng cột suy diễn để lọc nhanh

    if (macn) query = query.eq('macn', macn);
    if (gioiTinh) query = query.in('gioitinh', [gioiTinh, 'Hỗn hợp']);

    const { data, error } = await query.order('tienthuethang', { ascending: true });

    if (error) {
      console.error('Lỗi phongDao.timPhongOGhep:', error);
      return { success: false, error };
    }

    // Lọc thêm: ở ghép phải đủ giường trống cho số người,
    // nhưng mỗi phòng chỉ trả về 1 nhóm giường đại diện
    const ketQua = (data || [])
      .flatMap(phong => {
        const giuongTrong = (phong.giuong || [])
          .filter(g => g.tinhtrang === 'Chưa sử dụng')
          .sort((a, b) => extractBedOrder(a.magiuong) - extractBedOrder(b.magiuong));
        if (giuongTrong.length < soNguoiThue) {
          return [];
        }

        const tongTienThue = (phong.tienthuethang || 0) * soNguoiThue;
        const thoaGia = !mucGiaMax || mucGiaMax <= 0 || tongTienThue <= mucGiaMax;
        if (!thoaGia) {
          return [];
        }

        const group = chunkBeds(giuongTrong, soNguoiThue)[0];
        if (!group) {
          return [];
        }

        return [{
          ...phong,
          giaMoiGiuong: phong.tienthuethang,
          tongTienThue,
          dsGiuong: group,
          dsMagiuong: group.map(g => g.magiuong),
          magiuong: group[0]?.magiuong || null,
        }];
      });

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
  // Lấy thông tin phòng theo mã phòng
  static async selectByMaPhong(maphong) {
    const { data, error } = await supabase
      .from('phong')
      .select('maphong, tienthuethang, trangthai, macn, gioitinh')
      .eq('maphong', maphong)
      .single();

    if (error) {
      console.error('Lỗi phongDao.selectByMaPhong:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }
}

module.exports = phongDao;
