-- ============================================================
-- HỆ THỐNG QUẢN LÝ NHÀ TRỌ
-- PostgreSQL Script: Tạo database, bảng, ràng buộc, dữ liệu mẫu
-- ============================================================

-- Tạo database (chạy riêng nếu cần)
-- CREATE DATABASE homestay_dorm;
-- \c homestay_dorm;

-- Xóa bảng cũ nếu tồn tại (theo thứ tự phụ thuộc FK)
DROP TABLE IF EXISTS CHI_TIET_BAN_GIAO CASCADE;
DROP TABLE IF EXISTS LICH_TRA_PHONG CASCADE;
DROP TABLE IF EXISTS BAO_CAO_TINH_TRANG_PHONG CASCADE;
DROP TABLE IF EXISTS KHOAN_KHAU_TRU CASCADE;
DROP TABLE IF EXISTS BANG_DOI_SOAT CASCADE;
DROP TABLE IF EXISTS BIEN_BAN_TRA_PHONG CASCADE;
DROP TABLE IF EXISTS BIEN_BAN_VI_PHAM CASCADE;
DROP TABLE IF EXISTS HOP_DONG_GIUONG CASCADE;
DROP TABLE IF EXISTS BIEN_BAN_BAN_GIAO CASCADE;
DROP TABLE IF EXISTS TAI_SAN_TRANG_THIET_BI CASCADE;
DROP TABLE IF EXISTS THANH_TOAN CASCADE;
DROP TABLE IF EXISTS HOP_DONG CASCADE;
DROP TABLE IF EXISTS CHI_TIET_PHIEU_YEU_CAU CASCADE;
DROP TABLE IF EXISTS PHIEU_YEU_CAU_XEM_PHONG CASCADE;
DROP TABLE IF EXISTS TAI_KHOAN CASCADE;
DROP TABLE IF EXISTS NHAN_VIEN CASCADE;
DROP TABLE IF EXISTS KHACH_HANG CASCADE;
DROP TABLE IF EXISTS NHOM_KHACH_THUE CASCADE;
DROP TABLE IF EXISTS CHI_NHANH_DICH_VU CASCADE;
DROP TABLE IF EXISTS DICH_VU CASCADE;
DROP TABLE IF EXISTS GIUONG CASCADE;
DROP TABLE IF EXISTS PHONG CASCADE;
DROP TABLE IF EXISTS CHI_NHANH CASCADE;

-- ============================================================
-- 1. CHI NHÁNH
-- ============================================================
CREATE TABLE CHI_NHANH (
    MaCN        VARCHAR(10)     PRIMARY KEY,
    TenCN       VARCHAR(100)    NOT NULL,
    DiaChi      VARCHAR(200)    NOT NULL,
    SoLuongPhong INT            NOT NULL CHECK (SoLuongPhong >= 0),
    NoiQuy      TEXT,
    QuyDinhCoc  TEXT
);

-- ============================================================
-- 2. PHÒNG
-- ============================================================
CREATE TABLE PHONG (
    MaPhong         VARCHAR(10)     PRIMARY KEY,
    SoLuongGiuong   INT             NOT NULL CHECK (SoLuongGiuong > 0),
    GioiTinh        VARCHAR(10)     NOT NULL CHECK (GioiTinh IN ('Nam', 'Nữ', 'Hỗn hợp')),
    LoaiHinh        VARCHAR(50)     NOT NULL CHECK (LoaiHinh IN ('Ở ghép', 'Nguyên phòng')),
    TienThueThang   NUMERIC(12,0)   NOT NULL CHECK (TienThueThang > 0),
    TrangThai       VARCHAR(30)     NOT NULL CHECK (TrangThai IN ('Còn trống', 'Đã đầy', 'Đang bảo trì')),
    MaCN            VARCHAR(10)     NOT NULL REFERENCES CHI_NHANH(MaCN)
);

-- ============================================================
-- 3. GIƯỜNG
-- ============================================================
CREATE TABLE GIUONG (
    MaGiuong    VARCHAR(10)     NOT NULL,
    MaPhong     VARCHAR(10)     NOT NULL REFERENCES PHONG(MaPhong),
    GiaGiuong   NUMERIC(12,0)   NOT NULL CHECK (GiaGiuong > 0),
    TinhTrang   VARCHAR(20)     NOT NULL CHECK (TinhTrang IN ('Chưa sử dụng', 'Đang sử dụng')),
    PRIMARY KEY (MaGiuong, MaPhong)
);

-- ============================================================
-- 4. DỊCH VỤ
-- ============================================================
CREATE TABLE DICH_VU (
    MaDV    VARCHAR(10)     PRIMARY KEY,
    TenDV   VARCHAR(100)    NOT NULL,
    Gia     NUMERIC(12,0)   NOT NULL CHECK (Gia >= 0)
);

-- ============================================================
-- 5. CHI NHÁNH - DỊCH VỤ (bảng trung gian)
-- ============================================================
CREATE TABLE CHI_NHANH_DICH_VU (
    MaCN    VARCHAR(10) NOT NULL REFERENCES CHI_NHANH(MaCN),
    MaDV    VARCHAR(10) NOT NULL REFERENCES DICH_VU(MaDV),
    PRIMARY KEY (MaCN, MaDV)
);

-- ============================================================
-- 6. NHÂN VIÊN
-- ============================================================
CREATE TABLE NHAN_VIEN (
    MaNV        VARCHAR(10)     PRIMARY KEY,
    HoTen       VARCHAR(100)    NOT NULL,
    SoDienThoai VARCHAR(15)     NOT NULL UNIQUE,
    Email       VARCHAR(100)    UNIQUE,
    CCCD        VARCHAR(12)     NOT NULL UNIQUE,
    LoaiNV      VARCHAR(30)     NOT NULL CHECK (LoaiNV IN ('Quản lý', 'Sale', 'Kế toán', 'Kỹ thuật'))
);

-- ============================================================
-- 7. TÀI KHOẢN
-- ============================================================
CREATE TABLE TAI_KHOAN (
    MaDangNhap  VARCHAR(50)     PRIMARY KEY,
    MatKhau     VARCHAR(255)    NOT NULL,
    MaNV        VARCHAR(10)     NOT NULL UNIQUE REFERENCES NHAN_VIEN(MaNV)
);

-- ============================================================
-- 8. NHÓM KHÁCH THUÊ
-- ============================================================
CREATE TABLE NHOM_KHACH_THUE (
    MaNhom          VARCHAR(10)     PRIMARY KEY,
    SoLuong         INT             NOT NULL CHECK (SoLuong > 0),
    GioiTinh        VARCHAR(10)     NOT NULL CHECK (GioiTinh IN ('Nam', 'Nữ', 'Hỗn hợp')),
    HinhThucThue    VARCHAR(30)     NOT NULL CHECK (HinhThucThue IN ('Thuê nguyên phòng', 'Ở ghép')),
    TrangThai       VARCHAR(20)     NOT NULL CHECK (TrangThai IN ('Mới', 'Chờ kiểm tra', 'Hợp lệ', 'Không hợp lệ')),
    MaKHDaiDien     VARCHAR(10)     -- FK tới KHACH_HANG, thêm sau khi tạo bảng KH
);

