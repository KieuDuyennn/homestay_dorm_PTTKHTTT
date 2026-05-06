import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import AppHeader from '../components/AppHeader';
import { getContractById, getCreationData, createCheckoutReport } from '../services/checkout.service';
import ModalThongBao from '../components/ModalThongBao';

const MHTaoBienBanTraPhong = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [contract, setContract] = useState(null);
  const [creationData, setCreationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [reportId, setReportId] = useState('');

  useEffect(() => {
    HienThi(id);
  }, [id]);

  const HienThi = async (maHD) => {
    try {
      setLoading(true);
      const [hd, data] = await Promise.all([
        getContractById(maHD),
        getCreationData(maHD)
      ]);
      setContract(hd);
      setCreationData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const btnTaoBienBan_Click = async () => {
    try {
      setSubmitting(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await createCheckoutReport({ maHD: id, maNV: user?.maNV || 'NV01' });
      setReportId(res.mabienbantp || res.MaBienBanTP);
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo biên bản.');
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

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-50/50">
        <AppHeader title="Tạo biên bản trả phòng" onBack={btnQuayLai_Click} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6 pb-20">
            
            {/* 1. Customer & Room Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                  Thông tin khách hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Họ tên</span>
                    <span className="font-bold text-navy">{contract?.khach_hang?.hoten}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Số điện thoại</span>
                    <span className="font-bold text-navy">{contract?.khach_hang?.sdt}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Số CCCD</span>
                    <span className="font-bold text-navy">{contract?.khach_hang?.socccd}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                  Thông tin phòng/giường
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Mã phòng</span>
                    <span className="font-bold text-navy">{contract?.hop_dong_giuong?.[0]?.giuong?.maphong}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Mã giường</span>
                    <span className="font-bold text-navy">{contract?.hop_dong_giuong?.map(item => item.magiuong).join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500 text-sm">Loại phòng</span>
                    <span className="font-bold text-navy">{contract?.hop_dong_giuong?.[0]?.giuong?.phong?.loaihinh}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Room Status */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                Kết quả kiểm tra tình trạng phòng
              </h3>
              {creationData?.roomReport ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Ngày lập</span>
                    <p className="font-bold text-navy">{new Date(creationData.roomReport.ngaylap).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Vệ sinh</span>
                    <p className="font-bold text-navy">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        creationData.roomReport.ketquavesinh === 'Tốt' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {creationData.roomReport.ketquavesinh}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Trạng thái</span>
                    <p className="font-bold text-navy">{creationData.roomReport.trangthai}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">Không có dữ liệu báo cáo tình trạng phòng</p>
              )}
            </div>

            {/* 3. Reconciliation Result */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                Kết quả đối soát tài chính
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-400 uppercase">Số tiền hoàn cọc</span>
                    <span className="text-xl font-black text-indigo-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(creationData?.reconciliation?.sotienhoancoc || 0)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-400 uppercase">Trạng thái đối soát</span>
                    <p className="font-bold text-navy">{creationData?.reconciliation?.trangthai || 'Chưa đối soát'}</p>
                  </div>
                </div>
                
                {creationData?.reconciliation?.khoan_khau_tru?.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Các khoản khấu trừ</span>
                    <div className="space-y-2">
                      {creationData.reconciliation.khoan_khau_tru.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1 border-b border-dashed border-slate-100">
                          <span className="text-slate-600">{item.tenkhoan}</span>
                          <span className="font-bold text-rose-500">-{new Intl.NumberFormat('vi-VN').format(item.sotien)}đ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Handover Assets */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                Danh sách tài sản bàn giao
              </h3>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-tighter">Vật dụng</th>
                      <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">Số lượng</th>
                      <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-tighter">Hiện trạng lúc nhận</th>
                      <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-tighter">Hiện trạng lúc trả</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {creationData?.handover?.chi_tiet_ban_giao?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-bold text-navy">{item.tai_san_trang_thiet_bi?.tenvatdung}</td>
                        <td className="px-4 py-3 text-sm text-center text-slate-600">{item.soluong}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{item.hientrangnhan}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{item.hientrangtra || '---'}</td>
                      </tr>
                    ))}
                    {(!creationData?.handover?.chi_tiet_ban_giao || creationData?.handover?.chi_tiet_ban_giao.length === 0) && (
                      <tr>
                        <td colSpan="4" className="px-4 py-10 text-center text-slate-400 italic text-sm">Không có danh sách tài sản bàn giao</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
            onClick={btnTaoBienBan_Click}
            disabled={submitting}
            className="px-10 py-3.5 rounded-2xl bg-primary shadow-lg shadow-primary/25 font-black text-white hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70 flex items-center gap-2"
          >
            {submitting ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Tạo biên bản
              </>
            )}
          </button>
        </div>

        {/* Success Modal */}
        <ModalThongBao 
          show={showSuccess}
          type="success"
          title="Tạo biên bản thành công"
          message={`Biên bản trả phòng ${reportId} đã được tạo thành công và lưu vào hệ thống. Bạn có muốn xem trước và in biên bản không?`}
          primaryAction={{
            label: "Xem trước và In",
            onClick: () => navigate(`/xem-truoc-in/${reportId}`)
          }}
          secondaryAction={{
            label: "Để sau",
            onClick: () => navigate('/danh-sach-hop-dong')
          }}
        />

        {/* Error Modal */}
        <ModalThongBao 
          show={showError}
          type="error"
          title="Tạo biên bản thất bại"
          message={errorMessage}
          primaryAction={{
            label: "Thử lại",
            onClick: () => setShowError(false)
          }}
          secondaryAction={{
            label: "Hủy",
            onClick: () => navigate('/danh-sach-hop-dong')
          }}
        />
      </div>
    </MainLayout>
  );
};

export default MHTaoBienBanTraPhong;
