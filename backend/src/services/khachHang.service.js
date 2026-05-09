const khachHangDao = require('../dao/khachHang.dao');

class khachHangService {
  static async findByCCCD(socccd) {
    return await khachHangDao.findByCCCD(socccd);
  }

  static async insert(data) {
    return await khachHangDao.insert(data);
  }

  static async updateThongTin(makh, data) {
    return await khachHangDao.updateThongTin(makh, data);
  }

  static async sinhMa() {
    return await khachHangDao.sinhMaKhachHang();
  }

  static async updateStatus(makh, trangthai) {
    return await khachHangDao.updateStatus(makh, trangthai);
  }
}

module.exports = khachHangService;
