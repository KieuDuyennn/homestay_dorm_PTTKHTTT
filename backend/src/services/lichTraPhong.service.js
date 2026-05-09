const LichTraPhong_DAO = require('../dao/lichTraPhong.dao');
const HopDong_DAO = require('../dao/hopDong.dao');

async function DangKyLichTraPhong(maHD, ngay, gio, maNV) {
  try {

    // 1. Kiểm tra trùng lịch
    const existed = await LichTraPhong_DAO.kiemTraTrungLich(ngay, gio);

    if (existed) {
      throw new Error('Khung giờ này đã có lịch trả phòng');
    }

    // 2. Tạo lịch trả phòng mới
    const lichTraPhong = await LichTraPhong_DAO.taoMoi(
      ngay,
      gio,
      maHD,
      maNV
    );

    // 3. Cập nhật trạng thái hợp đồng
    const hopDongUpdated = await HopDong_DAO.capNhatTrangThai(
      maHD,
      'Đã đăng ký lịch trả phòng'
    );

    return {
      success: true,
      data: {
        lichTraPhong,
        hopDong: hopDongUpdated
      }
    };

  } catch (error) {
    console.error('Lỗi khi đăng ký lịch trả phòng:', error);
    throw error;
  }
}

module.exports = {
  DangKyLichTraPhong
};