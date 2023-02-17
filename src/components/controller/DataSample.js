let gioiTinh = [{ gioitinh: "Nam" }, { gioitinh: "Nữ" }];
let phuongThucThanhToan = [
  {
    ten: "Tiền mặt",
  },
  {
    ten: "Chuyển khoản",
  },
];
let trangThaiDeNghiThanhToan = [
  {
    TEN_TRANGTHAI: "Đề nghị thanh toán nhà cung cấp",
  },
  {
    TEN_TRANGTHAI: "Nhà cung cấp xác nhận đề nghị thanh toán",
  },
];
let optionVatTuHopDong = [
  { name: "Lập hợp đồng vật tư mới" },
  { name: "Lấy vật tư từ hợp đồng cũ" },
];
let optionPGHNcc = [
  { name: "Danh sách chờ xác nhận đơn hàng" },
  { name: "Danh sách đã xác nhận đơn hàng" },
  { name: "Danh sách bệnh viện hủy đơn hàng" },
  { name: "Danh sách bệnh viện xác nhận giao hàng" },
  { name: "Danh sách gọi hàng hoàn thành" },
];
let optionPGHBV = [
  { name: "Chờ nhà cung cấp xác nhận" },
  { name: "Nhà cung cấp gửi thông tin xác nhận" },
  { name: "Đã hủy phiếu gọi hàng" },
  { name: "Đã xác nhận giao hàng" },
  { name: "Hoàn thành" },
];
let trangThaiNhanVien = [
  { trangthai: "Đang công tác" },
  { trangthai: "Nghỉ hưu" },
  { trangthai: "Thôi việc" },
];
let phanLoaiCanBo = [
  { phanloai: "Công chức " },
  { phanloai: "Viên chức " },
  { phanloai: "Hợp đồng " },
];
let dapAn = [
  { dapAn: "" },
  { dapAn: "A" },
  { dapAn: "B" },
  { dapAn: "C" },
  { dapAn: "D" },
];
let mucDo = [
  { mucDo: "Khó" },
  { mucDo: "Trung bình" },
  { mucDo: "Dễ" },
]
let ngayNhanVien = [
  { ngay: "Ngày chuyển công tác" },
  { ngay: "Ngày nghỉ việc" },
  { ngay: "Ngày từ trần" },
  { ngay: "Ngày hết hợp đồng" },
  { ngay: "Ngày nghỉ hưu" },
]
let LoaiCong = [
  { LoaiCong: "Toàn thời gian", value: "0" },
  { LoaiCong: "Công trực 8/24", value: "8" },
  { LoaiCong: "Công trực 12/24", value: "12" },
  { LoaiCong: "Công trực 16/24", value: "16" },
  { LoaiCong: "Công trực 24/24", value: "24" },
]
let Type = [
  { Type: "Thủ thuật", value: true },
  { Type: "Phẫu thuật", value: false },

]
export {
  gioiTinh,
  phuongThucThanhToan,
  trangThaiDeNghiThanhToan,
  optionVatTuHopDong,
  optionPGHNcc,
  trangThaiNhanVien,
  phanLoaiCanBo,
  optionPGHBV,
  dapAn,
  mucDo,
  LoaiCong,
  Type,
  ngayNhanVien
};
