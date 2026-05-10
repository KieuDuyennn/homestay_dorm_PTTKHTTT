const LichTraPhong_DAO = require('../dao/lichTraPhong.dao');
const HopDong_DAO = require('../dao/hopDong.dao');

async function DangKyLichTraPhong(maHD, ngay, gio, maNV) {
  try {

    // 1. Tạo lịch trả phòng mới
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

async function LayKhungGioTrong(ngay) {
  // 1. Định nghĩa các khung giờ có thể đăng ký
  const allSlots = [
    "08:00", "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // 2. Lấy các lịch đã có trong ngày
  const takenSchedules = await LichTraPhong_DAO.layLichTheoNgay(ngay);
  const takenSlots = takenSchedules.map(item => {
    // Supabase có thể trả về "HH:mm:ss", ta chỉ lấy "HH:mm"
    return item.gio.substring(0, 5);
  });

  // 3. Lọc ra các khung giờ còn trống
  const availableSlots = allSlots.filter(slot => !takenSlots.includes(slot));

  return availableSlots;
}

module.exports = {
  DangKyLichTraPhong,
  LayKhungGioTrong
};