const khachHangService = require('./khachHang.service');
const phieuYeuCauDao = require('../dao/phieuYeuCau.dao');
const chiTietPhieuYeuCauService = require('./chiTietPhieuYeuCau.service');
// PHẦN CỦA DUYÊN: Import Service (Service gọi Service, không gọi DAO khác tên)
const phongService = require('./phong.service');
const giuongService = require('./giuong.service');
const chiNhanhService = require('./chiNhanh.service');
const thanhToanService = require('./thanhToan.service');

class phieuYeuCauService {
  static async taoPhieuYeuCau(data) {
    try {
      // 1. Kiểm tra Khách hàng đã tồn tại qua CCCD chưa
      let maKH;
      const khExist = await khachHangService.findByCCCD(data.CCCD);
      if (khExist.success && khExist.data) {
        maKH = khExist.data.makh;
        // Cập nhật thông tin khách hàng cũ theo dữ liệu mới từ màn hình
        const updateData = {
          hoten: data.HoTen,
          sdt: data.SoDienThoai,
          diachicutru: data.DiaChi,
          email: data.Email,
          gioitinh: data.GioiTinh,
          ngaysinh: data.NgaySinh || null,
          quoctich: data.QuocTich || 'Việt Nam',
          trangthai: 'Mới'
        };
        await khachHangService.updateThongTin(maKH, updateData);
      } else {
        maKH = await khachHangService.sinhMa();
        const khachHangData = {
          makh: maKH,
          hoten: data.HoTen,
          sdt: data.SoDienThoai,
          diachicutru: data.DiaChi,
          email: data.Email,
          gioitinh: data.GioiTinh,
          ngaysinh: data.NgaySinh || null,
          socccd: data.CCCD,
          quoctich: data.QuocTich || 'Việt Nam',
          loaikhachhang: 'Cá nhân',
          trangthai: 'Mới'
        };

        const khResult = await khachHangService.insert(khachHangData);
        if (!khResult.success) {
          return { success: false, message: 'Không thể tạo thông tin khách hàng', error: khResult.error };
        }
      }

      // 2. Tạo Phiếu yêu cầu
      const maYC = await phieuYeuCauDao.sinhMaPhieuYeuCau();
      // Map hình thức thuê của frontend (Cá nhân, Ở ghép, Thuê nguyên căn) 
      // sang check constraint của DB (Ở ghép, Nguyên phòng)
      const hinhThucDb = (data.HinhThucThue === 'Thuê nguyên căn') ? 'Nguyên phòng' : 'Ở ghép';
      const chiTietInput = Array.isArray(data.ChiTiet) ? data.ChiTiet : [];

      const phieuYeuCauData = {
        mayc: maYC,
        soluongdukien: parseInt(data.SoNguoiMuonThue) || 1,
        mucgia: parseFloat(data.MucGia) || 0,
        thoigiandukienvao: data.NgayDuKienDonVao || null,
        thoihanthue: parseInt(data.ThoiHanThue) || 6,
        yeucaukhac: data.YeuCauKhac || null,
        thoigianhenxem: data.ThoiGianHenXem || null, // Lưu lịch hẹn khi đặt
        trangthai: 'Đang hẹn xem',  // Mới tạo: chờ đặt lịch xem phòng
        loaihinhthue: hinhThucDb,
        makh: maKH,
        manv: data.MaNV || null,                   // Lấy từ nhân viên đang đăng nhập
      };

      const pycResult = await phieuYeuCauDao.insert(phieuYeuCauData);
      if (!pycResult.success) {
        return { success: false, message: 'Không thể tạo phiếu yêu cầu', error: pycResult.error };
      }

      // Nếu frontend gửi chi tiết phòng/giường (data.ChiTiet), lưu vào bảng chi_tiet_phieu_yeu_cau
      try {
        const insertedPYC = pycResult.data; // full inserted row
        const maycSaved = insertedPYC.mayc || maYC;
        console.log('=== BUS.taoPhieuYeuCau check ChiTiet ===');
        console.log('data.ChiTiet:', chiTietInput);
        console.log('Is array:', Array.isArray(chiTietInput));
        console.log('Length:', chiTietInput.length);
        
        if (chiTietInput.length > 0) {
          const supabase = require('../config/supabase');
          const records = [];
          console.log('Bắt đầu xử lý ChiTiet items...');

          const roomItems = hinhThucDb === 'Nguyên phòng'
            ? Object.values(
                chiTietInput.reduce((acc, item) => {
                  if (item?.maphong) {
                    acc[item.maphong] = {
                      maphong: item.maphong,
                      macn: item.macn || null,
                    };
                  }
                  return acc;
                }, {})
              )
            : chiTietInput;

          // Process each room/bed selection
          for (const item of roomItems) {
            const maphong = item.maphong || null;
            const macn = item.macn || null;
            const magiuong = item.magiuong || null;
            console.log(`  Item: maphong=${maphong}, macn=${macn}, magiuong=${magiuong}`);

            if (!maphong) {
              console.log('  → Bỏ qua: không có maphong');
              continue; // Skip if no room
            }

            if (magiuong) {
              // Cá nhân hoặc ở ghép: có bed cụ thể
              records.push({
                mayc: maycSaved,
                maphong,
                magiuong,
                trangthaichot: 'Không chốt'
              });
            } else {
              // Thuê nguyên căn: magiuong = null → fetch all beds in this room
              const bedsResult = await giuongService.layDanhSachGiuongCuaPhong(maphong);

              if (!bedsResult.success) {
                console.error(`Lỗi lấy danh sách giường cho phòng ${maphong}:`, bedsResult.error);
                continue;
              }

              const allBeds = bedsResult.data;
              if (Array.isArray(allBeds) && allBeds.length > 0) {
                allBeds.forEach(bed => {
                  records.push({
                    mayc: maycSaved,
                    maphong: bed.maphong,
                    magiuong: bed.magiuong,
                    trangthaichot: 'Không chốt'
                  });
                });
              }
            }
          }

          // Insert all records
          console.log(`Tổng records cần insert: ${records.length}`);
          console.log('Records:', records);
          if (records.length > 0) {
            const ctResult = await chiTietPhieuYeuCauService.luuNhieuChiTiet(records);
            console.log('chiTietPhieuYeuCauService.luuNhieuChiTiet result:', ctResult);
            if (!ctResult.success) {
              console.error('Không thể lưu chi tiết phiếu yêu cầu:', ctResult.error);
              return { success: true, message: 'Tạo phiếu yêu cầu thành công (chi tiết chưa lưu)', data: { MaYC: maycSaved, MaKH: maKH, ChiTietCount: 0 }, warning: ctResult.error };
            }
          } else {
            console.log('Không có records cần insert');
          }
        }

      } catch (err) {
        console.error('Lỗi khi lưu chi tiết phiếu:', err);
      }

      return { 
        success: true, 
        message: 'Tạo phiếu yêu cầu thành công',
        data: { MaYC: maYC, MaKH: maKH, ChiTietCount: chiTietInput.length }
      };

    } catch (error) {
      console.error("Lỗi tại phieuYeuCauService.taoPhieuYeuCau:", error);
      return { success: false, message: 'Lỗi server khi tạo phiếu yêu cầu' };
    }
  }