-- ============================================================
-- 9. KHÁCH HÀNG
-- ============================================================
CREATE TABLE KHACH_HANG (
    MaKH            VARCHAR(10)     PRIMARY KEY,
    HoTen           VARCHAR(100)    NOT NULL,
    GioiTinh        VARCHAR(5)      NOT NULL CHECK (GioiTinh IN ('Nam', 'Nữ')),
    Email           VARCHAR(100),
    NgaySinh        DATE            NOT NULL,
    SDT             VARCHAR(15)     NOT NULL,
    SoCCCD          VARCHAR(12)     NOT NULL UNIQUE,
    HinhMatTruoc    VARCHAR(255),
    HinhMatSau      VARCHAR(255),
    NoiCapCCCD      VARCHAR(200),
    NgayCapCCCD     DATE,
    NgayHetHanCCCD  DATE,
    QuocTich        VARCHAR(50)     DEFAULT 'Việt Nam',
    DiaChiCuTru     VARCHAR(255),
    LoaiKhachHang   VARCHAR(30)     NOT NULL CHECK (LoaiKhachHang IN ('Cá nhân', 'Nhóm')),
    TrangThai       VARCHAR(20)     NOT NULL CHECK (TrangThai IN ('Mới', 'Chờ kiểm tra', 'Hợp lệ', 'Không hợp lệ')),
    MaNhom          VARCHAR(10)     REFERENCES NHOM_KHACH_THUE(MaNhom),
    CONSTRAINT chk_ngay_cccd CHECK (NgayHetHanCCCD IS NULL OR NgayHetHanCCCD > NgayCapCCCD)
);

-- Thêm FK cho NHOM_KHACH_THUE sau khi KHACH_HANG đã tạo
ALTER TABLE NHOM_KHACH_THUE
    ADD CONSTRAINT fk_nhom_kh_dai_dien FOREIGN KEY (MaKHDaiDien) REFERENCES KHACH_HANG(MaKH);

-- ============================================================
-- 10. PHIẾU YÊU CẦU XEM PHÒNG
-- ============================================================
CREATE TABLE PHIEU_YEU_CAU_XEM_PHONG (
    MaYC                VARCHAR(10)     PRIMARY KEY,
    SoLuongDuKien       INT             NOT NULL CHECK (SoLuongDuKien > 0),
    LoaiPhong           VARCHAR(30)     NOT NULL CHECK (LoaiPhong IN ('Ở ghép', 'Nguyên phòng')),
    MucGia              NUMERIC(12,0),
    ThoiGianDuKienVao   DATE,
    ThoiHanThue         INT             CHECK (ThoiHanThue > 0),   -- số tháng
    ThoiGianHenXem      TIMESTAMP,
    YeuCauKhac          TEXT,
    GioiTinh            VARCHAR(10)     CHECK (GioiTinh IN ('Nam', 'Nữ', 'Hỗn hợp')),
    NgayGuiYeuCau       TIMESTAMP       NOT NULL DEFAULT NOW(),
    TrangThai           VARCHAR(30)     NOT NULL CHECK (TrangThai IN ('Đang hẹn xem', 'Cần xác nhận', 'Hủy thuê', 'Hoàn tất')),
    LyDoHuy             TEXT,
    LoaiHinhThue        VARCHAR(30)     CHECK (LoaiHinhThue IN ('Ở ghép', 'Nguyên phòng')),
    MaNV                VARCHAR(10)     REFERENCES NHAN_VIEN(MaNV),
    MaKH                VARCHAR(10)     NOT NULL REFERENCES KHACH_HANG(MaKH)
);

-- ============================================================
-- 11. CHI TIẾT PHIẾU YÊU CẦU
-- ============================================================
CREATE TABLE CHI_TIET_PHIEU_YEU_CAU (
    MaYC            VARCHAR(10)     NOT NULL REFERENCES PHIEU_YEU_CAU_XEM_PHONG(MaYC),
    MaGiuong        VARCHAR(10)     NOT NULL,
    MaPhong         VARCHAR(10)     NOT NULL,
    TrangThaiChot   VARCHAR(20)     NOT NULL CHECK (TrangThaiChot IN ('Chốt', 'Không chốt')),
    PRIMARY KEY (MaYC, MaGiuong, MaPhong),
    FOREIGN KEY (MaGiuong, MaPhong) REFERENCES GIUONG(MaGiuong, MaPhong)
);

-- ============================================================
-- 12. HỢP ĐỒNG
-- ============================================================
CREATE TABLE HOP_DONG (
    MaHD            VARCHAR(10)     PRIMARY KEY,
    SoLuongGiuong   INT             NOT NULL CHECK (SoLuongGiuong > 0),
    KyThanhToan     INT             NOT NULL CHECK (KyThanhToan > 0),   -- số tháng/kỳ
    NgayBatDau      DATE            NOT NULL,
    ThoiHanThue     INT             NOT NULL CHECK (ThoiHanThue > 0),   -- số tháng
    GiaThue         NUMERIC(12,0)   NOT NULL CHECK (GiaThue > 0),
    NgayKetThuc     DATE,
    TrangThai       VARCHAR(60)     NOT NULL CHECK (TrangThai IN (
                        'Mới', 'Chưa xác nhận', 'Đã ký xác nhận', 'Đã hủy',
                        'Đã đăng ký lịch trả phòng', 'Đã đối soát',
                        'Chờ ký biên bản trả phòng',
                        'Đã hoàn tất thủ tục trả phòng', 'Đã thanh lý')),
    LyDoHuy         TEXT,
    MinhChungKy     VARCHAR(255),
    MaKH            VARCHAR(10)     NOT NULL REFERENCES KHACH_HANG(MaKH),
    CONSTRAINT chk_ngay_hop_dong CHECK (NgayKetThuc IS NULL OR NgayKetThuc > NgayBatDau)
);

-- ============================================================
-- 13. HỢP ĐỒNG - GIƯỜNG (bảng trung gian)
-- ============================================================
CREATE TABLE HOP_DONG_GIUONG (
    MaHD        VARCHAR(10)     NOT NULL REFERENCES HOP_DONG(MaHD),
    MaGiuong    VARCHAR(10)     NOT NULL,
    MaPhong     VARCHAR(10)     NOT NULL,
    PRIMARY KEY (MaHD, MaGiuong, MaPhong),
    FOREIGN KEY (MaGiuong, MaPhong) REFERENCES GIUONG(MaGiuong, MaPhong)
);

-- ============================================================
-- 14. THANH TOÁN
-- ============================================================
CREATE TABLE THANH_TOAN (
    MaTT                VARCHAR(10)     PRIMARY KEY,
    LoaiTT              VARCHAR(30)     NOT NULL CHECK (LoaiTT IN ('Tiền cọc', 'Tiền thuê', 'Phí dịch vụ', 'Phí phạt', 'Hoàn cọc', 'Thanh toán thêm')),
    SoTien              NUMERIC(12,0)   NOT NULL CHECK (SoTien >= 0),
    ThoiDiemYeuCau      TIMESTAMP       NOT NULL DEFAULT NOW(),
    ThoiDiemHetHan      TIMESTAMP,
    ThoiDiemThanhToan   TIMESTAMP,
    -- TinhTrangYeuCau: trạng thái của yêu cầu thanh toán (luồng xử lý nghiệp vụ)
    TinhTrangYeuCau     VARCHAR(60) NOT NULL,
    -- TrangThai: trạng thái giao dịch thực tế của khoản thanh toán
    TrangThai           VARCHAR(30)     NOT NULL CHECK (TrangThai IN (
                            'Mới',
                            'Chờ thanh toán',
                            'Đang thanh toán',
                            'Đã thanh toán',
                            'Thanh toán thất bại', 
							'Chờ tính cọc',
                            'Quá thời hạn/Chờ thanh toán',
                            'Chờ đối soát',
                            'Đối soát thành công',
                            'Đối soát thất bại')),
    ChungTuHinhAnh      VARCHAR(255),
    ThoiDiemTaiChungTu  TIMESTAMP,
    PhuongThucThanhToan VARCHAR(50)     CHECK (PhuongThucThanhToan IN ('Tiền mặt', 'Chuyển khoản', 'Thẻ')),
    GhiChu              TEXT,
    MaYC                VARCHAR(10)     REFERENCES PHIEU_YEU_CAU_XEM_PHONG(MaYC),
    MaKH                VARCHAR(10)     REFERENCES KHACH_HANG(MaKH),
    MaHD                VARCHAR(10)     REFERENCES HOP_DONG(MaHD),
    MaNVKT              VARCHAR(10)     REFERENCES NHAN_VIEN(MaNV),
    MaNVSale            VARCHAR(10)     REFERENCES NHAN_VIEN(MaNV)
);

