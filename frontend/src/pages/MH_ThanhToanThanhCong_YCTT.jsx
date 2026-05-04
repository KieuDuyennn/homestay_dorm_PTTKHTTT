import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { layChiTietYCTT } from '../services/lapYCTT.service';

const MH_ThanhToanThanhCong_YCTT = () => {
  const { maTT } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { navigate('/'); return; }
    fetchData();
  }, [maTT, navigate]);

  const fetchData = async () => {
    try {
      const result = await layChiTietYCTT(maTT);
      setData(result);
    } catch (err) {
      // fallback
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full p-10 text-center"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FDF2F8 50%, #F0F4FF 100%)' }}>

          {/* Icon thành công */}
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-200">
            <svg className="text-emerald-500" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-[24px] font-extrabold text-navy mb-2">Yêu cầu thanh toán thành công</h1>
          <p className="text-[14px] text-gray-400 mb-8">Yêu cầu thanh toán đã được tạo và ghi nhận thành công.</p>

          {/* Card chi tiết */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-left mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] text-gray-400 uppercase font-bold">MÃ TT</span>
              <span className="text-[14px] font-bold text-navy">{data?.matt || maTT}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] text-gray-400 uppercase font-bold">TRẠNG THÁI</span>
              <span className="bg-amber-50 text-amber-600 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200">
                {data?.trangthai || 'Chờ thanh toán'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 uppercase font-bold">SỐ TIỀN CẦN THANH TOÁN</span>
              <span className="text-[22px] font-extrabold text-primary">
                {data?.sotien ? Number(data.sotien).toLocaleString('vi-VN') : '0'} VND
              </span>
            </div>
          </div>

          {/* Nút quay lại */}
          <button
            onClick={() => navigate('/danh-sach-hop-dong-yctt')}
            className="py-3.5 px-8 border border-gray-200 text-gray-600 text-[14px] font-bold rounded-xl hover:bg-gray-50 transition-colors bg-white"
          >
            Quay lại danh sách YCTT
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default MH_ThanhToanThanhCong_YCTT;
