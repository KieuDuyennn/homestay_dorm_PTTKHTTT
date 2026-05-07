const dao = require('../dao/LapYCTTKyDau.dao');

// // ============================================================
// // HopDong_BUS
// // ============================================================

// /**
//  * Lấy DS hợp đồng đã ký xác nhận (cho màn hình danh sách)
//  */
// async function layDSHDChoYCTT() {
//   return dao.layDSHDDaKyXacNhan();
// }

// /**
//  * Tìm kiếm hợp đồng theo từ khóa
//  */
// async function timKiemHopDong(tuKhoa) {
//   if (!tuKhoa || tuKhoa.trim() === '') {
//     return dao.layDSHDDaKyXacNhan();
//   }
//   return dao.timKiem(tuKhoa.trim());
// }

// /**
//  * Kiểm tra hợp đồng đã ký xác nhận
//  */
// async function kiemTraHopDongDaKyXacNhan(maHD) {
//   const hd = await dao.docThongTinHDRutGon(maHD);
//   if (!hd) throw Object.assign(new Error('Không tìm thấy hợp đồng'), { status: 404 });
//   if (hd.trangthai !== 'Đã ký xác nhận') {
//     throw Object.assign(new Error('Hợp đồng chưa được ký xác nhận'), { status: 400 });
//   }
//   return hd;
// }

// ============================================================
// DichVu_BUS
// ============================================================

// /**
//  * Lấy DS dịch vụ theo hợp đồng (qua chi nhánh phòng)
//  */
// async function layDVTheoHopDong(maHD) {
//   const hd = await dao.docThongTinHD(maHD);
//   if (!hd || !hd.phong) return [];
//   return dao.layDSTheoChiNhanhCuaPhong(hd.phong.maphong);
// }

// /**
//  * Tính tổng phí dịch vụ
//  */
// function tinhTongPhiDV(dsDichVu) {
//   return dsDichVu.reduce((sum, dv) => sum + (Number(dv.gia) || 0), 0);
// }

// ============================================================
// YeuCauThanhToan_BUS
// ============================================================

// /**
//  * Tính tổng tiền kỳ đầu = Tiền cọc + Tổng phí dịch vụ
//  */
// function tinhTongTienKyDau(tienCoc, dsDichVu) {
//   const tongPhiDV = tinhTongPhiDV(dsDichVu);
//   return tienCoc + tongPhiDV;
// }

// /**
//  * Tạo YCTT kỳ đầu cho hợp đồng
//  */
// async function taoYCTTKyDau(maHD, maNVKT) {
//   try {
//     // 1. Validate hợp đồng đã ký
//     const hd = await kiemTraHopDongDaKyXacNhan(maHD);

//     // 2. Kiểm tra đã có YCTT kỳ đầu chưa (tránh tạo trùng)
//     const existing = await dao.layDSTheoHopDong(maHD);
//     const hasActive = existing.some(tt =>
//       tt.trangthai === 'Mới' || tt.trangthai === 'Chờ thanh toán' || tt.trangthai === 'Đang thanh toán' || tt.trangthai === 'Đã thanh toán'
//     );
//     if (hasActive) {
//       throw Object.assign(new Error('Hợp đồng này đã có yêu cầu thanh toán kỳ đầu đang chờ xử lý'), { status: 400 });
//     }

//     // 3. Lấy tiền cọc từ bảng THANH_TOAN
//     const tienCoc = await dao.layTienCocTheoHD(maHD);

//     // 4. Lấy dịch vụ và tính tổng
//     const maPhong = hd.phong ? hd.phong.maphong : null;
//     let dsDichVu = [];
//     if (maPhong) {
//       dsDichVu = await dao.layDSTheoChiNhanhCuaPhong(maPhong);
//     }
//     const tongTien = tinhTongTienKyDau(tienCoc, dsDichVu);

//     // 5. Sinh mã TT mới
//     const maTT = await dao.sinhMaTT();

