const phongDao = require('../dao/phong.dao');

class phongService {
  // Lấy thông tin 1 phòng theo mã
  static async layThongTinPhong(maphong) {
    return await phongDao.selectByMaPhong(maphong);
  }

  /**
   * Tìm phòng dựa vào nhu cầu thuê từ phiếu yêu cầu
   * @param {object} params - { hinhThucThue, soNguoi, mucGia, chiNhanh, gioiTinh }
   */
  static async timKiemPhong({ hinhThucThue, soNguoi, mucGia, chiNhanh, gioiTinh }) {
    const mucGiaMax = parseFloat(mucGia) || 0;
    const soNguoiThue = parseInt(soNguoi) || 1;

    // Chuyển tên chi nhánh → mã chi nhánh
    let macn = null;
    if (chiNhanh) {
      
      macn = chiNhanh || null;
    }

    if (hinhThucThue === 'Thuê nguyên căn') {
      const result = await phongDao.timPhongNguyenCan({ macn, gioiTinh });
      if (!result.success) return result;

      // Lọc nghiệp vụ:
      // 1. Thuê nguyên căn: phòng phải là "Còn giường trống" (đã lọc ở DAO)
      // 2. Toàn bộ giường trong phòng phải có trạng thái "Chưa sử dụng" hết
      // 3. Số giường >= số người muốn thuê
      // 4. Kiểm tra thỏa mức giá (nếu có yêu cầu)
      const filtered = (result.data || [])
        .filter(p => {
          const dsGiuong = p.giuong || [];
          const allChuaSuDung = dsGiuong.length > 0 && dsGiuong.every(g => g.tinhtrang === 'Chưa sử dụng');
          return allChuaSuDung && dsGiuong.length >= soNguoiThue;
        })
        .map(p => {
          const dsGiuong = p.giuong || [];
          const tongTienThue = (p.tienthuethang || 0) * dsGiuong.length;
          const thoaGia = !mucGiaMax || mucGiaMax <= 0 || tongTienThue <= mucGiaMax;
          return thoaGia
            ? { ...p, giaMoiGiuong: p.tienthuethang, tongTienThue, dsGiuong, dsMagiuong: dsGiuong.map(g => g.magiuong) }
            : null;
        })
        .filter(Boolean);

      return { success: true, loai: 'nguyen-can', data: filtered };
    }

    if (hinhThucThue === 'Ở ghép') {
      const result = await phongDao.timPhongOGhep({ macn, soNguoi: soNguoiThue, gioiTinh });
      if (!result.success) return result;

      // Lọc nghiệp vụ:
      // 1. Ở ghép: Số giường có trạng thái "Chưa sử dụng" PHẢI BẰNG ĐÚNG VỚI số người.
      // 2. Kiểm tra thỏa mức giá (nếu có yêu cầu)
      const ketQua = (result.data || [])
        .flatMap(phong => {
          const giuongTrong = (phong.giuong || [])
            .filter(g => g.tinhtrang === 'Chưa sử dụng')
            .sort((a, b) => {
              const numA = parseInt(String(a.magiuong || '').match(/\d+/)?.[0] || Number.MAX_SAFE_INTEGER, 10);
              const numB = parseInt(String(b.magiuong || '').match(/\d+/)?.[0] || Number.MAX_SAFE_INTEGER, 10);
              return numA - numB;
            });
            
          // Điều kiện bắt buộc: số giường trống phải BẰNG ĐÚNG số người
          if (giuongTrong.length !== soNguoiThue) return [];

          const tongTienThue = (phong.tienthuethang || 0) * soNguoiThue;
          const thoaGia = !mucGiaMax || mucGiaMax <= 0 || tongTienThue <= mucGiaMax;
          if (!thoaGia) return [];

          return [{
            ...phong,
            giaMoiGiuong: phong.tienthuethang,
            tongTienThue,
            dsGiuong: giuongTrong,
            dsMagiuong: giuongTrong.map(g => g.magiuong),
            magiuong: giuongTrong[0]?.magiuong || null,
          }];
        });

      return { success: true, loai: 'o-ghep', data: ketQua };
    }

    return { success: false, message: 'Hình thức thuê không hợp lệ' };
  }
}

module.exports = phongService;