  static async capNhatLichHen(mayc, thoigianhenxem, manv = 'NV01') {
    try {
      return await phieuYeuCauDao.updateLichHen(mayc, thoigianhenxem, manv);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.capNhatLichHen:', error);
      return { success: false, error };
    }
  }

  static async layGioBanTheoNgay(manv, ngay) {
    try {
      return await phieuYeuCauDao.layGioBanTheoNgay(manv, ngay);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.layGioBanTheoNgay:', error);
      return { success: false, error };
    }
  }


  static async huyLich(mayc) {
    try {
      // Xóa tất cả chi tiết phiếu trước (sử dụng Service chuyên biệt)
      const { success: delCTSuccess, error: delCTError } = await chiTietPhieuYeuCauService.deleteAllByMaYC(mayc);
      
      if (!delCTSuccess && delCTError) {
        console.error('Lỗi xóa chi tiết trong huyLich:', delCTError);
        return { success: false, error: delCTError };
      }

      // Sau đó mới xóa phiếu yêu cầu
      return await phieuYeuCauDao.deletePhieu(mayc);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.huyLich:', error);
      return { success: false, error };
    }
  }

  static async updateTrangThai(mayc, trangthai) {
    try {
      return await phieuYeuCauDao.updateTrangThai(mayc, trangthai);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.updateTrangThai:', error);
      return { success: false, error };
    }
  }

  static async getDanhSach(trangthai, keyword) {
    try {
      return await phieuYeuCauDao.getDanhSach(trangthai, keyword);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.getDanhSach:', error);
      return { success: false, error };
    }
  }

