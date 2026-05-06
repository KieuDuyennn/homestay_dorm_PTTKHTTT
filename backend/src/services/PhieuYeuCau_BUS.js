const KhachHang_DAO = require('../dao/KhachHang_DAO');
const PhieuYeuCau_DAO = require('../dao/PhieuYeuCau_DAO');

class PhieuYeuCau_BUS {
  static async taoPhieuYeuCau(data) {
    try {
      // 1. Kiểm tra Khách hàng đã tồn tại qua CCCD chưa
      let maKH;
      const khExist = await KhachHang_DAO.findByCCCD(data.CCCD);
      if (khExist.success && khExist.data) {
        maKH = khExist.data.makh;
      } else {
        maKH = `KH${Date.now().toString().slice(-6)}`; // Auto generate KH id
        const khachHangData = {
          makh: maKH,
          hoten: data.HoTen,
          sdt: data.SoDienThoai,
          diachicutru: data.DiaChi,
          email: data.Email,
          gioitinh: data.GioiTinh,
          ngaysinh: data.NgaySinh || null,
          socccd: data.CCCD,
          loaikhachhang: 'Cá nhân',
          trangthai: 'Mới'
        };

        const khResult = await KhachHang_DAO.insert(khachHangData);
        if (!khResult.success) {
          return { success: false, message: 'Không thể tạo thông tin khách hàng', error: khResult.error };
        }
      }

      // 2. Tạo Phiếu yêu cầu
      const maYC = `YC${Date.now().toString().slice(-6)}`;
      // Map hình thức thuê của frontend (Cá nhân, Ở ghép, Thuê nguyên căn) 
      // sang check constraint của DB (Ở ghép, Nguyên phòng)
      const hinhThucDb = (data.HinhThucThue === 'Thuê nguyên căn') ? 'Nguyên phòng' : 'Ở ghép';

      const phieuYeuCauData = {
        mayc: maYC,
        soluongdukien: parseInt(data.SoNguoiMuonThue) || 1,
        loaiphong: hinhThucDb,
        mucgia: parseFloat(data.MucGia) || 0,
        thoigiandukienvao: data.NgayDuKienDonVao || null,
        thoihanthue: parseInt(data.ThoiHanThue) || 6,
        yeucaukhac: data.YeuCauKhac || null,
        gioitinh: data.GioiTinh || null,           // Lưu giới tính từ form
        thoigianhenxem: data.ThoiGianHenXem || null, // Lưu lịch hẹn khi đặt
        trangthai: 'Cần xác nhận',
        loaihinhthue: hinhThucDb,
        makh: maKH,
        manv: data.MaNV || null,                   // Lấy từ nhân viên đang đăng nhập
      };

      const pycResult = await PhieuYeuCau_DAO.insert(phieuYeuCauData);
      if (!pycResult.success) {
        return { success: false, message: 'Không thể tạo phiếu yêu cầu', error: pycResult.error };
      }

      return { 
        success: true, 
        message: 'Tạo phiếu yêu cầu thành công',
        data: { MaYC: maYC, MaKH: maKH }
      };

    } catch (error) {
      console.error("Lỗi tại PhieuYeuCau_BUS.taoPhieuYeuCau:", error);
      return { success: false, message: 'Lỗi server khi tạo phiếu yêu cầu' };
    }
  }
}

module.exports = PhieuYeuCau_BUS;