//     // 6. Insert vào THANH_TOAN
//     const phieuTT = {
//       matt: maTT,
//       loaitt: 'Tiền thuê',
//       sotien: tongTien,
//       thoidiemyeucau: new Date().toISOString(),

//       trangthai: 'Mới',
//       ghichu: `YCTT kỳ đầu cho hợp đồng ${maHD}`,
//       mahd: maHD,
//       makh: hd.makh,
//       manvkt: maNVKT,
//     };

//     const result = await dao.them(phieuTT);
//     return { ...result, tienCoc, dsDichVu, tongPhiDV: tinhTongPhiDV(dsDichVu) };
//   } catch (error) {
//     // Nếu có lỗi, ghi nhận lỗi vào GhiChu với trạng thái "Thanh toán thất bại"
//     try {
//       const maTT = await dao.sinhMaTT();
//       // Lấy mã KH nếu có thể, dùng regex hay lookup nhanh cũng được nhưng ở đây cứ để null nếu chưa truy vấn đc
//       // Vì HD có thể lấy từ error object nếu cần, nhưng catch block ko có scope đó nếu lỗi trước lấy HD
//       await dao.them({
//         matt: maTT,
//         loaitt: 'Tiền thuê',
//         sotien: 0,
//         thoidiemyeucau: new Date().toISOString(),
//         trangthai: 'Thanh toán thất bại',
//         ghichu: `Lỗi lập YCTT: ${error.message || 'Lỗi hệ thống'}`,
//         mahd: maHD,
//         manvkt: maNVKT
//       });
//     } catch (e) {
//       // Ignored if logging fails
//     }
//     throw error;
//   }
// }

// /**
//  * Xóa yêu cầu thanh toán khi người dùng quay lại
//  */
// async function xoaYCTT(maTT) {
//   const tt = await dao.docThongTinTT(maTT);
//   if (!tt) return; // Không tìm thấy thì thôi
//   if (tt.trangthai === 'Mới') {
//     return dao.xoaThanhToan(maTT);
//   }
//   // Nếu đã xác nhận thì không xoá
// }

// /**
//  * Xác nhận YCTT → trạng thái "Chờ thanh toán"
//  */
// async function xacNhanYCTT(maTT) {
//   const tt = await dao.docThongTinTT(maTT);
//   if (!tt) throw Object.assign(new Error('Không tìm thấy yêu cầu thanh toán'), { status: 404 });
//   if (tt.trangthai !== 'Mới') {
//     throw Object.assign(new Error('Yêu cầu thanh toán không ở trạng thái Mới'), { status: 400 });
//   }
//   return dao.capNhatTrangThai(maTT, 'Chờ thanh toán');
// }

// /**
//  * Lấy chi tiết YCTT
//  */
// async function layChiTietYCTT(maTT) {
//   const tt = await dao.docThongTinTT(maTT);
//   if (!tt) throw Object.assign(new Error('Không tìm thấy yêu cầu thanh toán'), { status: 404 });

//   // Lấy thêm thông tin giường/phòng + dịch vụ + tiền cọc
//   if (tt.mahd) {
//     const hd = await dao.docThongTinHD(tt.mahd);
//     tt.hopDongChiTiet = hd;

//     if (hd && hd.phong) {
//       tt.dsDichVu = await dao.layDSTheoChiNhanhCuaPhong(hd.phong.maphong);
//       tt.tongPhiDV = tinhTongPhiDV(tt.dsDichVu);
//     }

//     tt.tienCoc = await dao.layTienCocTheoHD(tt.mahd);
//   }

//   return tt;
// }

// module.exports = {
//   // HopDong_BUS
//   layDSHDChoYCTT,
//   timKiemHopDong,
//   kiemTraHopDongDaKyXacNhan,
//   // DichVu_BUS
//   layDVTheoHopDong,
//   tinhTongPhiDV,
//   // YeuCauThanhToan_BUS
//   taoYCTTKyDau,
//   tinhTongTienKyDau,
//   xacNhanYCTT,
//   layChiTietYCTT,
//   xoaYCTT,
// };