-- ============================================================
-- 15. BIÊN BẢN VI PHẠM
-- ============================================================
CREATE TABLE BIEN_BAN_VI_PHAM (
    MaBienBanVP VARCHAR(10)     PRIMARY KEY,
    Loi         TEXT            NOT NULL,
    NgayLap     DATE            NOT NULL DEFAULT CURRENT_DATE,
    TrangThai   VARCHAR(30)     NOT NULL CHECK (TrangThai IN ('Mới', 'Đã xác nhận', 'Đã giải quyết')),
    PhiPhat     NUMERIC(12,0)   NOT NULL CHECK (PhiPhat >= 0),
    MaHD        VARCHAR(10)     NOT NULL REFERENCES HOP_DONG(MaHD)
);

-- ============================================================
-- 16. BIÊN BẢN TRẢ PHÒNG
-- ============================================================
CREATE TABLE BIEN_BAN_TRA_PHONG (
    MaBienBanTP VARCHAR(10)     PRIMARY KEY,
    NgayLap     DATE            NOT NULL DEFAULT CURRENT_DATE,
    TrangThai   VARCHAR(30)     NOT NULL CHECK (TrangThai IN ('Chưa xác nhận', 'Đã ký xác nhận')),
    NgayKy      DATE,
    MinhChungKy VARCHAR(255),
    MaHD        VARCHAR(10)     NOT NULL REFERENCES HOP_DONG(MaHD),
    MaNV        VARCHAR(10)     NOT NULL REFERENCES NHAN_VIEN(MaNV)
);

-- ============================================================
-- 17. LỊCH TRẢ PHÒNG
-- ============================================================
CREATE TABLE LICH_TRA_PHONG (
    MaLichTraPhong  VARCHAR(10)     PRIMARY KEY,
    Ngay            DATE            NOT NULL,
    Gio             TIME            NOT NULL,
    TrangThai       VARCHAR(30)     NOT NULL CHECK (TrangThai IN ('Chưa xác nhận', 'Đã xác nhận')),
    MaHD            VARCHAR(10)     NOT NULL REFERENCES HOP_DONG(MaHD),
    MaNV            VARCHAR(10)     NOT NULL REFERENCES NHAN_VIEN(MaNV)
);

-- ============================================================
-- 18. TÀI SẢN VÀ TRANG THIẾT BỊ
-- ============================================================
CREATE TABLE TAI_SAN_TRANG_THIET_BI (
    MaVatDung   VARCHAR(10)     PRIMARY KEY,
    TenVatDung  VARCHAR(100)    NOT NULL,
    MoTa        TEXT,
    TrangThai   VARCHAR(20)     NOT NULL CHECK (TrangThai IN ('Đã bàn giao', 'Chưa bàn giao', 'Hỏng')),
    MaPhong     VARCHAR(10)     NOT NULL REFERENCES PHONG(MaPhong)
);

-- ============================================================
-- 19. BIÊN BẢN BÀN GIAO
-- ============================================================
CREATE TABLE BIEN_BAN_BAN_GIAO (
    MaBienBan       VARCHAR(10)     PRIMARY KEY,
    ThoiDiemNhan    TIMESTAMP       NOT NULL,
    GhiChu          TEXT,
    TrangThai       VARCHAR(30)     NOT NULL CHECK (TrangThai IN (
                        'Mới', 'Chưa xác nhận', 'Đã ký xác nhận', 
                        'Hủy bàn giao', 'Đã trả phòng')),
    MinhChungKy     VARCHAR(255),
    ThoiDiemTra     TIMESTAMP,
    MaHD            VARCHAR(10)     NOT NULL REFERENCES HOP_DONG(MaHD),
    MaNV            VARCHAR(10)     NOT NULL REFERENCES NHAN_VIEN(MaNV)
);

-- ============================================================
-- 20. BÁO CÁO TÌNH TRẠNG PHÒNG
-- ============================================================
CREATE TABLE BAO_CAO_TINH_TRANG_PHONG (
    MaBaoCao        VARCHAR(10)     PRIMARY KEY,
    NgayLap         DATE            NOT NULL DEFAULT CURRENT_DATE,
    KetQuaVeSinh    VARCHAR(20)     NOT NULL CHECK (KetQuaVeSinh IN ('Tốt', 'Trung bình', 'Kém')),
    DaKiemTraHD     BOOLEAN         NOT NULL DEFAULT FALSE,
    TrangThai       VARCHAR(30)     NOT NULL CHECK (TrangThai IN ('Chưa xác nhận', 'Đã xác nhận')),
    NgayKy          DATE,
    MaHD            VARCHAR(10)     NOT NULL REFERENCES HOP_DONG(MaHD)
);

-- ============================================================
-- 21. BẢNG ĐỐI SOÁT
-- ============================================================
CREATE TABLE BANG_DOI_SOAT (
    MaDoiSoat           VARCHAR(10)     PRIMARY KEY,
    NgayLap             DATE            NOT NULL DEFAULT CURRENT_DATE,
    TrangThai           VARCHAR(20)     NOT NULL CHECK (TrangThai IN ('Chưa xác nhận', 'Đã xác nhận')),
    NgayKy              DATE,
    HinhAnhDoiChung     VARCHAR(255),
    MinhChungKy         VARCHAR(255),
    SoTienCoc           NUMERIC(12,0)   CHECK (SoTienCoc >= 0),
    PhanTramHoanCoc     NUMERIC(5,2)    CHECK (PhanTramHoanCoc BETWEEN 0 AND 100),
    PhiPhatSinh         NUMERIC(12,0)   CHECK (PhiPhatSinh >= 0),
    SoTienThanhToanThem NUMERIC(12,0)   CHECK (SoTienThanhToanThem >= 0),
    SoTienHoanCoc       NUMERIC(12,0)   CHECK (SoTienHoanCoc >= 0),
    MaHD                VARCHAR(10)     NOT NULL REFERENCES HOP_DONG(MaHD),
    MaNV                VARCHAR(10)     NOT NULL REFERENCES NHAN_VIEN(MaNV)
);

-- ============================================================
-- 22. KHOẢN KHẤU TRỪ
-- ============================================================
CREATE TABLE KHOAN_KHAU_TRU (
    MaDoiSoat   VARCHAR(10)     NOT NULL REFERENCES BANG_DOI_SOAT(MaDoiSoat),
    TenKhoan    VARCHAR(100)    NOT NULL,
    SoTien      NUMERIC(12,0)   NOT NULL CHECK (SoTien >= 0),
    PRIMARY KEY (MaDoiSoat, TenKhoan)
);

-- ============================================================
-- 23. CHI TIẾT BÀN GIAO
-- ============================================================
CREATE TABLE CHI_TIET_BAN_GIAO (
    MaBienBan       VARCHAR(10)     NOT NULL REFERENCES BIEN_BAN_BAN_GIAO(MaBienBan),
    MaVatDung       VARCHAR(10)     NOT NULL REFERENCES TAI_SAN_TRANG_THIET_BI(MaVatDung),
    SoLuong         INT             NOT NULL CHECK (SoLuong > 0),
    HienTrangNhan   TEXT,
    HienTrangTra    TEXT,
    HinhAnh         VARCHAR(255),
    PhiDenBu        NUMERIC(12,0)   DEFAULT 0 CHECK (PhiDenBu >= 0),
    MaBaoCao        VARCHAR(10)     REFERENCES BAO_CAO_TINH_TRANG_PHONG(MaBaoCao),
    PRIMARY KEY (MaBienBan, MaVatDung)
);

