const dao = require('../dao/DichVu.dao');

class DichVu_BUS {

}
//ko biết cách bỏ này vô
/**
 * Lấy DS dịch vụ theo hợp đồng (qua chi nhánh phòng)
 */
async function layDVTheoHopDong(maHD) {
    const hd = await dao.docThongTinHD(maHD);
    if (!hd || !hd.phong) return [];
    return dao.layDSTheoChiNhanhCuaPhong(hd.phong.maphong);
}

/**
 * Tính tổng phí dịch vụ
 */
function tinhTongPhiDV(dsDichVu) {
    return dsDichVu.reduce((sum, dv) => sum + (Number(dv.gia) || 0), 0);
}

// module.exports = {

//   // DichVu_BUS
//   layDVTheoHopDong,
//   tinhTongPhiDV,

// };


module.exports = DichVu_BUS;