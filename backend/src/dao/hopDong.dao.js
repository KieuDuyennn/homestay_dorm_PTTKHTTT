const supabase = require('../config/supabase');

async function layDanhSachTheoTrangThai(tt) {
  const { data, error } = await supabase
    .from('hop_dong')
    .select(`
      mahd,
      trangthai,
      ngaybatdau,
      khach_hang (
        hoten,
        sdt
      ),
      hop_dong_giuong (
        magiuong,
        giuong (
          maphong,
          phong (
            loaihinh
          )
        )
      )
    `)
    .eq('trangthai', tt)
    .order('ngaybatdau', { ascending: false });

  if (error) throw error;
  return data;
}

async function timKiem(keyword, tt) {
  if (!keyword) {
    return await layDanhSachTheoTrangThai(tt);
  }

  const k = `%${keyword}%`;

  const selectQuery = `
    mahd,
    trangthai,
    ngaybatdau,
    khach_hang!inner (
      hoten,
      sdt
    ),
    hop_dong_giuong (
      magiuong,
      giuong (
        maphong,
        phong (
          loaihinh
        )
      )
    ),
    thanh_toan (
      loaitt,
      trangthai
    )
  `;

  // Tìm kiếm song song 3 trường
  const [resMaHD, resTen, resSDT] = await Promise.all([
    supabase.from('hop_dong').select(selectQuery.replace('!inner', '')).eq('trangthai', tt).ilike('mahd', k),
    supabase.from('hop_dong').select(selectQuery).eq('trangthai', tt).ilike('khach_hang.hoten', k),
    supabase.from('hop_dong').select(selectQuery).eq('trangthai', tt).ilike('khach_hang.sdt', k)
  ]);

  if (resMaHD.error) throw resMaHD.error;
  if (resTen.error) throw resTen.error;
  if (resSDT.error) throw resSDT.error;

  // Gộp kết quả và loại bỏ trùng lặp theo mahd
  const map = new Map();
  [...(resMaHD.data || []), ...(resTen.data || []), ...(resSDT.data || [])].forEach(hd => {
    // Lọc bỏ những hợp đồng đã có phiếu "Tiền thuê" đang "Chờ thanh toán"
    const hasChoThanhToan = hd.thanh_toan?.some(t =>
      t.loaitt === 'Tiền thuê' && t.trangthai === 'Chờ thanh toán'
    );
    if (!hasChoThanhToan && !map.has(hd.mahd)) map.set(hd.mahd, hd);
  });

  const result = Array.from(map.values());

  // Sắp xếp theo ngày bắt đầu giảm dần (mới nhất lên đầu)
  result.sort((a, b) => new Date(b.ngaybatdau) - new Date(a.ngaybatdau));

  return result;
}

async function docTheoMa(maHD) {
  const { data, error } = await supabase
    .from('hop_dong')
    .select(`
      *,
      khach_hang (*),
      hop_dong_giuong (
        magiuong,
        giuong (
          *,
          phong (*)
        )
      )
    `)
    .eq('mahd', maHD)
    .single();

  if (error) throw error;
  return data;
}

async function capNhatTrangThai(maHD, tt) {
  const { data, error } = await supabase
    .from('hop_dong')
    .update({ trangthai: tt })
    .eq('mahd', maHD)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// HopDong_DAO — Truy vấn bảng HOP_DONG
// ============================================================

/**
 * Lấy danh sách hợp đồng đã ký xác nhận, join KHACH_HANG
 */
async function layDSHDDaKyXacNhan() {
  // Dọn rác: Tự động xoá các phiếu YCTT kỳ đầu đang ở trạng thái 'Mới' (do người dùng thoát ngang)
  await supabase
    .from('thanh_toan')
    .delete()
    .eq('loaitt', 'Tiền thuê')
    .eq('trangthai', 'Mới');

  const { data, error } = await supabase
    .from('hop_dong')
    .select('*, khach_hang(*), thanh_toan(loaitt, trangthai)')
    .eq('trangthai', 'Đã ký xác nhận')
    .order('ngaybatdau', { ascending: false });

  if (error) throw error;

  // Lọc bỏ những hợp đồng đã có phiếu "Tiền thuê" ở trạng thái "Chờ thanh toán"
  return (data || []).filter(hd => {
    const hasChoThanhToan = hd.thanh_toan?.some(tt =>
      tt.loaitt === 'Tiền thuê' && tt.trangthai === 'Chờ thanh toán'
    );
    return !hasChoThanhToan;
  });
}

/**
 * Đọc chi tiết 1 hợp đồng + join KH, giường, phòng
 */
async function docThongTinHDRutGon(maHD) {
  const { data, error } = await supabase
    .from('hop_dong')
    .select('*, khach_hang(*)')
    .eq('mahd', maHD)
    .single();

  if (error) throw error;

  // Lấy thông tin giường qua bảng trung gian
  const { data: hdGiuong, error: errGiuong } = await supabase
    .from('hop_dong_giuong')
    .select('magiuong, maphong')
    .eq('mahd', maHD);

  if (errGiuong) throw errGiuong;

  data.giuongList = hdGiuong || [];
  // Lấy thông tin phòng từ mã phòng đầu tiên
  if (hdGiuong && hdGiuong.length > 0) {
    const maPhong = hdGiuong[0].maphong;
    const { data: phongData } = await supabase
      .from('phong')
      .select('maphong, soluonggiuong, gioitinh, loaihinh, tienthuethang, trangthai, macn')
      .eq('maphong', maPhong)
      .single();
    data.phong = phongData;
  }

  return data;
}



module.exports = {
  layDanhSachTheoTrangThai,
  timKiem,
  docTheoMa,
  capNhatTrangThai,
  layDSHDDaKyXacNhan,
  docThongTinHDRutGon
};
