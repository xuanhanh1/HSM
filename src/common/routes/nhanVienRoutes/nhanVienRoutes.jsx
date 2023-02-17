import QuanLyNhanVien from "../../../components/layouts/NhanVien/quanLyNhanVien/quanLyNhanVien";
import LoaiNhanVien from "../../../components/layouts/NhanVien/loaiNhanVien/loaiNhanVien";

const nhanVienRoutes = [
  {
    path: "/nhan-vien/quan-ly-nhan-vien",
    exact: false,
    main: ({ history }) => <QuanLyNhanVien history={history} />,
  },
  {
    path: "/nhan-vien/loai-nhan-vien",
    exact: false,
    main: ({ history }) => <LoaiNhanVien history={history} />,
  },
];

export default nhanVienRoutes;