-- ============================================================
-- INDEX cho các cột tra cứu thường xuyên
-- ============================================================
CREATE INDEX idx_phong_macn ON PHONG(MaCN);
CREATE INDEX idx_giuong_maphong ON GIUONG(MaPhong);
CREATE INDEX idx_kh_manhom ON KHACH_HANG(MaNhom);
CREATE INDEX idx_hopdong_makh ON HOP_DONG(MaKH);
CREATE INDEX idx_thanhtoan_mahd ON THANH_TOAN(MaHD);
CREATE INDEX idx_thanhtoan_makh ON THANH_TOAN(MaKH);
CREATE INDEX idx_phieuyeucau_makh ON PHIEU_YEU_CAU_XEM_PHONG(MaKH);


-- ============================================================
-- ============================================================
-- DỮ LIỆU MẪU
-- ============================================================
-- ============================================================

-- ============================================================
-- CHI NHÁNH
-- ============================================================
INSERT INTO CHI_NHANH (MaCN, TenCN, DiaChi, SoLuongPhong, NoiQuy, QuyDinhCoc) VALUES
('CN01', 'Chi nhánh Bình Thạnh', '123 Đinh Tiên Hoàng, P.1, Q.Bình Thạnh, TP.HCM', 20,
 'Không nuôi thú cưng. Không hút thuốc trong phòng. Ra vào trước 23h.', 'Đặt cọc 2 tháng tiền thuê.'),
('CN02', 'Chi nhánh Thủ Đức', '45 Võ Văn Ngân, P.Linh Chiểu, TP.Thủ Đức, TP.HCM', 15,
 'Giữ yên lặng sau 22h. Không tụ tập đông người.', 'Đặt cọc 1 tháng tiền thuê.'),
('CN03', 'Chi nhánh Gò Vấp', '78 Quang Trung, P.10, Q.Gò Vấp, TP.HCM', 25,
 'Không để xe dưới lòng đường. Vệ sinh khu vực chung định kỳ.', 'Đặt cọc 2 tháng tiền thuê.'),
('CN04', 'Chi nhánh Phú Nhuận', '12 Phan Xích Long, P.2, Q.Phú Nhuận, TP.HCM', 10,
 'Không tiếp khách sau 22h. Không sử dụng bếp từ trong phòng.', 'Đặt cọc 3 tháng tiền thuê.');

-- ============================================================
-- PHÒNG
-- ============================================================
INSERT INTO PHONG (MaPhong, SoLuongGiuong, GioiTinh, LoaiHinh, TienThueThang, TrangThai, MaCN) VALUES
('P001', 4, 'Nam',     'Ở ghép',        1200000, 'Đã đầy',    'CN01'),
('P002', 4, 'Nữ',      'Ở ghép',        1200000, 'Còn trống', 'CN01'),
('P003', 1, 'Hỗn hợp', 'Nguyên phòng',  4500000, 'Đã đầy',    'CN01'),
('P004', 6, 'Nam',     'Ở ghép',        1000000, 'Còn trống', 'CN02'),
('P005', 4, 'Nữ',      'Ở ghép',        1100000, 'Đã đầy',    'CN02'),
('P006', 1, 'Hỗn hợp', 'Nguyên phòng',  5000000, 'Còn trống', 'CN02'),
('P007', 2, 'Nữ',      'Ở ghép',        1300000, 'Đã đầy',    'CN03'),
('P008', 1, 'Hỗn hợp', 'Nguyên phòng',  3800000, 'Còn trống', 'CN03'),
('P009', 4, 'Nam',     'Ở ghép',        1050000, 'Đang bảo trì','CN03'),
('P010', 1, 'Hỗn hợp', 'Nguyên phòng',  6500000, 'Đã đầy',    'CN04');

-- ============================================================
-- GIƯỜNG
-- ============================================================
INSERT INTO GIUONG (MaGiuong, MaPhong, GiaGiuong, TinhTrang) VALUES
('G01', 'P001', 1200000, 'Đang sử dụng'),
('G02', 'P001', 1200000, 'Đang sử dụng'),
('G03', 'P001', 1200000, 'Đang sử dụng'),
('G04', 'P001', 1200000, 'Đang sử dụng'),
('G01', 'P002', 1200000, 'Chưa sử dụng'),
('G02', 'P002', 1200000, 'Chưa sử dụng'),
('G03', 'P002', 1200000, 'Chưa sử dụng'),
('G04', 'P002', 1200000, 'Chưa sử dụng'),
('G01', 'P003', 4500000, 'Đang sử dụng'),
('G01', 'P004', 1000000, 'Chưa sử dụng'),
('G02', 'P004', 1000000, 'Chưa sử dụng'),
('G01', 'P005', 1100000, 'Đang sử dụng'),
('G02', 'P005', 1100000, 'Đang sử dụng'),
('G03', 'P005', 1100000, 'Đang sử dụng'),
('G04', 'P005', 1100000, 'Đang sử dụng'),
('G01', 'P006', 5000000, 'Chưa sử dụng'),
('G01', 'P007', 1300000, 'Đang sử dụng'),
('G02', 'P007', 1300000, 'Đang sử dụng'),
('G01', 'P008', 3800000, 'Chưa sử dụng'),
('G01', 'P010', 6500000, 'Đang sử dụng');

-- ============================================================
-- DỊCH VỤ
-- ============================================================
INSERT INTO DICH_VU (MaDV, TenDV, Gia) VALUES
('DV01', 'Điện',        3500),
('DV02', 'Nước',        80000),
('DV03', 'Internet',    100000),
('DV04', 'Gửi xe máy', 100000),
('DV05', 'Gửi xe đạp', 50000),
('DV06', 'Dọn phòng',  150000),
('DV07', 'Giặt ủi',    30000),
('DV08', 'Bảo vệ',     50000);

-- ============================================================
-- CHI NHÁNH - DỊCH VỤ
-- ============================================================
INSERT INTO CHI_NHANH_DICH_VU (MaCN, MaDV) VALUES
('CN01','DV01'),('CN01','DV02'),('CN01','DV03'),('CN01','DV04'),('CN01','DV06'),
('CN02','DV01'),('CN02','DV02'),('CN02','DV03'),('CN02','DV05'),('CN02','DV07'),
('CN03','DV01'),('CN03','DV02'),('CN03','DV03'),('CN03','DV04'),('CN03','DV08'),
('CN04','DV01'),('CN04','DV02'),('CN04','DV03'),('CN04','DV06'),('CN04','DV08');

-- ============================================================
-- NHÂN VIÊN
-- ============================================================
INSERT INTO NHAN_VIEN (MaNV, HoTen, SoDienThoai, Email, CCCD, LoaiNV) VALUES
('NV01', 'Nguyễn Thị Lan',    '0901234567', 'lan.nt@nhatrovn.com',   '079201001234', 'Quản lý'),
('NV02', 'Trần Văn Hùng',     '0912345678', 'hung.tv@nhatrovn.com',  '079201005678', 'Sale'),
('NV03', 'Lê Minh Tuấn',      '0923456789', 'tuan.lm@nhatrovn.com',  '079201009012', 'Kế toán'),
('NV04', 'Phạm Thị Hoa',      '0934567890', 'hoa.pt@nhatrovn.com',   '079201003456', 'Sale'),
('NV05', 'Đặng Quốc Bảo',     '0945678901', 'bao.dq@nhatrovn.com',   '079201007890', 'Kỹ thuật'),
('NV06', 'Vũ Thị Mai',        '0956789012', 'mai.vt@nhatrovn.com',   '079201002345', 'Quản lý'),
('NV07', 'Hoàng Văn Nam',     '0967890123', 'nam.hv@nhatrovn.com',   '079201006789', 'Kế toán'),
('NV08', 'Bùi Thị Thanh',     '0978901234', 'thanh.bt@nhatrovn.com', '079201001357', 'Sale');

