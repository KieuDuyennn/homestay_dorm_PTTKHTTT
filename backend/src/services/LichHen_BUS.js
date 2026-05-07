const LichHen_DAO = require('../dao/LichHen_DAO');

class LichHen_BUS {
  static async layGioBanTheoNgay(manv, ngay) {
    return await LichHen_DAO.layGioBanTheoNgay(manv, ngay);
  }
}

module.exports = LichHen_BUS;
