const bienBanTraPhongDAO = require('../dao/bienBanTraPhong.dao');
const hopDongDAO = require('../dao/hopDong.dao');
const BangDoiSoat_BUS = require('./bangDoiSoat.service');
const BienBanBanGiao_BUS = require('./bienBanBanGiao.service');
const BaoCao_BUS = require('./baoCaoTinhTrangPhong.service');

class BienBanTraPhong_BUS {
  static async Tao(maHD, maNV) {
    // 1. Validate contract status
    const hopDong = await hopDongDAO.docTheoMa(maHD);
    if (!hopDong) throw new Error('Không tìm thấy hợp đồng');
    
    if (hopDong.trangthai !== 'Đã đối soát') {
      throw new Error('Hợp đồng chưa ở trạng thái Đã đối soát');
    }

    // 2. Generate ID
    const maBBTP = await bienBanTraPhongDAO.sinhMaBienBanTraPhong();

    // 3. Create report
    const newBB = {
      mabienbantp: maBBTP,
      ngaylap: new Date().toISOString().split('T')[0],
      trangthai: 'Chưa xác nhận',
      mahd: maHD,
      manv: maNV || 'NV01' 
    };

    const createdReport = await bienBanTraPhongDAO.them(newBB);

    // 4. Update contract status to 'Chờ ký biên bản trả phòng'
    await hopDongDAO.capNhatTrangThai(maHD, 'Chờ ký biên bản trả phòng');

    return createdReport;
  }

  static async SinhMaBienBan() {
    return await bienBanTraPhongDAO.sinhMaBienBanTraPhong();
  }

  static async LayTheoMa(maBBTP) {
    const report = await bienBanTraPhongDAO.docTheoMa(maBBTP);
    if (!report) return null;

    const maHD = report.mahd;

    // Aggregate related data for print preview
    const [reconciliation, handover, roomReport] = await Promise.all([
      BangDoiSoat_BUS.LayTheoMaHD(maHD),
      BienBanBanGiao_BUS.LayTaiSanTheoHopDong(maHD),
      BaoCao_BUS.LayTheoHopDong(maHD)
    ]);

    return {
      ...report,
      reconciliation,
      handover,
      roomReport
    };
  }

  static async CapNhatTrangThai(ma, tt) {
    return await bienBanTraPhongDAO.capNhatTrangThai(ma, tt);
  }
}

module.exports = BienBanTraPhong_BUS;