-- ============================================================
-- TÀI KHOẢN
-- ============================================================
INSERT INTO TAI_KHOAN (MaDangNhap, MatKhau, MaNV) VALUES
('lan.nt',    '$2b$10$abc...hash1', 'NV01'),
('hung.tv',   '$2b$10$abc...hash2', 'NV02'),
('tuan.lm',   '$2b$10$abc...hash3', 'NV03'),
('hoa.pt',    '$2b$10$abc...hash4', 'NV04'),
('bao.dq',    '$2b$10$abc...hash5', 'NV05'),
('mai.vt',    '$2b$10$abc...hash6', 'NV06'),
('nam.hv',    '$2b$10$abc...hash7', 'NV07'),
('thanh.bt',  '$2b$10$abc...hash8', 'NV08');

-- ============================================================
-- NHÓM KHÁCH THUÊ (tạo trước, cập nhật đại diện sau)
-- ============================================================
INSERT INTO NHOM_KHACH_THUE (MaNhom, SoLuong, GioiTinh, HinhThucThue, TrangThai, MaKHDaiDien) VALUES
('NH01', 4, 'Nam',     'Ở ghép',        'Hợp lệ',      NULL),
('NH02', 3, 'Nữ',      'Ở ghép',        'Hợp lệ',      NULL),
('NH03', 2, 'Hỗn hợp', 'Thuê nguyên phòng', 'Hợp lệ',  NULL),
('NH04', 4, 'Nữ',      'Ở ghép',        'Hợp lệ',      NULL),
('NH05', 1, 'Hỗn hợp', 'Thuê nguyên phòng', 'Chờ kiểm tra', NULL);

-- ============================================================
-- KHÁCH HÀNG
-- ============================================================
INSERT INTO KHACH_HANG (MaKH, HoTen, GioiTinh, Email, NgaySinh, SDT, SoCCCD,
    NoiCapCCCD, NgayCapCCCD, NgayHetHanCCCD, QuocTich, DiaChiCuTru,
    LoaiKhachHang, TrangThai, MaNhom) VALUES
('KH01', 'Nguyễn Văn An',      'Nam', 'an.nv@gmail.com',      '2000-03-15', '0901111111', '079200001111', 'Cục CSQLHC về TTXH TP.HCM', '2020-01-01', '2030-01-01', 'Việt Nam', '100 Lê Lợi, Q.1, TP.HCM', 'Nhóm', 'Hợp lệ', 'NH01'),
('KH02', 'Trần Thị Bình',      'Nữ',  'binh.tt@gmail.com',    '2001-07-22', '0902222222', '079201002222', 'Cục CSQLHC về TTXH TP.HCM', '2021-05-10', '2031-05-10', 'Việt Nam', '200 Hai Bà Trưng, Q.3', 'Nhóm', 'Hợp lệ', 'NH02'),
('KH03', 'Lê Hoàng Cường',     'Nam', 'cuong.lh@gmail.com',   '1999-11-05', '0903333333', '079199003333', 'Cục CSQLHC về TTXH TP.HCM', '2019-08-20', '2029-08-20', 'Việt Nam', '50 Cách Mạng Tháng 8, Q.3', 'Nhóm', 'Hợp lệ', 'NH03'),
('KH04', 'Phạm Ngọc Diệu',     'Nữ',  'dieu.pn@gmail.com',    '2002-02-14', '0904444444', '079202004444', 'Cục CSQLHC về TTXH TP.HCM', '2022-03-15', '2032-03-15', 'Việt Nam', '80 Đinh Tiên Hoàng, Q.BT', 'Nhóm', 'Hợp lệ', 'NH04'),
('KH05', 'Đỗ Thanh Đông',      'Nam', 'dong.dt@gmail.com',    '1998-09-30', '0905555555', '079198005555', 'Cục CSQLHC về TTXH TP.HCM', '2018-06-01', '2028-06-01', 'Việt Nam', '15 Nguyễn Huệ, Q.1', 'Cá nhân', 'Hợp lệ', NULL),
('KH06', 'Võ Thị Lan',         'Nữ',  'lan.vt@gmail.com',     '2001-12-01', '0906666666', '079201006666', 'Cục CSQLHC về TTXH TP.HCM', '2021-09-10', '2031-09-10', 'Việt Nam', '30 Lý Tự Trọng, Q.1', 'Nhóm', 'Hợp lệ', 'NH02'),
('KH07', 'Huỳnh Minh Giang',   'Nam', 'giang.hm@gmail.com',   '2000-06-18', '0907777777', '079200007777', 'Cục CSQLHC về TTXH TP.HCM', '2020-11-20', '2030-11-20', 'Việt Nam', '90 Võ Thị Sáu, Q.3', 'Nhóm', 'Hợp lệ', 'NH01'),
('KH08', 'Ngô Thị Hạnh',       'Nữ',  'hanh.nt@gmail.com',    '2003-04-25', '0908888888', '079203008888', 'Cục CSQLHC về TTXH TP.HCM', '2023-01-05', '2033-01-05', 'Việt Nam', '22 Trần Hưng Đạo, Q.1', 'Nhóm', 'Chờ kiểm tra', 'NH05'),
('KH09', 'Bùi Quốc Huy',       'Nam', 'huy.bq@gmail.com',     '1997-08-12', '0909999999', '079197009999', 'Cục CSQLHC về TTXH TP.HCM', '2017-12-15', '2027-12-15', 'Việt Nam', '5 Pasteur, Q.1', 'Nhóm', 'Hợp lệ', 'NH01'),
('KH10', 'Đinh Thị Ý',         'Nữ',  'y.dt@gmail.com',       '2002-10-08', '0910000000', '079202010000', 'Cục CSQLHC về TTXH TP.HCM', '2022-07-20', '2032-07-20', 'Việt Nam', '67 Nam Kỳ Khởi Nghĩa, Q.3', 'Nhóm', 'Hợp lệ', 'NH04'),
('KH11', 'Trương Văn Khoa',    'Nam', 'khoa.tv@gmail.com',    '2001-01-20', '0911111111', '079201011111', 'Cục CSQLHC về TTXH TP.HCM', '2021-02-28', '2031-02-28', 'Việt Nam', '11 Bùi Thị Xuân, Q.1', 'Nhóm', 'Hợp lệ', 'NH01'),
('KH12', 'Lý Mỹ Linh',         'Nữ',  'linh.lm@gmail.com',    '2000-05-17', '0912222222', '079200012222', 'Cục CSQLHC về TTXH TP.HCM', '2020-08-10', '2030-08-10', 'Việt Nam', '33 Nguyễn Thị Minh Khai, Q.1', 'Nhóm', 'Hợp lệ', 'NH04'),
('KH13', 'Phan Thanh Minh',    'Nam', 'minh.pt@gmail.com',    '1999-03-09', '0913333333', '079199013333', 'Cục CSQLHC về TTXH TP.HCM', '2019-04-15', '2029-04-15', 'Việt Nam', '44 Lê Văn Sỹ, Q.3', 'Cá nhân', 'Hợp lệ', NULL),
('KH14', 'Tạ Thị Ngân',        'Nữ',  'ngan.tt@gmail.com',    '2002-09-03', '0914444444', '079202014444', 'Cục CSQLHC về TTXH TP.HCM', '2022-10-01', '2032-10-01', 'Việt Nam', '55 Trần Phú, Q.5', 'Nhóm', 'Hợp lệ', 'NH02'),
('KH15', 'Dương Văn Ổn',       'Nam', 'on.dv@gmail.com',      '1998-07-27', '0915555555', '079198015555', 'Cục CSQLHC về TTXH TP.HCM', '2018-09-05', '2028-09-05', 'Việt Nam', '66 An Dương Vương, Q.5', 'Cá nhân', 'Mới', NULL);

