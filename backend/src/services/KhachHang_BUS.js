const KhachHang_DAO = require('../dao/KhachHang_DAO');

class KhachHang_BUS {
  static async findByCCCD(socccd) {
    return await KhachHang_DAO.findByCCCD(socccd);
  }

  static async insert(data) {
    return await KhachHang_DAO.insert(data);
  }
}

module.exports = KhachHang_BUS;
