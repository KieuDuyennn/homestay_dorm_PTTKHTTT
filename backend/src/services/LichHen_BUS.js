const LichHen_DAO = require('../dao/LichHen_DAO');

class LichHen_BUS {
  static async layGioBoiTheoNgay(manv, ngay) {
    return await LichHen_DAO.layGioBoiTheoNgay(manv, ngay);
  }
}

module.exports = LichHen_BUS;
