import apiClient from './apiClient';

/**
 * Lấy danh sách hợp đồng đã ký xác nhận
 */
export async function layDSHDChoYCTT() {
  const res = await apiClient.get('/yeu-cau-thanh-toan/hop-dong');
  return res.data;
}

/**
 * Tìm kiếm hợp đồng
 */
export async function timKiemHD(tuKhoa) {
  const res = await apiClient.get('/yeu-cau-thanh-toan/hop-dong/tim-kiem', {
    params: { q: tuKhoa },
  });
  return res.data;
}

/**
 * Lấy chi tiết hợp đồng + DV + tiền cọc
 */
export async function layChiTietHD(maHD) {
  const res = await apiClient.get(`/yeu-cau-thanh-toan/hop-dong/${maHD}`);
  return res.data;
}

/**
 * Tạo YCTT kỳ đầu
 */
export async function taoYCTTKyDau(maHD) {
  const res = await apiClient.post(`/yeu-cau-thanh-toan/tao/${maHD}`);
  return res.data;
}

/**
 * Lấy chi tiết YCTT
 */
export async function layChiTietYCTT(maTT) {
  const res = await apiClient.get(`/yeu-cau-thanh-toan/${maTT}`);
  return res.data;
}

/**
 * Xác nhận YCTT → "Chờ thanh toán"
 */
export async function xacNhanYCTT(maTT) {
  const res = await apiClient.patch(`/yeu-cau-thanh-toan/${maTT}/xac-nhan`);
  return res.data;
}
