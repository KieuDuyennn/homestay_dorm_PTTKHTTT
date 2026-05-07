const hopDongDAO = require('../dao/hopDong.dao');

class HopDong_BUS {
  static async LayTheoMa(maHD) {
    return await hopDongDAO.docTheoMa(maHD);
  }

  static async LayTheoTrangThai(tt) {
    return await hopDongDAO.layDanhSachTheoTrangThai(tt);
  }

  static async TimKiem(tt, keyword) {
    return await hopDongDAO.timKiem(keyword, tt);
  }

  static async CapNhatTrangThai(maHD, tt) {
    return await hopDongDAO.capNhatTrangThai(maHD, tt);
  }

  // ============================================================
  // CÁC HÀM PHỤC VỤ CHỨC NĂNG LẬP YÊU CẦU THANH TOÁN KỲ ĐẦU
  // ============================================================

  /**
   * Lấy DS hợp đồng đã ký xác nhận để lập YCTT
   */
  static async LayDSHDChoYCTT() {
    return await hopDongDAO.layDSHDDaKyXacNhan();
  }

  /**
   * Tìm kiếm hợp đồng đã ký xác nhận theo từ khóa
   */
  static async TimKiemHopDong(tuKhoa) {
    if (!tuKhoa || tuKhoa.trim() === '') {
      return await hopDongDAO.layDSHDDaKyXacNhan();
    }
    // Gọi hàm timKiem dùng chung với trạng thái cố định là 'Đã ký xác nhận'
    return await hopDongDAO.timKiem(tuKhoa.trim(), 'Đã ký xác nhận');
  }

  /**
   * Kiểm tra hợp đồng đã được ký xác nhận hay chưa
   */
  static async KiemTraHopDongDaKyXacNhan(maHD) {
    const hd = await hopDongDAO.docThongTinHDRutGon(maHD);
    if (!hd) {
      throw Object.assign(new Error('Không tìm thấy hợp đồng'), { status: 404 });
    }
    if (hd.trangthai !== 'Đã ký xác nhận') {
      throw Object.assign(new Error('Hợp đồng chưa được ký xác nhận'), { status: 400 });
    }
    return hd;
  }
}

// module.exports = {
//   // HopDong_BUS
//   layDSHDChoYCTT,
//   timKiemHopDong,
//   kiemTraHopDongDaKyXacNhan}

module.exports = HopDong_BUS;
