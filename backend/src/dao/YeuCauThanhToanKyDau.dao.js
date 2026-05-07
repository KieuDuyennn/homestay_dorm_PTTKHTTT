const supabase = require('../config/supabase');

// ============================================================
// THANHTOAN_DAO — Truy vấn bảng THANH_TOAN
// ============================================================

/**
 * Thêm phiếu YCTT mới (LoaiTT = 'Tiền thuê')
 */
async function them(tt) {
    const { data, error } = await supabase
        .from('thanh_toan')
        .insert(tt)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Đọc chi tiết 1 phiếu thanh toán, join KH và HD
 */
async function docThongTinTT(maTT) {
    const { data, error } = await supabase
        .from('thanh_toan')
        .select('*, khach_hang(*), hop_dong(*)')
        .eq('matt', maTT)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Cập nhật trạng thái phiếu thanh toán
 */
async function capNhatTrangThai(maTT, trangThai) {
    const { data, error } = await supabase
        .from('thanh_toan')
        .update({ trangthai: trangThai })
        .eq('matt', maTT)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Xóa phiếu thanh toán (khi người dùng quay lại/hủy)
 */
async function xoaThanhToan(maTT) {
    const { data, error } = await supabase
        .from('thanh_toan')
        .delete()
        .eq('matt', maTT);

    if (error) throw error;
    return data;
}

/**
 * Lấy DS thanh toán theo hợp đồng (kiểm tra đã có YCTT kỳ đầu chưa)
 */
async function layDSTheoHopDong(maHD) {
    const { data, error } = await supabase
        .from('thanh_toan')
        .select('*')
        .eq('mahd', maHD)
        .eq('loaitt', 'Tiền thuê');

    if (error) throw error;
    return data || [];
}

/**
 * Lấy tiền cọc đã đối soát thành công theo hợp đồng
 */
async function layTienCocTheoHD(maHD) {
    const { data, error } = await supabase
        .from('thanh_toan')
        .select('sotien')
        .eq('mahd', maHD)
        .eq('loaitt', 'Tiền cọc')
        .eq('trangthai', 'Đối soát thành công')
        .single();

    if (error) return 0;
    return data ? data.sotien : 0;
}

/**
 * Sinh mã TT mới (TT + số tăng dần)
 */
async function sinhMaTT() {
    // Lấy tất cả mã TT của Tiền thuê để tìm số lớn nhất (tránh lỗi sort chuỗi TT99 > TT100 và tránh lấy nhầm TTC)
    const { data } = await supabase
        .from('thanh_toan')
        .select('matt')
        .eq('loaitt', 'Tiền thuê');

    if (data && data.length > 0) {
        let maxNum = 0;
        data.forEach(item => {
            const num = parseInt(item.matt.replace(/\D/g, ''), 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        });
        return 'TT' + String(maxNum + 1).padStart(2, '0');
    }
    return 'TT01';
}

module.exports = {
    // THANHTOAN_DAO
    them,
    docThongTinTT,
    capNhatTrangThai,
    xoaThanhToan,
    layDSTheoHopDong,
    layTienCocTheoHD,
    sinhMaTT
};
