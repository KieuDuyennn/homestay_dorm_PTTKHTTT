const chiTietPhieuYeuCauDao = require('../dao/chiTietPhieuYeuCau.dao');

class chiTietPhieuYeuCauService {
  static async layChiTiet(mayc) {
    try {
      return await chiTietPhieuYeuCauDao.getChiTiet(mayc);
    } catch (error) {
      console.error('Lỗi chiTietPhieuYeuCauService.layChiTiet:', error);
      return { success: false, error };
    }
  }

  static async updateTrangThaiChot(mayc, maphong, magiuong, trangthaichot) {
    try {
      return await chiTietPhieuYeuCauDao.updateTrangThaiChot(mayc, maphong, magiuong, trangthaichot);
    } catch (error) {
      console.error('Lỗi chiTietPhieuYeuCauService.updateTrangThaiChot:', error);
      return { success: false, error };
    }
  }

  static async deleteChiTiet(mayc, maphong, magiuong) {
    try {
      return await chiTietPhieuYeuCauDao.deleteChiTiet(mayc, maphong, magiuong);
    } catch (error) {
      console.error('Lỗi chiTietPhieuYeuCauService.deleteChiTiet:', error);
      return { success: false, error };
    }
  }

  static async luuNhieuChiTiet(items) {
    try {
      return await chiTietPhieuYeuCauDao.insertChiTietMany(items);
    } catch (error) {
      console.error('Lỗi chiTietPhieuYeuCauService.luuNhieuChiTiet:', error);
      return { success: false, error };
    }
  }
}

module.exports = chiTietPhieuYeuCauService;
