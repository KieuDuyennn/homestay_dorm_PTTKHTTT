import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, FileText, User, Phone, Home, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../services/api";
import MainLayout from "../../components/MainLayout";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function SaleReturnSchedule() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await api.get(`/checkout/contracts/${contractId}`);
        setContract(response.data);
      } catch (err) {
        console.error(err);
        setError("Không tìm thấy hợp đồng");
      } finally {
        setLoading(false);
      }
    };
    if (contractId) fetchContract();
  }, [contractId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto">Đang tải...</div>
      </MainLayout>
    );
  }

  if (!contract || error) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto">
        <div className="border border-red-200 bg-red-50 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-900 font-medium">
              {error || "Không tìm thấy hợp đồng"}
            </p>
          </div>
        </div>
      </div>
      </MainLayout>
    );
  }

  const formatDateStr = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getRoomInfo = (contractData) => {
    try {
      const giuong = contractData.hop_dong_giuong[0].giuong;
      return `${giuong.maphong} - ${giuong.phong.loaihinh}`;
    } catch (e) {
      return "N/A";
    }
  };

  const handleRegister = async () => {
    setValidationError("");

    if (!selectedDate) {
      setValidationError("Vui lòng chọn ngày trả phòng");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosenDate = new Date(selectedDate);
    
    if (chosenDate < today) {
      setValidationError("Thời gian đã chọn không hợp lệ");
      return;
    }

    try {
      await api.post('/checkout/return-schedules', {
        maHD: contract.mahd,
        ngay: selectedDate,
        maNV: 'NV02' // Mock sale staff ID
      });

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setValidationError("Có lỗi xảy ra khi đăng ký lịch trả phòng.");
    }
  };

  const handleBackToSearch = () => {
    navigate("/sale/contract-lookup");
  };

  if (showSuccess) {
    return (
      <MainLayout>
        <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="border border-green-200 bg-green-50 rounded-lg">
          <div className="p-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                Đăng ký thành công!
              </h2>
              <p className="text-green-800">
                Lịch trả phòng đã được tạo và trạng thái là Chưa xác nhận
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 space-y-2 text-left border border-green-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã hợp đồng:</span>
                <span className="font-medium">{contract.mahd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Khách hàng:</span>
                <span className="font-medium">{contract.khach_hang?.hoten || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phòng:</span>
                <span className="font-medium">{getRoomInfo(contract)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày trả phòng:</span>
                <span className="font-medium">
                  {selectedDate && format(new Date(selectedDate), 'dd/MM/yyyy', { locale: vi })} {selectedTime}
                </span>
              </div>
            </div>

            <button 
              onClick={handleBackToSearch} 
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
            >
              Tiếp tục tra cứu
            </button>
          </div>
        </div>
      </div>
      </MainLayout>
    );
  }

  if (validationError) {
    return (
      <MainLayout>
        <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="border border-orange-200 bg-orange-50 rounded-lg">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <p className="text-orange-900 font-medium">
                {validationError}
              </p>
            </div>
            <button 
              onClick={() => setValidationError("")} 
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-orange-200 bg-white hover:bg-orange-100 text-orange-900 h-10 px-4 py-2"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Đăng ký lịch trả phòng</h1>
        <p className="text-gray-500 mt-2">
          Chọn thời gian trả phòng dự kiến
        </p>
      </div>

      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-6 border-b">
          <h3 className="font-semibold leading-none tracking-tight text-lg">Thông tin hợp đồng</h3>
        </div>
        <div className="p-6">
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
                <p className="font-medium">{getRoomInfo(contract)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Thời hạn hợp đồng</p>
                <p className="font-medium">
                  {formatDateStr(contract.ngaybatdau)} - {formatDateStr(contract.ngayketthuc || contract.ngaybatdau)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-6 border-b">
          <h3 className="font-semibold leading-none tracking-tight text-lg">Chọn thời gian trả phòng</h3>
          <p className="text-sm text-gray-500 mt-1">
            Vui lòng chọn ngày và giờ dự kiến trả phòng
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Ngày trả phòng</label>
            <input 
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e60076]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium leading-none">Giờ trả phòng</label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e60076]"
            >
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleBackToSearch} 
              className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2"
            >
              Quay lại
            </button>
            <button 
              onClick={handleRegister} 
              className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-[#e60076] to-[#ec003f] text-white hover:opacity-90 h-10 px-4 py-2"
            >
              Đăng ký lịch hẹn
            </button>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