-- Cập nhật đại diện nhóm
UPDATE NHOM_KHACH_THUE SET MaKHDaiDien = 'KH01' WHERE MaNhom = 'NH01';
UPDATE NHOM_KHACH_THUE SET MaKHDaiDien = 'KH02' WHERE MaNhom = 'NH02';
UPDATE NHOM_KHACH_THUE SET MaKHDaiDien = 'KH03' WHERE MaNhom = 'NH03';
UPDATE NHOM_KHACH_THUE SET MaKHDaiDien = 'KH04' WHERE MaNhom = 'NH04';
UPDATE NHOM_KHACH_THUE SET MaKHDaiDien = 'KH08' WHERE MaNhom = 'NH05';

-- ============================================================
-- PHIẾU YÊU CẦU XEM PHÒNG
-- ============================================================
INSERT INTO PHIEU_YEU_CAU_XEM_PHONG
    (MaYC, SoLuongDuKien, LoaiPhong, MucGia, ThoiGianDuKienVao, ThoiHanThue,
     ThoiGianHenXem, GioiTinh, NgayGuiYeuCau, TrangThai, LoaiHinhThue, MaNV, MaKH) VALUES
('YC01', 4, 'Ở ghép',       1200000, '2025-01-01', 6,  '2024-12-20 10:00', 'Nam',     '2024-12-15 08:00', 'Hoàn tất', 'Ở ghép',        'NV02', 'KH01'),
('YC02', 3, 'Ở ghép',       1200000, '2025-01-05', 6,  '2024-12-22 14:00', 'Nữ',      '2024-12-16 09:00', 'Hoàn tất', 'Ở ghép',        'NV04', 'KH02'),
('YC03', 1, 'Nguyên phòng', 4500000, '2025-01-10', 12, '2024-12-25 09:30', 'Hỗn hợp', '2024-12-18 10:00', 'Hoàn tất', 'Nguyên phòng',  'NV02', 'KH03'),
('YC04', 4, 'Ở ghép',       1100000, '2025-02-01', 6,  '2025-01-15 11:00', 'Nữ',      '2025-01-10 07:00', 'Hoàn tất', 'Ở ghép',        'NV04', 'KH04'),
('YC05', 2, 'Ở ghép',       1300000, '2025-03-01', 3,  '2025-02-20 15:00', 'Nữ',      '2025-02-15 08:30', 'Hoàn tất', 'Ở ghép',        'NV08', 'KH06'),
('YC06', 1, 'Nguyên phòng', 6500000, '2025-03-15', 12, '2025-03-05 10:00', 'Hỗn hợp', '2025-03-01 09:00', 'Hoàn tất', 'Nguyên phòng',  'NV02', 'KH05'),
('YC07', 1, 'Ở ghép',       1200000, '2025-04-01', 6,  '2025-03-25 09:00', 'Nữ',      '2025-03-20 10:00', 'Cần xác nhận', 'Ở ghép',    'NV04', 'KH14'),
('YC08', 1, 'Nguyên phòng', 5000000, '2025-05-01', 6,  '2025-04-20 14:00', 'Hỗn hợp', '2025-04-15 11:00', 'Cần xác nhận', 'Nguyên phòng','NV08','KH08');

-- ============================================================
-- CHI TIẾT PHIẾU YÊU CẦU
-- ============================================================
INSERT INTO CHI_TIET_PHIEU_YEU_CAU (MaYC, MaGiuong, MaPhong, TrangThaiChot) VALUES
('YC01','G01','P001','Chốt'),
('YC01','G02','P001','Chốt'),
('YC01','G03','P001','Chốt'),
('YC01','G04','P001','Chốt'),
('YC02','G01','P002','Chốt'),
('YC02','G02','P002','Chốt'),
('YC02','G03','P002','Không chốt'),
('YC03','G01','P003','Chốt'),
('YC04','G01','P005','Chốt'),
('YC04','G02','P005','Chốt'),
('YC04','G03','P005','Chốt'),
('YC04','G04','P005','Chốt'),
('YC05','G01','P007','Chốt'),
('YC05','G02','P007','Chốt'),
('YC06','G01','P010','Chốt');

-- ============================================================
-- HỢP ĐỒNG
-- ============================================================
INSERT INTO HOP_DONG (MaHD, SoLuongGiuong, KyThanhToan, NgayBatDau, ThoiHanThue, GiaThue, NgayKetThuc, TrangThai, MaKH) VALUES
('HD01', 4, 1, '2025-01-01', 6,  4800000, '2025-07-01', 'Đã ký xác nhận',          'KH01'),
('HD02', 2, 1, '2025-01-05', 6,  2400000, '2025-07-05', 'Đã ký xác nhận',          'KH02'),
('HD03', 1, 1, '2025-01-10', 12, 4500000, '2026-01-10', 'Đã ký xác nhận',          'KH03'),
('HD04', 4, 1, '2025-02-01', 6,  4400000, '2025-08-01', 'Đã ký xác nhận',          'KH04'),
('HD05', 2, 1, '2025-03-01', 3,  2600000, '2025-06-01', 'Đã hoàn tất thủ tục trả phòng', 'KH06'),
('HD06', 1, 1, '2025-03-15', 12, 6500000, '2026-03-15', 'Đã ký xác nhận',          'KH05'),
('HD07', 1, 1, '2024-06-01', 6,  1200000, '2024-12-01', 'Đã thanh lý',             'KH07'),
('HD08', 1, 1, '2024-08-01', 6,  1100000, '2025-02-01', 'Đã thanh lý',             'KH09');

-- ============================================================
-- HỢP ĐỒNG - GIƯỜNG
-- ============================================================
INSERT INTO HOP_DONG_GIUONG (MaHD, MaGiuong, MaPhong) VALUES
('HD01','G01','P001'),
('HD01','G02','P001'),
('HD01','G03','P001'),
('HD01','G04','P001'),
('HD02','G01','P002'),
('HD02','G02','P002'),
('HD03','G01','P003'),
('HD04','G01','P005'),
('HD04','G02','P005'),
('HD04','G03','P005'),
('HD04','G04','P005'),
('HD05','G01','P007'),
('HD05','G02','P007'),
('HD06','G01','P010'),
('HD07','G01','P002'),
('HD08','G03','P005');

-- ============================================================
-- THANH TOÁN
-- ============================================================
INSERT INTO THANH_TOAN
    (MaTT, LoaiTT, SoTien, ThoiDiemYeuCau, ThoiDiemHetHan, ThoiDiemThanhToan,
     TinhTrangYeuCau, TrangThai, PhuongThucThanhToan, GhiChu, MaYC, MaKH, MaHD, MaNVKT, MaNVSale) VALUES
