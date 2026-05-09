const supabase = require('../config/supabase');

class khachHangDao {
  static async insert(khachHangData) {
    const { data, error } = await supabase
      .from('khach_hang')
      .insert([khachHangData])
      .select();

    if (error) {
      console.error('Lỗi khachHangDao.insert:', error);
      return { success: false, error };
    }

    return { success: true, data: data[0] };
  }

  static async findByCCCD(cccd) {
    const { data, error } = await supabase
      .from('khach_hang')
      .select('makh')
      .eq('socccd', cccd)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Lỗi khachHangDao.findByCCCD:', error);
      return { success: false, error };
    }

    return { success: true, data: data || null };
  }

  // Cập nhật thông tin cơ bản của khách hàng
  // Chỉ cho phép sửa: hoten, sdt, socccd
  static async updateThongTin(makh, { hoten, sdt, socccd }) {
    const updateData = {};
    if (hoten !== undefined) updateData.hoten = hoten;
    if (sdt !== undefined) updateData.sdt = sdt;
    if (socccd !== undefined) updateData.socccd = socccd;

    const { data, error } = await supabase
      .from('khach_hang')
      .update(updateData)
      .eq('makh', makh)
      .select()
      .single();

    if (error) {
      console.error('Lỗi khachHangDao.updateThongTin:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  // Sinh mã khách hàng tăng dần
  static async sinhMaKhachHang() {
    const { data, error } = await supabase
      .from('khach_hang')
      .select('makh')
      .like('makh', 'KH%');

    if (error) {
      console.error('Lỗi khachHangDao.sinhMaKhachHang:', error);
      return 'KH001'; // Fallback
    }

    if (!data || data.length === 0) return 'KH001';

    const nums = data.map(d => {
      const match = d.makh.match(/^KH(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });

    const maxNum = Math.max(0, ...nums);
    return `KH${(maxNum + 1).toString().padStart(3, '0')}`;
  }
}

module.exports = khachHangDao;
