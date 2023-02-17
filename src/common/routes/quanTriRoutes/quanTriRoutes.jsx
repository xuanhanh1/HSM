import VaiTro from "../../../components/layouts/QuanTri/vaiTro/vaiTro";
import PhanQuyen from "../../../components/layouts/QuanTri/phanQuyen/phanQuyen";
import LichSuNguoiDung from "../../../components/layouts/QuanTri/lichSuNguoiDung/lichSuNguoiDung";

const quanTriRoutes = [
  {
    path: "/quan-tri/vai-tro",
    exact: false,
    main: ({ history }) => <VaiTro history={history} />,
  },
  {
    path: "/quan-tri/phan-quyen",
    exact: false,
    main: ({ history }) => <PhanQuyen history={history} />,
  },
  {
    path: "/quan-tri/lich-su-nguoi-dung",
    exact: false,
    main: ({ history }) => <LichSuNguoiDung history={history} />,
  },
];

export default quanTriRoutes;
