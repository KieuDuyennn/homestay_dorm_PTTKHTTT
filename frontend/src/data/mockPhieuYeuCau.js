export const MOCK_PHIEU_YEU_CAU = [
  // ─── HS001: Thuê lẻ – Cá nhân – Phòng CÒN TRỐNG → hiện nút "Tiến hành xác nhận thuê" ───
  {
    // PhieuYeuCauXemPhong_BUS
    maHoSo: "HS001",
    trangThai: "Cần xác nhận",   // "Cần xác nhận" | "Hoàn tất" | "Hủy thuê"
    ngayVaoO: "2025-07-01",      // Date – dùng để validate (không được là quá khứ)
    thoiHanThue: 6,              // Int – số tháng
    doiTuongThue: "Cá nhân",    // "Cá nhân" | "Đại diện nhóm"
    loaiHinhThue: "Thuê lẻ",    // "Thuê lẻ" | "Ở ghép" | "Nguyên căn"
    lyDoHuy: null,

    // KhachHang_BUS
    khachHang: {
      maKH: "KH001",
      hoTen: "Nguyễn Thị Mai",
      gioiTinh: "Nữ",
      sdt: "0901234567",
      cccd: "079201012345",
      quocTich: "Việt Nam",
      soNguoiDuKien: 1,          // Chỉ dùng cho Thuê lẻ
      tinhTrangTaiChinh: null,   // Chỉ dùng cho Nguyên căn / Ở ghép
    },

    // Phong_BUS
    phong: {
      maPhong: "P101",
      maChiNhanh: "CN01",
      loaiPhong: "Phòng đơn",
      tienThueThang: 3500000,    // Float – dùng để tính cọc ở UC5
      sucChua: 1,                // Int – sức chứa tối đa
      loaiHinhThue: "Thuê lẻ",
      trangThai: "Còn trống",   // "Còn trống" | "Đang giữ chỗ" | "Đang sử dụng"
      // dsGiuong cho Thuê lẻ chỉ có 1 giường
      dsGiuong: [
        { maGiuong: "G101", maPhong: "P101", tinhTrang: "Còn trống" }
      ],
    },
  },

  // ─── HS002: Ở ghép – Đại diện nhóm – Phòng ĐANG GIỮ CHỖ → hiện nút "Hủy thuê" ───
  {
    maHoSo: "HS002",
    trangThai: "Cần xác nhận",
    ngayVaoO: "2025-07-15",
    thoiHanThue: 12,
    doiTuongThue: "Đại diện nhóm",
    loaiHinhThue: "Ở ghép",
    lyDoHuy: null,

    khachHang: {
      maKH: "KH002",
      hoTen: "Trần Văn Bình",
      gioiTinh: "Nam",
      sdt: "0912345678",
      cccd: "079201056789",
      quocTich: "Việt Nam",
      soNguoiDuKien: null,
      tinhTrangTaiChinh: "Đi làm",  // Bắt buộc có với Ở ghép / Nguyên căn
    },

    phong: {
      maPhong: "P201",
      maChiNhanh: "CN01",
      loaiPhong: "Phòng ghép 4 giường",
      tienThueThang: 2000000,        // Giá mỗi giường/tháng
      sucChua: 4,
      loaiHinhThue: "Ở ghép",
      trangThai: "Đang giữ chỗ",    // → hiện nút "Hủy thuê"
      dsGiuong: [
        { maGiuong: "G201", maPhong: "P201", tinhTrang: "Đang giữ chỗ" },
        { maGiuong: "G202", maPhong: "P201", tinhTrang: "Đang giữ chỗ" },
        { maGiuong: "G203", maPhong: "P201", tinhTrang: "Còn trống" },
        { maGiuong: "G204", maPhong: "P201", tinhTrang: "Còn trống" },
      ],
    },
  },

  // ─── HS003: Nguyên căn – Đại diện nhóm – Phòng ĐANG SỬ DỤNG → hiện nút "Hủy thuê" ───
  {
    maHoSo: "HS003",
    trangThai: "Cần xác nhận",
    ngayVaoO: "2025-08-01",
    thoiHanThue: 24,
    doiTuongThue: "Đại diện nhóm",
    loaiHinhThue: "Nguyên căn",
    lyDoHuy: null,

    khachHang: {
      maKH: "KH003",
      hoTen: "Lê Minh Tuấn",
      gioiTinh: "Nam",
      sdt: "0987654321",
      cccd: "079201098765",
      quocTich: "Việt Nam",
      soNguoiDuKien: null,
      tinhTrangTaiChinh: "Kinh doanh",
    },

    phong: {
      maPhong: "P301",
      maChiNhanh: "CN02",
      loaiPhong: "Căn hộ studio",
      tienThueThang: 8000000,
      sucChua: 5,
      loaiHinhThue: "Nguyên căn",
      trangThai: "Đang sử dụng",    // → hiện nút "Hủy thuê"
      // Nguyên căn không có dsGiuong (thuê cả căn)
      dsGiuong: [],
    },
  },

  // ─── HS004: Thuê lẻ – Hoàn tất (đã xác nhận thuê, phòng đang giữ chỗ) ───
  {
    maHoSo: "HS004",
    trangThai: "Hoàn tất",
    ngayVaoO: "2025-06-01",
    thoiHanThue: 6,
    doiTuongThue: "Cá nhân",
    loaiHinhThue: "Thuê lẻ",
    lyDoHuy: null,

    khachHang: {
      maKH: "KH004",
      hoTen: "Phạm Thị Lan",
      gioiTinh: "Nữ",
      sdt: "0923456789",
      cccd: "079201034567",
      quocTich: "Việt Nam",
      soNguoiDuKien: 1,
      tinhTrangTaiChinh: null,
    },

    phong: {
      maPhong: "P102",
      maChiNhanh: "CN01",
      loaiPhong: "Phòng đơn",
      tienThueThang: 3500000,
      sucChua: 1,
      loaiHinhThue: "Thuê lẻ",
      trangThai: "Đang giữ chỗ",   // Sau UC4 phòng chuyển sang "Đang giữ chỗ"
      dsGiuong: [
        { maGiuong: "G102", maPhong: "P102", tinhTrang: "Đang giữ chỗ" }
      ],
    },
  },

  // ─── HS005: Ở ghép – Hủy thuê – có lý do hủy ───
  {
    maHoSo: "HS005",
    trangThai: "Hủy thuê",
    ngayVaoO: "2025-05-15",
    thoiHanThue: 3,
    doiTuongThue: "Đại diện nhóm",
    loaiHinhThue: "Ở ghép",
    lyDoHuy: "Khách liên hệ báo không còn nhu cầu thuê phòng do thay đổi kế hoạch công tác.",

    khachHang: {
      maKH: "KH005",
      hoTen: "Võ Thị Hương",
      gioiTinh: "Nữ",
      sdt: "0934567890",
      cccd: "079201045678",
      quocTich: "Việt Nam",
      soNguoiDuKien: null,
      tinhTrangTaiChinh: "Sinh viên",
    },

    phong: {
      maPhong: "P202",
      maChiNhanh: "CN01",
      loaiPhong: "Phòng ghép 4 giường",
      tienThueThang: 2000000,
      sucChua: 4,
      loaiHinhThue: "Ở ghép",
      trangThai: "Đang sử dụng",
      dsGiuong: [
        { maGiuong: "G205", maPhong: "P202", tinhTrang: "Đang sử dụng" },
        { maGiuong: "G206", maPhong: "P202", tinhTrang: "Đang sử dụng" },
        { maGiuong: "G207", maPhong: "P202", tinhTrang: "Còn trống" },
        { maGiuong: "G208", maPhong: "P202", tinhTrang: "Còn trống" },
      ],
    },
  },
];

class PhieuYeuCauXemPhong_BUS {
  static layDanhSachPYC() {
    const localData = localStorage.getItem('phieu_yeu_cau_data');
    if (localData) return JSON.parse(localData);
    return MOCK_PHIEU_YEU_CAU;
  }

  static layChiTietPYC(maHoSo) {
    const ds = this.layDanhSachPYC();
    return ds.find(p => p.maHoSo === maHoSo);
  }

  static capNhatPYC(phieuMoi) {
    const ds = this.layDanhSachPYC();
    const index = ds.findIndex(p => p.maHoSo === phieuMoi.maHoSo);
    if (index !== -1) {
      ds[index] = phieuMoi;
      localStorage.setItem('phieu_yeu_cau_data', JSON.stringify(ds));
      return true;
    }
    return false;
  }
}

export default PhieuYeuCauXemPhong_BUS;
