const khachHangService = require('./khachHang.service');
const phieuYeuCauDao = require('../dao/phieuYeuCau.dao');
const chiTietPhieuYeuCauDao = require('../dao/chiTietPhieuYeuCau.dao');
const phongDao = require('../dao/phong.dao');
const giuongDao = require('../dao/giuong.dao');
const thanhToanDao = require('../dao/thanhToan.dao');
const supabase = require('../config/supabase');

class phieuYeuCauService {
  static async taoPhieuYeuCau(data) {
    try {
      // 1. Kiểm tra Khách hàng đã tồn tại qua CCCD chưa
      let maKH;
      const khExist = await khachHangService.findByCCCD(data.CCCD);
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
          trangthai: 'Chờ kiểm tra'  // Constraint: 'Hợp lệ' | 'Chờ kiểm tra'
        };

        const khResult = await khachHangService.insert(khachHangData);
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
        console.log('data.ChiTiet:', data.ChiTiet);
        console.log('Is array:', Array.isArray(data.ChiTiet));
        console.log('Length:', data.ChiTiet?.length);
        
        if (Array.isArray(data.ChiTiet) && data.ChiTiet.length > 0) {
          const supabase = require('../config/supabase');
          const records = [];
          console.log('Bắt đầu xử lý ChiTiet items...');

          // Process each room/bed selection
          for (const item of data.ChiTiet) {
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
              const { data: allBeds, error: bedsError } = await supabase
                .from('giuong')
                .select('magiuong, maphong')
                .eq('maphong', maphong);

              if (bedsError) {
                console.error(`Lỗi lấy danh sách giường cho phòng ${maphong}:`, bedsError);
                continue;
              }

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
            const ctResult = await chiTietPhieuYeuCauDao.insertChiTietMany(records);
            console.log('chiTietPhieuYeuCauDao.insertChiTietMany result:', ctResult);
            if (!ctResult.success) {
              console.error('Không thể lưu chi tiết phiếu yêu cầu:', ctResult.error);
              return { success: true, message: 'Tạo phiếu yêu cầu thành công (chi tiết chưa lưu)', data: { MaYC: maycSaved, MaKH: maKH }, warning: ctResult.error };
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
        data: { MaYC: maYC, MaKH: maKH }
      };

    } catch (error) {
      console.error("Lỗi tại phieuYeuCauService.taoPhieuYeuCau:", error);
      return { success: false, message: 'Lỗi server khi tạo phiếu yêu cầu' };
    }
  }

  static async capNhatLichHen(mayc, thoigianhenxem) {
    try {
      return await phieuYeuCauDao.updateLichHen(mayc, thoigianhenxem);
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

  static async layChiTiet(mayc) {
    try {
      return await phieuYeuCauDao.getChiTiet(mayc);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.layChiTiet:', error);
      return { success: false, error };
    }
  }

  static async updateTrangThaiChot(mayc, maphong, magiuong, trangthaichot) {
    try {
      return await phieuYeuCauDao.updateTrangThaiChot(mayc, maphong, magiuong, trangthaichot);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.updateTrangThaiChot:', error);
      return { success: false, error };
    }
  }

  static async deleteChiTiet(mayc, maphong, magiuong) {
    try {
      return await phieuYeuCauDao.deleteChiTiet(mayc, maphong, magiuong);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.deleteChiTiet:', error);
      return { success: false, error };
    }
  }

  static async huyLich(mayc) {
    try {
      // delete chi_tiet first
      const { success: delCTSuccess, error: delCTError } = await phieuYeuCauDao.deleteChiTiet(mayc, null, null).catch(() => ({}));
      // Note: deleteChiTiet expects specific keys; we will use supabase delete by mayc in DAO deletePhieu which already deletes phieu. But ensure chi_tiet removed first.
      const supabase = require('../config/supabase');
      const { error: chiTietError } = await supabase
        .from('chi_tiet_phieu_yeu_cau')
        .delete()
        .eq('mayc', mayc);

      if (chiTietError) {
        console.error('Lỗi xóa chi_tiet trong huyLich:', chiTietError);
        return { success: false, error: chiTietError };
      }

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

  // ─────────────────────────────────────────────────────────────────────────────
  // UC1: Tra cứu hồ sơ — Lấy danh sách PYC "Cần xác nhận"
  // Gọi từ: GET /api/phieu-yeu-cau/can-xac-nhan
  // ─────────────────────────────────────────────────────────────────────────────
  static async layDanhSachCanXacNhan(keyword) {
    try {
      return await phieuYeuCauDao.selectCanXacNhan(keyword);
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.layDanhSachCanXacNhan:', error);
      return { success: false, error };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UC1: Kiểm tra phòng — Lấy chi tiết PYC + trạng thái thực tế phòng/giường
  // Gọi từ: GET /api/phieu-yeu-cau/chi-tiet-voi-tinh-trang/:mayc
  // ─────────────────────────────────────────────────────────────────────────────
  static async layChiTietVoiTinhTrang(mayc) {
    try {
      // 1. Lấy chi tiết PYC (đã có trong DAO.getChiTiet, join khach_hang + chi_tiet → giuong → phong)
      const pycResult = await phieuYeuCauDao.getChiTiet(mayc);
      if (!pycResult.success) return pycResult;
      if (!pycResult.data) return { success: false, message: 'Không tìm thấy hồ sơ' };

      const phieuData = pycResult.data;

      // 2. Lấy danh sách phòng/giường từ chi_tiet
      const chiTiet = phieuData.chi_tiet || [];

      // 3. Kiểm tra trạng thái THỰC TẾ của từng phòng và giường từ DB
      const dsPhongUnique = [...new Set(chiTiet.map(ct => ct.maphong))];
      const trangThaiPhongMap = {};
      for (const maphong of dsPhongUnique) {
        const result = await phongDao.selectTrangThai(maphong);
        if (result.success) {
          trangThaiPhongMap[maphong] = result.data.trangthai;
        }
      }

      const dsGiuongVoiTinhTrang = [];
      for (const ct of chiTiet) {
        const result = await giuongDao.selectTinhTrang(ct.magiuong, ct.maphong);
        dsGiuongVoiTinhTrang.push({
          magiuong: ct.magiuong,
          maphong: ct.maphong,
          trangthaichot: ct.trangthaichot,
          giagiuong: ct.giuong?.giagiuong,
          tinhTrangThucTe: result.success ? result.data.tinhtrang : null,
          // Thông tin phòng từ join
          phong: ct.giuong?.phong || null,
        });
      }

      // 4. Thông tin chi nhánh từ phòng đầu tiên trong chi tiết
      const phongDauTien = chiTiet[0]?.giuong?.phong || null;
      let chiNhanhInfo = null;
      if (phongDauTien?.macn) {
        const { data: cnData } = await supabase
          .from('chi_nhanh')
          .select('macn, tencn, noiquy, quydinhcoc')
          .eq('macn', phongDauTien.macn)
          .single();
        chiNhanhInfo = cnData || null;
      }

      // 5. Build response theo cấu trúc frontend cần
      const khachHang = phieuData.khach_hang;
      const response = {
        maHoSo: phieuData.mayc,
        trangThai: phieuData.trangthai,
        ngayVaoO: phieuData.thoigiandukienvao,
        thoiHanThue: phieuData.thoihanthue,
        loaiHinhThue: phieuData.loaihinhthue,
        loaiPhong: phieuData.loaiphong,
        soLuongDuKien: phieuData.soluongdukien,
        lyDoHuy: phieuData.lydohuy,
        maNV: phieuData.manv,
        doiTuongThue: khachHang?.loaikhachhang === 'Nhóm' ? 'Đại diện nhóm' : 'Cá nhân',
        khachHang: {
          maKH: khachHang?.makh,
          hoTen: khachHang?.hoten,
          gioiTinh: khachHang?.gioitinh,
          sdt: khachHang?.sdt,
          cccd: khachHang?.socccd,        // ← frontend mock dùng 'cccd', map từ 'socccd'
          quocTich: khachHang?.quoctich,
          loaiKhachHang: khachHang?.loaikhachhang,
          soNguoiDuKien: phieuData.soluongdukien,
        },
        phong: phongDauTien ? {
          maPhong: phongDauTien.maphong,
          maChiNhanh: phongDauTien.macn,
          loaiPhong: phieuData.loaiphong,
          tienThueThang: phongDauTien.tienthuethang,
          gioiTinh: phongDauTien.gioitinh,
          trangThai: trangThaiPhongMap[phongDauTien.maphong] || phongDauTien.trangthai,
        } : null,
        dsGiuong: dsGiuongVoiTinhTrang.map(g => ({
          maGiuong: g.magiuong,
          maPhong: g.maphong,
          giaGiuong: g.giagiuong,
          tinhTrang: g.tinhTrangThucTe,
          trangthaichot: g.trangthaichot,
        })),
        chiNhanh: chiNhanhInfo ? {
          maCN: chiNhanhInfo.macn,
          tenCN: chiNhanhInfo.tencn,
          noiQuy: chiNhanhInfo.noiquy,
          quyDinhCoc: chiNhanhInfo.quydinhcoc,
        } : null,
      };

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
      const pycResult = await phieuYeuCauDao.getChiTiet(mayc);
      if (!pycResult.success || !pycResult.data) {
        return { success: false, message: 'Không tìm thấy hồ sơ' };
      }
      const makh = pycResult.data.makh;

      // 3. Cập nhật khách hàng
      const khachHangDao = require('../dao/khachHang.dao');
      const khResult = await khachHangDao.updateThongTin(makh, {
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

  // ─────────────────────────────────────────────────────────────────────────────
  // UC2 (extend): Hủy thuê
  // Gọi từ: PATCH /api/phieu-yeu-cau/:mayc/huy-thue
  // ─────────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  // UC4: Ghi nhận xác nhận thuê — tạo phiếu TT cọc + giữ chỗ phòng + hoàn tất PYC
  // Gọi từ: POST /api/phieu-yeu-cau/:mayc/xac-nhan-thue
  // ─────────────────────────────────────────────────────────────────────────────
  static async ghiNhanXacNhanNoiQuy(mayc) {
    try {
      // 1. Lấy thông tin PYC + phòng/giường
      const pycResult = await phieuYeuCauDao.getChiTiet(mayc);
      if (!pycResult.success || !pycResult.data) {
        return { success: false, message: 'Không tìm thấy hồ sơ' };
      }
      const phieuData = pycResult.data;
      const makh = phieuData.makh;
      const manv = phieuData.manv; // nhân viên sale đang xử lý
      const chiTiet = phieuData.chi_tiet || [];

      // 2. Lấy maphong từ chi tiết (phòng đầu tiên)
      const maphong = chiTiet.length > 0 ? chiTiet[0].maphong : null;
      if (!maphong) {
        return { success: false, message: 'Hồ sơ chưa có thông tin phòng' };
      }

      // 3. Sinh mã thanh toán mới (tái dùng hàm đã có trong thanhToan.dao.js)
      const matt = await thanhToanDao.sinhMaThanhToan();

      // 4. Tạo phiếu thanh toán cọc (SoTien = 0, kế toán sẽ tính sau)
      const thanhToanData = {
        matt,
        loaitt: 'Tiền cọc',
        sotien: 0,
        thoidiemyeucau: new Date().toISOString(),
        tinhtrangyeucau: 'Chờ tính cọc',
        trangthai: 'Chờ tính cọc',
        mayc: mayc,
        makh,
        manvsale: manv,
      };
      await thanhToanDao.them(thanhToanData);

      // 5. Cập nhật trạng thái phòng → 'Đang giữ chỗ' (hợp lệ theo schema mới)
      const phongResult = await phongDao.updateTrangThai(maphong, 'Đang giữ chỗ');
      if (!phongResult.success) {
        // Log lỗi nhưng không rollback thanh_toan (sẽ xử lý thủ công nếu cần)
        console.error('Lỗi cập nhật trạng thái phòng:', phongResult.error);
      }

      // 6. Chuyển trạng thái PYC → 'Hoàn tất'
      await phieuYeuCauDao.updateTrangThai(mayc, 'Hoàn tất');

      return {
        success: true,
        message: 'Đã chuyển sang bộ phận kế toán thành công',
        data: {
          maHoSo: mayc,
          trangThaiPYC: 'Hoàn tất',
          phieuThanhToan: {
            maTT: matt,
            loaiTT: 'Tiền cọc',
            trangThai: 'Chờ tính cọc',
          },
          phong: {
            maPhong: maphong,
            trangThai: 'Đang giữ chỗ',
          },
        },
      };
    } catch (error) {
      console.error('Lỗi phieuYeuCauService.ghiNhanXacNhanNoiQuy:', error);
      return { success: false, message: 'Lỗi server', error };
    }
  }
}

module.exports = phieuYeuCauService;
