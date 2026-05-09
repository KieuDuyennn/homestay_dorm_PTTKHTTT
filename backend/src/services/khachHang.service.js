const khachHangDao = require('../dao/khachHang.dao');

class khachHangService {
  static async findByCCCD(socccd) {
    return await khachHangDao.findByCCCD(socccd);
  }

  static async insert(data) {
    return await khachHangDao.insert(data);
  }

  static async sinhMa() {
    return await khachHangDao.sinhMaKhachHang();
  }
}

module.exports = khachHangService;