('TT01','Tiền cọc',  9600000,  '2024-12-26 09:00','2024-12-31 17:00','2024-12-28 10:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Cọc 2 tháng HD01','YC01','KH01','HD01','NV03','NV02'),
('TT02','Tiền thuê', 4800000,  '2025-01-01 08:00','2025-01-05 17:00','2025-01-03 11:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Tháng 1/2025 HD01', NULL,'KH01','HD01','NV03','NV02'),
('TT03','Tiền thuê', 4800000,  '2025-02-01 08:00','2025-02-05 17:00','2025-02-03 09:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Tháng 2/2025 HD01', NULL,'KH01','HD01','NV03','NV02'),
('TT04','Tiền cọc',  4800000,  '2024-12-23 10:00','2024-12-28 17:00','2024-12-24 14:00','Đối soát thành công','Đã thanh toán','Tiền mặt',    'Cọc 2 tháng HD02','YC02','KH02','HD02','NV07','NV04'),
('TT05','Tiền thuê', 2400000,  '2025-01-05 08:00','2025-01-10 17:00','2025-01-07 10:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Tháng 1/2025 HD02', NULL,'KH02','HD02','NV07','NV04'),
('TT06','Tiền cọc',  9000000,  '2024-12-26 11:00','2024-12-31 17:00','2024-12-27 15:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Cọc 2 tháng HD03','YC03','KH03','HD03','NV03','NV02'),
('TT07','Tiền thuê', 4500000,  '2025-01-10 08:00','2025-01-15 17:00','2025-01-11 09:30','Đối soát thành công','Đã thanh toán','Chuyển khoản','Tháng 1/2025 HD03', NULL,'KH03','HD03','NV03','NV02'),
('TT08','Tiền thuê', 4500000,  '2025-02-10 08:00','2025-02-15 17:00','2025-02-12 10:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Tháng 2/2025 HD03', NULL,'KH03','HD03','NV03','NV02'),
('TT09','Tiền cọc',  8800000,  '2025-01-12 09:00','2025-01-17 17:00','2025-01-14 11:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Cọc 2 tháng HD04','YC04','KH04','HD04','NV07','NV04'),
('TT10','Tiền thuê', 4400000,  '2025-02-01 08:00','2025-02-06 17:00','2025-02-03 09:00','Đối soát thành công','Đã thanh toán','Tiền mặt',    'Tháng 2/2025 HD04', NULL,'KH04','HD04','NV07','NV04'),
('TT11','Tiền cọc',  5200000,  '2025-02-16 10:00','2025-02-21 17:00','2025-02-17 14:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Cọc 2 tháng HD05','YC05','KH06','HD05','NV03','NV08'),
('TT12','Tiền thuê', 2600000,  '2025-03-01 08:00','2025-03-06 17:00','2025-03-02 10:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Tháng 3/2025 HD05', NULL,'KH06','HD05','NV03','NV08'),
('TT13','Hoàn cọc',  5200000,  '2025-06-05 09:00','2025-06-10 17:00','2025-06-07 11:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Hoàn cọc HD05',    NULL,'KH06','HD05','NV03','NV08'),
('TT14','Tiền cọc', 13000000,  '2025-03-01 11:00','2025-03-06 17:00','2025-03-02 15:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Cọc 2 tháng HD06','YC06','KH05','HD06','NV07','NV02'),
('TT15','Tiền thuê', 6500000,  '2025-04-15 08:00','2025-04-20 17:00','2025-04-16 09:00','Đối soát thành công','Đã thanh toán','Chuyển khoản','Tháng 4/2025 HD06', NULL,'KH05','HD06','NV07','NV02'),
('TT16','Tiền thuê', 4800000,  '2025-03-01 08:00','2025-03-06 17:00',NULL,              'Chờ đối soát',               'Chờ thanh toán', NULL,          'Tháng 3/2025 HD01', NULL,'KH01','HD01','NV03','NV02'),
('TT17','Tiền thuê', 2400000,  '2025-03-05 08:00','2025-03-10 17:00',NULL,              'Quá thời hạn/Chờ thanh toán','Chờ thanh toán', NULL,          'Tháng 3/2025 HD02', NULL,'KH02','HD02','NV07','NV04');

-- ============================================================
-- BIÊN BẢN VI PHẠM
-- ============================================================
INSERT INTO BIEN_BAN_VI_PHAM (MaBienBanVP, Loi, NgayLap, TrangThai, PhiPhat, MaHD) VALUES
('VP01', 'Nuôi chó trong phòng trọ, vi phạm nội quy',             '2025-02-15', 'Đã giải quyết', 500000,  'HD01'),
('VP02', 'Gây tiếng ồn sau 23h nhiều lần, hàng xóm khiếu nại',   '2025-03-10', 'Đã xác nhận',   300000,  'HD02'),
('VP03', 'Tự ý khoan tường lắp điều hòa khi chưa có phép',       '2025-01-20', 'Đã giải quyết', 1000000, 'HD03');

-- ============================================================
-- LỊCH TRẢ PHÒNG
-- ============================================================
INSERT INTO LICH_TRA_PHONG (MaLichTraPhong, Ngay, TrangThai, MaHD, MaNV) VALUES
('LTP01', '2025-06-01', 'Đã xác nhận',   'HD05', 'NV01'),
('LTP02', '2024-11-30', 'Đã xác nhận',   'HD07', 'NV06'),
('LTP03', '2025-02-01', 'Đã xác nhận',   'HD08', 'NV01');

-- ============================================================
-- TÀI SẢN VÀ TRANG THIẾT BỊ
-- ============================================================
INSERT INTO TAI_SAN_TRANG_THIET_BI (MaVatDung, TenVatDung, MoTa, TrangThai, MaPhong) VALUES
('VD01', 'Giường tầng đôi',   'Giường sắt 2 tầng, có nệm',      'Đã bàn giao',   'P001'),
('VD02', 'Tủ cá nhân',        'Tủ nhỏ 3 ngăn mỗi giường',       'Đã bàn giao',   'P001'),
('VD03', 'Quạt trần',         'Quạt trần Panasonic',             'Đã bàn giao',   'P001'),
('VD04', 'Đèn LED',           'Đèn LED 20W',                     'Đã bàn giao',   'P001'),
('VD05', 'Giường đơn',        'Giường gỗ 90x200cm có nệm',       'Chưa bàn giao', 'P002'),
('VD06', 'Bàn học',           'Bàn gỗ có kệ sách',               'Chưa bàn giao', 'P002'),
('VD07', 'Giường đôi',        'Giường 1m6 có nệm cao cấp',       'Đã bàn giao',   'P003'),
('VD08', 'Tủ quần áo',        'Tủ 3 cánh gương',                 'Đã bàn giao',   'P003'),
('VD09', 'Bàn làm việc',      'Bàn gỗ tự nhiên',                 'Đã bàn giao',   'P003'),
('VD10', 'Điều hòa',          'Điều hòa Daikin 9000BTU',         'Đã bàn giao',   'P003'),
('VD11', 'Tủ lạnh mini',      'Tủ lạnh 90L',                     'Đã bàn giao',   'P003'),
('VD12', 'Nóng lạnh',         'Máy nước nóng Ariston 20L',       'Đã bàn giao',   'P003'),
('VD13', 'Bình nước nóng',    'Bình nóng lạnh 30L',              'Hỏng',          'P005'),
('VD14', 'Quạt đứng',         'Quạt đứng Panasonic',             'Đã bàn giao',   'P005'),
('VD15', 'Điều hòa',          'Điều hòa LG 12000BTU',            'Đã bàn giao',   'P010');

-- ============================================================
-- BIÊN BẢN BÀN GIAO
-- ============================================================
INSERT INTO BIEN_BAN_BAN_GIAO (MaBienBan, ThoiDiemNhan, GhiChu, TrangThai, ThoiDiemTra, MaHD, MaNV) VALUES
('BB01', '2025-01-01 09:00', 'Bàn giao đầy đủ, phòng sạch sẽ',       'Đã ký xác nhận', NULL,                'HD01', 'NV05'),
('BB02', '2025-01-05 10:00', 'Bàn giao đầy đủ',                       'Đã ký xác nhận', NULL,                'HD02', 'NV05'),
('BB03', '2025-01-10 09:30', 'Bàn giao nguyên phòng, đầy đủ thiết bị','Đã ký xác nhận', NULL,                'HD03', 'NV05'),
('BB04', '2025-02-01 08:30', 'Bàn giao đầy đủ, bình nóng lạnh hỏng',  'Đã ký xác nhận', NULL,                'HD04', 'NV05'),
('BB05', '2025-03-01 10:00', 'Bàn giao đầy đủ',                       'Đã trả phòng',   '2025-06-01 11:00',  'HD05', 'NV05'),
('BB06', '2025-03-15 09:00', 'Bàn giao nguyên phòng cao cấp',          'Đã ký xác nhận', NULL,                'HD06', 'NV05');

