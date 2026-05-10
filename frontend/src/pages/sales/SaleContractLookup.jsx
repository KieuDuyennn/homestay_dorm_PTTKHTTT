import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Calendar, User, Phone, Home, AlertCircle } from "lucide-react";
import api from "../../services/api";
import MainLayout from "../../components/MainLayout";

export function SaleContractLookup() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const HienThiDanhSachHopDong = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get('/checkout/contracts/search', {
        params: { keyword: query, status: 'all' }
      });
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    HienThiDanhSachHopDong("");
  }, []);

  const XuLyTimKiem = () => {
    HienThiDanhSachHopDong(searchQuery);
  };

  const XuLyDatLichTraPhong = (contract) => {
    if (contract) {
      navigate(`/sale/return-schedule/${contract.mahd}`);
    }
  };

  const DinhDangNgay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };



  const LayThongTinPhong = (contract) => {
    try {
      const giuong = contract.hop_dong_giuong[0].giuong;
      return `${giuong.maphong}`;
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tra cứu hợp đồng</h1>
          <p className="text-gray-500 mt-2">
            Nhập thông tin để tìm kiếm hợp đồng
          </p>
        </div>

        <div className="border rounded-lg bg-white shadow-sm p-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium leading-none">Tìm kiếm</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    id="search"
                    placeholder="Nhập tên, số điện thoại hoặc mã hợp đồng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && XuLyTimKiem()}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm pl-9 focus:outline-none focus:ring-2 focus:ring-[#e60076]"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={XuLyTimKiem}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-[#e60076] to-[#ec003f] text-white hover:opacity-90 h-10 px-4 py-2 disabled:opacity-50"
                >
                  {loading ? 'Đang tìm...' : 'Tra cứu ngay'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {!loading && searchResults.length === 0 && !error && (
          <div className="border border-orange-200 bg-orange-50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <p className="text-orange-900 font-medium">
                {searchQuery.trim() ? "Không tìm thấy hợp đồng phù hợp" : "Chưa có hợp đồng nào"}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-900 font-medium">{error}</p>
            </div>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <div className="space-y-6">
            {searchResults.map((contract) => (
              <div key={contract.mahd} className="border rounded-lg bg-white shadow-sm">
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="font-semibold leading-none tracking-tight text-lg">Thông tin hợp đồng</h3>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${contract.trangthai === 'Đã ký xác nhận' ? 'bg-[#fce7f3] text-[#e60076]' : 'bg-gray-100 text-gray-800'}`}>
                    {contract.trangthai}
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Mã hợp đồng</p>
                        <p className="font-medium">{contract.mahd}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Khách hàng</p>
                        <p className="font-medium">{contract.khach_hang?.hoten || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{contract.khach_hang?.sdt || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Home className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phòng</p>
                        <p className="font-medium">{LayThongTinPhong(contract)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Thời hạn hợp đồng</p>
                        <p className="font-medium">
                          {DinhDangNgay(contract.ngaybatdau)} - {DinhDangNgay(contract.ngayketthuc || contract.ngaybatdau)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái lịch trả phòng</p>
                        <span className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${contract.trangthai === 'Đã ký xác nhận' ? 'border-gray-200 text-gray-800' : 'bg-[#fce7f3] text-[#e60076]'}`}>
                          {contract.trangthai === 'Đã ký xác nhận' ? 'Chưa có lịch' : 'Đã đăng ký'}
                        </span>
                      </div>
                      {contract.trangthai === 'Đã ký xác nhận' && (
                        <button
                          onClick={() => XuLyDatLichTraPhong(contract)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-[#e60076] to-[#ec003f] text-white hover:opacity-90 h-10 px-4 py-2"
                        >
                          Chọn đặt lịch trả phòng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
