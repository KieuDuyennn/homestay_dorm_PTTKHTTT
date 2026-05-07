const supabase = require('../config/supabase');

class LichHen_DAO {
  /**
   * Lấy tất cả khung giờ đã được đặt lịch của 1 nhân viên trong 1 ngày
   * @param {string} manv - Mã nhân viên
   * @param {string} ngay - Ngày dạng 'YYYY-MM-DD'
   */
  static async layGioBanTheoNgay(manv, ngay) {
    // Tìm các phiếu của nhân viên có thoigianhenxem trong ngày đó
    // và trạng thái chưa huỷ
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
      console.error('Lỗi LichHen_DAO.layGioBanTheoNgay:', error);
      return { success: false, error };
    }

    // Trích xuất giờ bắt đầu từ thoigianhenxem (VD: "2024-12-20T10:00:00" → "10")
    const gioBoi = (data || []).map(p => {
      const gio = new Date(p.thoigianhenxem).getUTCHours();
      return { gio, mayc: p.mayc, trangthai: p.trangthai };
    });

    return { success: true, data: gioBoi };
  }
}

module.exports = LichHen_DAO;
