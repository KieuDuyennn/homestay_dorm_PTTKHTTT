export const MOCK_THANH_TOAN = [
  // ─── TT001: Chờ tính cọc – kế toán chưa xử lý (liên kết HS004) ───
  {
    // ThanhToan_BUS
    maThanhToan: "TT001",
    maHoSo: "HS004",             // Liên kết với phiếu đã "Hoàn tất"
    loaiTT: "Thanh toán cọc",
    trangThai: "Chờ tính cọc",  // "Chờ tính cọc" | "Chờ thanh toán" | "Quá thời hạn" | "Chờ đối soát" | "Đối soát thành công" | "Đối soát thất bại"
    tongTienCoc: null,           // null khi chưa kế toán tính
    thoiHanThanhToan: null,      // null khi chưa tạo yêu cầu
    thoiDiemTaiChungTu: null,
    chungTuHinhAnh: null,
    nhanVienTaiLen: null,
    lyDoTuChoi: null,
  },

  // ─── TT002: Chờ thanh toán – kế toán đã tính, Sale chưa upload (liên kết HS001 giả sử đã hoàn tất) ───
  {
    maThanhToan: "TT002",
    maHoSo: "HS001",
    loaiTT: "Thanh toán cọc",
    trangThai: "Chờ thanh toán",
    tongTienCoc: 7000000,        // = tienThueThang (3.500.000) x 2 tháng x 1 giường
    thoiHanThanhToan: "2025-06-20T10:30:00", // DateTime – deadline 24h từ lúc tạo
    thoiDiemTaiChungTu: null,
    chungTuHinhAnh: null,
    nhanVienTaiLen: null,
    lyDoTuChoi: null,
  },

  // ─── TT003: Chờ đối soát – Sale đã upload minh chứng, quản lý chưa duyệt ───
  {
    maThanhToan: "TT003",
    maHoSo: "HS003",
    loaiTT: "Thanh toán cọc",
    trangThai: "Chờ đối soát",
    tongTienCoc: 16000000,       // = 8.000.000 x 2 tháng x 1 (nguyên căn)
    thoiHanThanhToan: "2025-06-18T09:00:00",
    thoiDiemTaiChungTu: "2025-06-17T14:23:00",
    chungTuHinhAnh: "mock_chungtu_tt003.jpg", // Tên file mock, UI hiển thị placeholder
    nhanVienTaiLen: "sale01",
    lyDoTuChoi: null,
  },

  // ─── TT004: Đối soát thành công – phòng đã khóa ───
  {
    maThanhToan: "TT004",
    maHoSo: "HS002",
    loaiTT: "Thanh toán cọc",
    trangThai: "Đối soát thành công",
    tongTienCoc: 8000000,        // = 2.000.000 x 2 tháng x 2 giường thuê
    thoiHanThanhToan: "2025-06-10T08:00:00",
    thoiDiemTaiChungTu: "2025-06-09T16:45:00",
    chungTuHinhAnh: "mock_chungtu_tt004.jpg",
    nhanVienTaiLen: "sale01",
    lyDoTuChoi: null,
  },

  // ─── TT005: Đối soát thất bại – quản lý từ chối ───
  {
    maThanhToan: "TT005",
    maHoSo: "HS005",
    loaiTT: "Thanh toán cọc",
    trangThai: "Đối soát thất bại",
    tongTienCoc: 4000000,
    thoiHanThanhToan: "2025-06-05T08:00:00",
    thoiDiemTaiChungTu: "2025-06-04T11:20:00",
    chungTuHinhAnh: "mock_chungtu_tt005.jpg",
    nhanVienTaiLen: "sale01",
    lyDoTuChoi: "Số tiền trong minh chứng không khớp với yêu cầu thanh toán. Khách đã chuyển thiếu 500.000đ.",
  },
];

class ThanhToan_BUS {
  static layDanhSachThanhToan() {
    const localData = localStorage.getItem('thanh_toan_data');
    if (localData) return JSON.parse(localData);
    return MOCK_THANH_TOAN;
  }

  static layThanhToanTheoHoSo(maHoSo) {
    const ds = this.layDanhSachThanhToan();
    return ds.find(t => t.maHoSo === maHoSo);
  }

  static capNhatThanhToan(ttMoi) {
    const ds = this.layDanhSachThanhToan();
    const index = ds.findIndex(t => t.maThanhToan === ttMoi.maThanhToan);
    if (index !== -1) {
      ds[index] = ttMoi;
      localStorage.setItem('thanh_toan_data', JSON.stringify(ds));
      return true;
    }
    return false;
  }
}

export default ThanhToan_BUS;
