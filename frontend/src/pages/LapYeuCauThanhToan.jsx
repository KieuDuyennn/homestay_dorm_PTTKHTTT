import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { getInitialPaymentInfo, createInitialPayment, generatePaymentId } from '../services/payment.service';
import ModalThongBao from '../components/ModalThongBao';

const LapYeuCauThanhToan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    HienThi(id);
  }, [id]);

  const HienThi = async (maHD) => {
    try {
      setLoading(true);
      // 1. Lấy thông tin thanh toán
      const res = await getInitialPaymentInfo(maHD);
      setData(res);
      
      // 2. Sinh mã thanh toán sớm
      const maTT = await generatePaymentId();
      setPaymentId(maTT);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Không thể tải thông tin hợp đồng.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const btnXacNhan_Click = async () => {
    try {
      setSubmitting(true);
      const user = JSON.parse(localStorage.getItem('user'));
      await createInitialPayment({ 
        maHD: id, 
        maNV: user?.maNV || 'NV01',
        maTT: paymentId
      });
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo yêu cầu thanh toán.');
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const btnQuayLai_Click = () => {
    navigate(-1);
  };

  if (loading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </MainLayout>
  );

  const { hopDong, tienCoc, dichVu } = data || {};
  const tongDichVu = dichVu?.reduce((sum, dv) => sum + Number(dv.gia), 0) || 0;
  const tongTien = Number(tienCoc) + tongDichVu;

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-50/50">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6 pb-20">
            
            {/* 1. Customer & Contract Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                  Thông tin khách hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Họ tên</span>
                    <span className="font-bold text-navy">{hopDong?.khach_hang?.hoten}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Số điện thoại</span>
                    <span className="font-bold text-navy">{hopDong?.khach_hang?.sdt}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Số CCCD</span>
                    <span className="font-bold text-navy">{hopDong?.khach_hang?.socccd}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                  Thông tin hợp đồng
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Mã thanh toán</span>
                    <span className="font-bold text-primary">{paymentId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Mã hợp đồng</span>
                    <span className="font-bold text-navy">{hopDong?.mahd}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Ngày ký</span>
                    <span className="font-bold text-navy">{new Date(hopDong?.ngaybatdau).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Trạng thái</span>
                    <span className="font-bold text-emerald-600">{hopDong?.trangthai}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Room Info */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                Thông tin phòng/giường đã cọc
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Mã phòng</span>
                    <span className="font-bold text-navy">{hopDong?.hop_dong_giuong?.[0]?.giuong?.maphong}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Loại hình</span>
                    <span className="font-bold text-navy">{hopDong?.hop_dong_giuong?.[0]?.giuong?.phong?.loaihinh}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Mã giường</span>
                    <span className="font-bold text-navy">{hopDong?.hop_dong_giuong?.map(item => item.magiuong).join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Details */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                Chi tiết yêu cầu thanh toán
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-400 uppercase">Tiền cọc (Đã đối soát)</span>
                    <span className="text-xl font-black text-indigo-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tienCoc)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Các khoản phí dịch vụ</span>
                  <div className="space-y-2">
                    {dichVu?.map((dv, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1 border-b border-dashed border-slate-100">
                        <span className="text-slate-600">{dv.tendv}</span>
                        <span className="font-bold text-navy">{new Intl.NumberFormat('vi-VN').format(dv.gia)}đ</span>
                      </div>
                    ))}
                    {(!dichVu || dichVu.length === 0) && (
                      <p className="text-slate-400 text-sm italic">Không có thông tin dịch vụ</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-slate-100 flex justify-between items-center">
                  <span className="text-lg font-bold text-navy">Tổng tiền thanh toán kỳ đầu</span>
                  <span className="text-2xl font-black text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tongTien)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200/60 flex justify-center gap-4 z-10">
          <button 
            onClick={btnQuayLai_Click}
            className="px-8 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            Quay lại
          </button>
          <button 
            onClick={btnXacNhan_Click}
            disabled={submitting}
            className="px-10 py-3.5 rounded-2xl bg-primary shadow-lg shadow-primary/25 font-black text-white hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70 flex items-center gap-2"
          >
            {submitting ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                Xác nhận yêu cầu thanh toán
              </>
            )}
          </button>
        </div>

        {/* Success Modal */}
        <ModalThongBao 
          show={showSuccess}
          type="success"
          title="Tạo yêu cầu thanh toán thành công"
          message={`Yêu cầu thanh toán kỳ đầu ${paymentId} đã được tạo thành công.`}
          primaryAction={{
            label: "Quay lại danh sách YCTT",
            onClick: () => navigate('/thanh-toan-dau-ky')
          }}
        />

        {/* Error Modal */}
        <ModalThongBao 
          show={showError}
          type="error"
          title="Lỗi"
          message={errorMessage}
          primaryAction={{
            label: "Thử lại",
            onClick: () => setShowError(false)
          }}
          secondaryAction={{
            label: "Hủy",
            onClick: () => navigate('/thanh-toan-dau-ky')
          }}
        />
      </div>
    </MainLayout>
  );
};

export default LapYeuCauThanhToan;