  // =============================================================================
  // PHẦN CỦA DUYÊN: UC1 - Tra cứu hồ sơ (Lấy danh sách PYC "Cần xác nhận")
  // Gọi từ: GET /api/phieu-yeu-cau/can-xac-nhan
  // =============================================================================
  static async layDanhSachCanXacNhan(keyword) {
    try {
      return await phieuYeuCauDao.selectCanXacNhan(keyword);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.layDanhSachCanXacNhan:', error);
      return { success: false, error };
    }
  }

  // =============================================================================
  // PHẦN CỦA DUYÊN: UC1 - Kiểm tra phòng (Lấy chi tiết PYC + trạng thái phòng)
  // Gọi từ: GET /api/phieu-yeu-cau/chi-tiet-voi-tinh-trang/:mayc
  // =============================================================================
  static async layChiTietVoiTinhTrang(mayc) {
    try {
      // 1. Lấy chi tiết PYC (join khach_hang + chi_tiet → giuong → phong)
      const pycResult = await chiTietPhieuYeuCauService.layChiTiet(mayc);
      if (!pycResult.success) return pycResult;
      if (!pycResult.data) return { success: false, message: 'Không tìm thấy hồ sơ' };

      const phieuData = pycResult.data;
      const loaiHinhThue = phieuData.loaihinhthue; // 'Nguyên phòng' | 'Ở ghép'

      // 2. Toàn bộ chi tiết phòng/giường
      const chiTiet = phieuData.chi_tiet || [];
      console.log(`[layChiTietVoiTinhTrang] mayc=${mayc}, loaiHinhThue=${loaiHinhThue}, chiTiet.length=${chiTiet.length}`);
      console.log('[layChiTietVoiTinhTrang] chiTiet:', JSON.stringify(chiTiet));

      // 3. Xác định phòng chính (tất cả giường cùng 1 phòng)
      const maphongChinh = chiTiet[0]?.maphong || null;
      console.log(`[layChiTietVoiTinhTrang] maphongChinh=${maphongChinh}`);

      // 4. Lấy thông tin phòng + chi nhánh qua Service (chuẩn 3 lớp)
      let phongInfo = null;
      let chiNhanhInfo = null;
      if (maphongChinh) {
        const phongResult = await phongService.layThongTinPhong(maphongChinh);
        console.log(`[layChiTietVoiTinhTrang] phongData:`, phongResult.data);
        if (phongResult.success && phongResult.data) {
          phongInfo = phongResult.data;
          const cnResult = await chiNhanhService.layThongTinChiNhanh(phongInfo.macn);
          chiNhanhInfo = cnResult.success ? cnResult.data : null;
        }
      }

      // 5. Lấy danh sách giường đã chốt
      const dsGiuongDaChot = chiTiet.filter(ct => ct.trangthaichot === 'Chốt');
      console.log(`[layChiTietVoiTinhTrang] dsGiuongDaChot.length=${dsGiuongDaChot.length}`);

      // 6. Lấy tình trạng thực tế từng giường đã chốt
      const dsGiuongDaChotVoiTinhTrang = [];
      for (const ct of dsGiuongDaChot) {
        const result = await giuongService.layTinhTrangGiuong(ct.magiuong, ct.maphong);
        console.log(`[layChiTietVoiTinhTrang] giuong ${ct.magiuong}/${ct.maphong}: tinhtrang=${result.data?.tinhtrang}`);
        dsGiuongDaChotVoiTinhTrang.push({
          maGiuong:  ct.magiuong,
          maPhong:   ct.maphong,
          tinhTrang: result.success ? result.data.tinhtrang : null,
        });
      }

      // 7. Logic check tình trạng khả dụng theo loại hình thuê
      let tinhTrangPhongKhaDung = false;

      if (loaiHinhThue === 'Nguyên phòng') {
        // Nguyên phòng: TẤT CẢ giường trong phòng phải 'Chưa sử dụng'
        if (maphongChinh) {
          const bedsResult = await giuongService.layDanhSachGiuongCuaPhong(maphongChinh);
          const allBeds = bedsResult.success ? bedsResult.data : [];
          tinhTrangPhongKhaDung =
            allBeds.length > 0 &&
            allBeds.every(g => g.tinhtrang === 'Chưa sử dụng');
          console.log(`[layChiTietVoiTinhTrang] Nguyên phòng: allBeds=${JSON.stringify(allBeds)}, khaDung=${tinhTrangPhongKhaDung}`);
        }
      } else {
        // Ở ghép: các giường đã chốt đều phải 'Chưa sử dụng'
        tinhTrangPhongKhaDung =
          dsGiuongDaChotVoiTinhTrang.length > 0 &&
          dsGiuongDaChotVoiTinhTrang.every(g => g.tinhTrang === 'Chưa sử dụng');
        console.log(`[layChiTietVoiTinhTrang] Ở ghép: khaDung=${tinhTrangPhongKhaDung}`);
      }

      // 8. Thông tin khách hàng từ join khach_hang
      const khachHang = phieuData.khach_hang;

      // 9. Build response
      const response = {
        maHoSo:      phieuData.mayc,
        trangThai:   phieuData.trangthai,
        ngayVaoO:    phieuData.thoigiandukienvao,
        thoiHanThue: phieuData.thoihanthue,
        loaiHinhThue,
        soLuongDuKien: phieuData.soluongdukien,
        lyDoHuy:     phieuData.lydohuy,
        maNV:        phieuData.manv,
        khachHang: {
          maKH:          khachHang?.makh,
          hoTen:         khachHang?.hoten,
          gioiTinh:      khachHang?.gioitinh,
          sdt:           khachHang?.sdt,
          cccd:          khachHang?.socccd,
          quocTich:      khachHang?.quoctich,
          loaiKhachHang: khachHang?.loaikhachhang,
          soNguoiDuKien: phieuData.soluongdukien,
        },
        phong: phongInfo ? {
          maPhong:       phongInfo.maphong,
          maChiNhanh:    phongInfo.macn,
          tienThueThang: phongInfo.tienthuethang,
          loaiPhong:     loaiHinhThue,
        } : null,
        dsGiuongDaChot:       dsGiuongDaChotVoiTinhTrang,
        tinhTrangPhongKhaDung,
        chiNhanh: chiNhanhInfo ? {
          maCN:       chiNhanhInfo.macn,
          tenCN:      chiNhanhInfo.tencn,
          noiQuy:     chiNhanhInfo.noiquy,
          quyDinhCoc: chiNhanhInfo.quydinhcoc,
        } : null,
      };

      console.log('[layChiTietVoiTinhTrang] response.phong:', response.phong);
      console.log('[layChiTietVoiTinhTrang] tinhTrangPhongKhaDung:', tinhTrangPhongKhaDung);
      return { success: true, data: response };
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.layChiTietVoiTinhTrang:', error);
      return { success: false, message: 'Lỗi server', error };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  // UC3 (extend): Cập nhật thông tin khách thuê
  // Gọi từ: PUT /api/phieu-yeu-cau/:mayc/thong-tin-khach
  // ─────────────────────────────────────────────────────────────────────────────
  static async capNhatThongTinKhach(mayc, { hoTen, sdt, cccd, ngayVaoO }) {
    try {
      // 1. Validate
      const errors = [];
      if (!hoTen || hoTen.trim().length === 0) errors.push({ field: 'hoTen', message: 'Họ tên không được để trống' });
      if (hoTen && hoTen.length > 100) errors.push({ field: 'hoTen', message: 'Họ tên không được quá 100 ký tự' });
      if (!/^[0-9]{10,11}$/.test(sdt)) errors.push({ field: 'sdt', message: 'Số điện thoại không hợp lệ (10-11 chữ số)' });
      if (!/^[0-9]{12}$/.test(cccd)) errors.push({ field: 'cccd', message: 'Số CCCD không hợp lệ (đúng 12 chữ số)' });
      if (ngayVaoO && new Date(ngayVaoO) < new Date(new Date().toDateString())) {
        errors.push({ field: 'ngayVaoO', message: 'Ngày vào ở không được là ngày quá khứ' });
      }
      if (errors.length > 0) {
        return { success: false, message: 'Định dạng thông tin không đúng', errors };
      }

      // 2. Lấy makh từ phiếu
      const pycResult = await chiTietPhieuYeuCauService.layChiTiet(mayc);
      if (!pycResult.success || !pycResult.data) {
        return { success: false, message: 'Không tìm thấy hồ sơ' };
      }
      const makh = pycResult.data.makh;

      // 3. Cập nhật khách hàng
      const khResult = await khachHangService.updateThongTin(makh, {
        hoten: hoTen,
        sdt,
        socccd: cccd,
      });
      if (!khResult.success) return { success: false, message: 'Lỗi cập nhật thông tin khách hàng', error: khResult.error };

      // 4. Cập nhật ngày vào ở trong phiếu (nếu có)
      if (ngayVaoO) {
        await phieuYeuCauDao.updateThoiGianVao(mayc, ngayVaoO);
      }

      return { success: true, message: 'Thay đổi thông tin thành công', data: { mayc, makh } };
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.capNhatThongTinKhach:', error);
      return { success: false, message: 'Lỗi server', error };
    }
  }

  // =============================================================================
  // PHẦN CỦA DUYÊN: UC2 (extend) - Hủy thuê
  // Gọi từ: PATCH /api/phieu-yeu-cau/:mayc/huy-thue
  // =============================================================================
  static async huyThue(mayc, lyDoHuy) {
    try {
      if (!lyDoHuy || lyDoHuy.trim().length === 0) {
        return { success: false, message: 'Lý do hủy không được để trống' };
      }
      const result = await phieuYeuCauDao.updateLyDoHuy(mayc, lyDoHuy.trim());
      if (!result.success) return { success: false, message: 'Lỗi cập nhật', error: result.error };
      return { success: true, message: 'Hủy thuê thành công', data: { mayc, trangthai: 'Hủy thuê', lydohuy: lyDoHuy } };
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.huyThue:', error);
      return { success: false, message: 'Lỗi server', error };
    }
  }

  // =============================================================================
  // PHẦN CỦA DUYÊN: UC4 - Ghi nhận xác nhận thuê (Tạo phiếu TT cọc + giữ chỗ)
  // Gọi từ: POST /api/phieu-yeu-cau/:mayc/xac-nhan-thue
  // =============================================================================
  static async ghiNhanXacNhanNoiQuy(mayc) {
    try {
      // 1. Lấy thông tin PYC + chi tiết phòng/giường
      const pycResult = await chiTietPhieuYeuCauService.layChiTiet(mayc);
      if (!pycResult.success || !pycResult.data) {
        return { success: false, message: 'Không tìm thấy hồ sơ' };
      }
      const phieuData = pycResult.data;
      const makh     = phieuData.makh;
      const manv     = phieuData.manv;
      const chiTiet  = phieuData.chi_tiet || [];

      // 2. Lọc ra CHỈ những giường đã chốt (trangthaichot = 'Chốt')
      const giuongDaChot = chiTiet.filter(ct => ct.trangthaichot === 'Chốt');
      if (giuongDaChot.length === 0) {
        return { success: false, message: 'Hồ sơ chưa có giường nào được chốt' };
      }

      // 3. Sinh mã thanh toán mới (tăng dần: TT001, TT002, ...)
      const matt = await thanhToanService.TaoMa();

      // 4. Tạo phiếu thanh toán cọc (SoTien = 0, kế toán tính sau)
      await thanhToanService.ThemPhieu({
        matt,
        loaitt:          'Tiền cọc',
        sotien:          0,
        thoidiemyeucau:  new Date().toISOString(),
        trangthai:       'Chờ tính cọc',
        mayc,
        makh,
        manvsale:        manv,
      });

      // 5. Cập nhật tinhtrang từng GIƯỜNG đã chốt → 'Đang giữ chỗ'
      const giuongErrors = [];
      for (const ct of giuongDaChot) {
        const result = await giuongService.capNhatTinhTrangGiuong(ct.magiuong, ct.maphong, 'Đang giữ chỗ');
        if (!result.success) {
          console.error(`Lỗi cập nhật giường ${ct.magiuong}/${ct.maphong}:`, result.error);
          giuongErrors.push({ magiuong: ct.magiuong, maphong: ct.maphong });
        }
      }

      // 6. Chuyển trạng thái PYC → 'Hoàn tất'
      await phieuYeuCauDao.updateTrangThai(mayc, 'Hoàn tất');

      return {
        success: true,
        message: 'Đã chuyển sang bộ phận kế toán thành công',
        data: {
          maHoSo:      mayc,
          trangThaiPYC: 'Hoàn tất',
          phieuThanhToan: {
            maTT:     matt,
            loaiTT:   'Tiền cọc',
            trangThai:'Chờ thanh toán',
          },
          dsGiuongDaGiuCho: giuongDaChot.map(ct => ({
            maGiuong: ct.magiuong,
            maPhong:  ct.maphong,
            tinhTrang:'Đang giữ chỗ',
          })),
          ...(giuongErrors.length > 0 && { warningGiuong: giuongErrors }),
        },
      };
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.ghiNhanXacNhanNoiQuy:', error);
      return { success: false, message: 'Lỗi server', error };
    }
  }
}

module.exports = phieuYeuCauService;
