import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const phieuYeuCauService = {
  taoPhieuYeuCau: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/phieu-yeu-cau/dang-ky`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Lỗi kết nối máy chủ' };
    }
  }
};
