function PhieuCard({ title, amount, status, date }) {
  return (
    <div className="phieu-card">
      <h3>{title}</h3>
      <p>Số tiền: {amount}</p>
      <p>Trạng thái: {status}</p>
      <p>Ngày: {date}</p>
    </div>
  );
}

export default PhieuCard;
