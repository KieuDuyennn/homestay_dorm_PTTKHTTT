import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { layChiTietYCTT, xacNhanYCTT } from '../services/lapYCTT.service';

const MH_ChiTietYeuCauThanhToan = () => {
  const { maTT } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { navigate('/'); return; }
    setUser(JSON.parse(savedUser));
    fetchData();
  }, [maTT, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await layChiTietYCTT(maTT);
      setData(result);
    } catch (err) {
      setErrorMsg('Không thể tải chi tiết yêu cầu thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleXacNhan = async () => {
    try {
      setConfirming(true);
      setShowError(false);
      await xacNhanYCTT(maTT);
      navigate(`/thanh-toan-thanh-cong-yctt/${maTT}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Lỗi kết nối máy chủ');
      setShowError(true);
      setConfirming(false);
    }
  };

  if (!user || loading) return (
    <MainLayout>
      <div className="text-center py-20">
        <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </MainLayout>
  );

  if (!data) return (
    <MainLayout>
      <p className="text-gray-500 text-center py-20">Không tìm thấy yêu cầu thanh toán</p>
    </MainLayout>
  );

  const hd = data.hopDongChiTiet;
  const kh = data.khach_hang || hd?.khach_hang;
  const phong = hd?.phong;
  const dsDichVu = data.dsDichVu || [];
  const tongPhiDV = data.tongPhiDV || 0;
  const tienCoc = data.tienCoc || 0;
  const tongCong = Number(data.sotien) || 0;

  return (
    <MainLayout>
      {/* Error Dialog */}
      {showError && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowError(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="text-rose-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-[20px] font-extrabold text-navy mb-2">Gửi yêu cầu thanh toán thất bại</h3>
              <p className="text-[13px] text-gray-500">Hệ thống không thể gửi yêu cầu thanh toán đến khách hàng vào lúc này.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-start gap-3">
              <svg className="text-gray-400 flex-shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-bold mb-1">LỖI HỆ THỐNG</p>
                <p className="text-[14px] font-bold text-navy">{errorMsg}</p>
                <p className="text-[12px] text-gray-400 mt-1">Vui lòng kiểm tra lại đường truyền internet hoặc thử lại sau vài phút.</p>
              </div>
            </div>
            <button
              onClick={handleXacNhan}
              className="w-full py-3.5 text-[14px] font-bold text-white rounded-xl shadow-lg shadow-primary/25 transition-all"
              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}
            >
              ↻ Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/danh-sach-hop-dong-yctt')} className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-navy transition-colors mb-4 font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Quay lại danh sách
        </button>
        <h1 className="text-[28px] font-extrabold text-navy">CHI TIẾT YÊU CẦU THANH TOÁN</h1>
        <p className="text-[13px] text-gray-400 mt-1">Vui lòng kiểm tra và điều chỉnh các khoản phí trước khi xác nhận.</p>
      </div>

      {/* Mã TT + Ngày tạo + Trạng thái */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Mã TT</p>
            <p className="text-[20px] font-extrabold text-primary">{data.matt}</p>
          </div>
          <span className="bg-pink-50 text-primary text-[12px] font-bold px-4 py-1.5 rounded-full border border-pink-200">
            {data.trangthai}
          </span>
          <div className="text-right">
            <p className="text-[12px] text-gray-400 mb-1">NGÀY TẠO</p>
            <p className="text-[15px] font-bold text-navy">
              {data.thoidiemyeucau ? new Date(data.thoidiemyeucau).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-3 gap-6">
        {/* Cột trái (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Khách thuê + Chi tiết phòng */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <p className="text-[11px] text-gray-400 uppercase font-bold mb-3">KHÁCH THUÊ</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-[13px] font-bold text-primary">
                  {kh?.hoten?.split(' ').map(w => w[0]).slice(-2).join('') || '?'}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-navy">{kh?.hoten || '-'}</p>
                  <p className="text-[13px] text-gray-400">{kh?.sdt || '-'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <p className="text-[11px] text-gray-400 uppercase font-bold mb-3">CHI TIẾT PHÒNG</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="text-gray-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-navy">{phong?.maphong || '-'}</p>
                  <p className="text-[13px] text-gray-400">{phong?.loaihinh || '-'} — {phong?.gioitinh || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng chi phí */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-navy">ĐIỀU CHỈNH CHI PHÍ</h2>
              <p className="text-[12px] text-gray-400 italic">* Nhấn vào số tiền để chỉnh sửa</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[12px] text-gray-400 uppercase font-bold pb-3">MỤC PHÍ</th>
                  <th className="text-right text-[12px] text-gray-400 uppercase font-bold pb-3">SỐ TIỀN (VND)</th>
                </tr>
              </thead>
              <tbody>
                {/* Tiền đặt cọc */}
                <tr className="border-b border-gray-50">
                  <td className="py-4 text-[14px] font-medium text-navy">Tiền đặt cọc (Deposit)</td>
                  <td className="py-4 text-[14px] font-bold text-navy text-right">{tienCoc.toLocaleString('vi-VN')}</td>
                </tr>
                {/* Dịch vụ */}
                {dsDichVu.map((dv, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-4 text-[14px] font-medium text-navy">{dv.tendv}</td>
                    <td className="py-4 text-[14px] font-bold text-navy text-right">{Number(dv.gia).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tóm tắt thanh toán */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-[11px] text-gray-400 uppercase font-bold mb-4">TÓM TẮT THANH TOÁN</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500 font-medium">Tổng phí dịch vụ</span>
                <span className="font-bold text-navy">{tongPhiDV.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500 font-medium">Tiền cọc</span>
                <span className="font-bold text-navy">{tienCoc.toLocaleString('vi-VN')}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] text-gray-400 uppercase font-bold">TỔNG CỘNG (SUMMARY)</span>
                  <div className="text-right">
                    <span className="text-[28px] font-extrabold text-primary">{tongCong.toLocaleString('vi-VN')}</span>
                    <span className="text-[14px] font-bold text-gray-400 ml-2">VND</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải (1/3) */}
        <div className="space-y-6">
          {/* Thao tác kế toán */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <p className="text-[13px] text-gray-400 font-medium text-center mb-4">Thao tác kế toán</p>
            <button
              onClick={handleXacNhan}
              disabled={confirming || data.trangthai !== 'Mới'}
              className={`w-full flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold rounded-xl transition-all
                ${data.trangthai === 'Mới'
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {confirming ? 'Đang xử lý...' : 'Xác nhận yêu cầu thanh toán'}
            </button>
          </div>

          {/* Hợp đồng liên quan */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg className="text-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p className="text-[14px] font-bold text-navy">Hợp đồng liên quan</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-gray-400 uppercase font-bold mb-2">TRẠNG THÁI HỢP ĐỒNG</p>
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg className="text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[16px] font-extrabold text-emerald-600">
                  Đã ký kết ({hd?.thoihanthue || '-'} tháng)
                </span>
              </div>
              <p className="text-[12px] text-gray-400">
                Thời hạn: {hd?.ngaybatdau ? new Date(hd.ngaybatdau).toLocaleDateString('vi-VN') : '-'} - {hd?.ngayketthuc ? new Date(hd.ngayketthuc).toLocaleDateString('vi-VN') : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MH_ChiTietYeuCauThanhToan;
