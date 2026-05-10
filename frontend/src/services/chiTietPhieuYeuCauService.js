import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const chiTietPhieuYeuCauService = {
  // Lấy chi tiết phiếu (bao gồm các dòng phòng/giường)
  layChiTiet: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/phieu-yeu-cau/chi-tiet/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi chiTietPhieuYeuCauService.layChiTiet:', error);
      return { success: false, message: 'Lỗi khi tải chi tiết' };
    }
  },

  // Chốt trạng thái cho một dòng chi tiết cụ thể
  updateTrangThaiChot: async (data) => {
    try {
      const response = await axios.patch(`${API_URL}/phieu-yeu-cau/update-trang-thai-chot`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi chiTietPhieuYeuCauService.updateTrangThaiChot:', error);
      throw error;
    }
  },

  // Xóa một dòng chi tiết khỏi phiếu
  deleteChiTiet: async (mayc, maphong, magiuong) => {
    try {
      const response = await axios.delete(`${API_URL}/phieu-yeu-cau/chi-tiet/${mayc}/${maphong}/${magiuong}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi chiTietPhieuYeuCauService.deleteChiTiet:', error);
      throw error;
    }
  }
};
