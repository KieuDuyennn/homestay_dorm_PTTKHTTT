const supabase = require('../config/supabase');

// ============================================================
// DichVu_DAO — Truy vấn bảng DICH_VU
// ============================================================

/**
 * Lấy TẤT CẢ dịch vụ của chi nhánh chứa phòng (qua chuỗi: PHONG → CHI_NHANH → CHI_NHANH_DICH_VU → DICH_VU)
 */
async function layDSTheoChiNhanhCuaPhong(maPhong) {
    // Bước 1: Lấy mã chi nhánh từ phòng
    const { data: phong, error: errPhong } = await supabase
        .from('phong')
        .select('macn')
        .eq('maphong', maPhong)
        .single();

    if (errPhong || !phong) return [];

    // Bước 2: Lấy danh sách dịch vụ qua bảng trung gian
    const { data: cnDV, error: errCNDV } = await supabase
        .from('chi_nhanh_dich_vu')
        .select('dich_vu(*)')
        .eq('macn', phong.macn);

    if (errCNDV) return [];
    return cnDV ? cnDV.map(item => item.dich_vu) : [];
}

module.exports = {
    layDSTheoChiNhanhCuaPhong
};