-- ============================================================
-- BÁO CÁO TÌNH TRẠNG PHÒNG
-- ============================================================
INSERT INTO BAO_CAO_TINH_TRANG_PHONG (MaBaoCao, NgayLap, KetQuaVeSinh, DaKiemTraHD, TrangThai, NgayKy, MaHD) VALUES
('BC01', '2025-02-01', 'Tốt',      TRUE,  'Đã xác nhận',   '2025-02-02', 'HD01'),
('BC02', '2025-02-05', 'Tốt',      TRUE,  'Đã xác nhận',   '2025-02-06', 'HD02'),
('BC03', '2025-02-10', 'Trung bình',TRUE, 'Đã xác nhận',   '2025-02-11', 'HD03'),
('BC04', '2025-06-02', 'Kém',      TRUE,  'Đã xác nhận',   '2025-06-03', 'HD05');

-- ============================================================
-- BIÊN BẢN TRẢ PHÒNG
-- ============================================================
INSERT INTO BIEN_BAN_TRA_PHONG (MaBienBanTP, NgayLap, TrangThai, NgayKy, MaHD, MaNV) VALUES
('BBTP01', '2025-06-01', 'Đã ký xác nhận', '2025-06-01', 'HD05', 'NV01'),
('BBTP02', '2024-12-01', 'Đã ký xác nhận', '2024-12-01', 'HD07', 'NV06'),
('BBTP03', '2025-02-01', 'Đã ký xác nhận', '2025-02-01', 'HD08', 'NV01');

-- ============================================================
-- BẢNG ĐỐI SOÁT
-- ============================================================
INSERT INTO BANG_DOI_SOAT
    (MaDoiSoat, NgayLap, TrangThai, NgayKy, SoTienCoc, PhanTramHoanCoc,
     PhiPhatSinh, SoTienThanhToanThem, SoTienHoanCoc, MaHD, MaNV) VALUES
('DS01', '2025-06-03', 'Đã xác nhận', '2025-06-03',
    5200000, 90.00, 300000, 0, 4380000, 'HD05', 'NV07'),
('DS02', '2024-12-03', 'Đã xác nhận', '2024-12-03',
    2400000, 100.00, 0, 0, 2400000, 'HD07', 'NV03'),
('DS03', '2025-02-03', 'Đã xác nhận', '2025-02-03',
    2200000, 100.00, 0, 0, 2200000, 'HD08', 'NV03');

-- ============================================================
-- KHOẢN KHẤU TRỪ
-- ============================================================
INSERT INTO KHOAN_KHAU_TRU (MaDoiSoat, TenKhoan, SoTien) VALUES
('DS01', 'Phí vệ sinh phòng (tình trạng kém)',       300000),
('DS01', 'Tiền điện tháng cuối chưa thanh toán',     220000),
('DS02', 'Không có khoản khấu trừ',                       0);

-- ============================================================
-- CHI TIẾT BÀN GIAO
-- ============================================================
INSERT INTO CHI_TIET_BAN_GIAO (MaBienBan, MaVatDung, SoLuong, HienTrangNhan, HienTrangTra, PhiDenBu, MaBaoCao) VALUES
('BB01','VD01', 2, 'Tốt, nguyên vẹn',         NULL,              0,      NULL),
('BB01','VD02', 4, 'Tốt, đủ ngăn kéo',        NULL,              0,      NULL),
('BB01','VD03', 1, 'Tốt, quay đủ chiều',       NULL,              0,      NULL),
('BB03','VD07', 1, 'Tốt, nệm mới',             'Tốt, còn dùng', 0,      'BC03'),
('BB03','VD08', 1, 'Tốt, gương nguyên vẹn',    'Tốt',           0,      'BC03'),
('BB03','VD10', 1, 'Hoạt động bình thường',     'Tốt',           0,      'BC03'),
('BB04','VD13', 1, 'Hỏng - xác nhận khi nhận', NULL,              0,      NULL),
('BB04','VD14', 1, 'Tốt',                       NULL,              0,      NULL),
('BB05','VD01', 2, 'Tốt',                       'Trầy nhẹ mặt gỗ', 200000, 'BC04'),
('BB06','VD15', 1, 'Tốt, mới lắp đặt',         NULL,              0,      NULL);

-- ============================================================
-- VERIFY: Đếm số dòng mỗi bảng
-- ============================================================
SELECT 'CHI_NHANH'                AS bang, COUNT(*) AS so_dong FROM CHI_NHANH
UNION ALL SELECT 'PHONG',                COUNT(*) FROM PHONG
UNION ALL SELECT 'GIUONG',               COUNT(*) FROM GIUONG
UNION ALL SELECT 'DICH_VU',              COUNT(*) FROM DICH_VU
UNION ALL SELECT 'CHI_NHANH_DICH_VU',   COUNT(*) FROM CHI_NHANH_DICH_VU
UNION ALL SELECT 'NHAN_VIEN',            COUNT(*) FROM NHAN_VIEN
UNION ALL SELECT 'TAI_KHOAN',            COUNT(*) FROM TAI_KHOAN
UNION ALL SELECT 'NHOM_KHACH_THUE',     COUNT(*) FROM NHOM_KHACH_THUE
UNION ALL SELECT 'KHACH_HANG',           COUNT(*) FROM KHACH_HANG
UNION ALL SELECT 'PHIEU_YEU_CAU_XEM_PHONG', COUNT(*) FROM PHIEU_YEU_CAU_XEM_PHONG
UNION ALL SELECT 'CHI_TIET_PHIEU_YEU_CAU', COUNT(*) FROM CHI_TIET_PHIEU_YEU_CAU
UNION ALL SELECT 'HOP_DONG',             COUNT(*) FROM HOP_DONG
UNION ALL SELECT 'HOP_DONG_GIUONG',      COUNT(*) FROM HOP_DONG_GIUONG
UNION ALL SELECT 'THANH_TOAN',           COUNT(*) FROM THANH_TOAN
UNION ALL SELECT 'BIEN_BAN_VI_PHAM',     COUNT(*) FROM BIEN_BAN_VI_PHAM
UNION ALL SELECT 'LICH_TRA_PHONG',       COUNT(*) FROM LICH_TRA_PHONG
UNION ALL SELECT 'TAI_SAN_TRANG_THIET_BI', COUNT(*) FROM TAI_SAN_TRANG_THIET_BI
UNION ALL SELECT 'BIEN_BAN_BAN_GIAO',    COUNT(*) FROM BIEN_BAN_BAN_GIAO
UNION ALL SELECT 'BAO_CAO_TINH_TRANG_PHONG', COUNT(*) FROM BAO_CAO_TINH_TRANG_PHONG
UNION ALL SELECT 'BIEN_BAN_TRA_PHONG',   COUNT(*) FROM BIEN_BAN_TRA_PHONG
UNION ALL SELECT 'BANG_DOI_SOAT',        COUNT(*) FROM BANG_DOI_SOAT
UNION ALL SELECT 'KHOAN_KHAU_TRU',       COUNT(*) FROM KHOAN_KHAU_TRU
UNION ALL SELECT 'CHI_TIET_BAN_GIAO',    COUNT(*) FROM CHI_TIET_BAN_GIAO
ORDER BY bang;