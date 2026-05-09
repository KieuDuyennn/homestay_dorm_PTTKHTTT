const phongDao = require('../dao/phong.dao');

class timKiemPhongService {
  /**
   * Tìm phòng dựa vào nhu cầu thuê từ phiếu yêu cầu
   * @param {object} params - { hinhThucThue, soNguoi, mucGia, chiNhanh }
   */
  static async timKiemPhong({ hinhThucThue, soNguoi, mucGia, chiNhanh, gioiTinh }) {
    const mucGiaMax = parseFloat(mucGia) || 0;
    const soNguoiThue = parseInt(soNguoi) || 1;

    // Tìm macn theo tên chi nhánh (nếu có)
    let macn = null;
    if (chiNhanh) {
      const cnMap = {
        'Bình Thạnh': 'CN01', 'Chi nhánh Bình Thạnh': 'CN01',
        'Thủ Đức': 'CN02', 'Chi nhánh Thủ Đức': 'CN02',
        'Gò Vấp': 'CN03', 'Chi nhánh Gò Vấp': 'CN03',
        'CN01': 'CN01', 'CN02': 'CN02', 'CN03': 'CN03',
      };
      macn = cnMap[chiNhanh] || null;
    }

    // Cá nhân hoặc Ở ghép: tìm phòng ở ghép còn đủ giường trống
    if (hinhThucThue === 'Cá nhân' || hinhThucThue === 'Ở ghép') {
      const result = await phongDao.timPhongOGhep({ macn, soNguoi: soNguoiThue, mucGiaMax, gioiTinh });
      return {
        success: result.success,
        loai: 'o-ghep',
        data: result.data || [],
        error: result.error
      };
    }

    // Thuê nguyên căn: tìm phòng nguyên căn trống
    if (hinhThucThue === 'Thuê nguyên căn') {
      const result = await phongDao.timPhongNguyenCan({ macn, mucGiaMax, gioiTinh });
      return {
        success: result.success,
        loai: 'nguyen-can',
        data: result.data || [],
        error: result.error
      };
    }

    return { success: false, message: 'Hình thức thuê không hợp lệ' };

  }
}

module.exports = timKiemPhongService;
