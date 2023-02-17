import NganHangCauHoi from "../../../components/layouts/DaoTao/nganHangCauHoi/nganHangCauHoi";
import QuanLyTaiLieu from "../../../components/layouts/DaoTao/loaiTaiLieu/loaiTaiLieu";
import QuanLyKyThi from "../../../components/layouts/DaoTao/quanLyKyThi/quanLyKyThi";
import QuanLyKhoaHoc from "../../../components/layouts/DaoTao/quanLyKhoaHoc/quanLyKhoaHoc";
import BaiThi from "../../../components/layouts/DaoTao/ChiTietBaiThi/BaiThi"

const DaoTaoRoutes = [
  {
    path: "/dao-tao/quan-ly-khoa-hoc",
    exact: false,
    main: ({ history }) => <QuanLyKhoaHoc history={history} />,
  },
  {
    path: "/dao-tao/ngan-hang-cau-hoi",
    exact: false,
    main: ({ history }) => <NganHangCauHoi history={history} />,
  },
  {
    path: "/dao-tao/quan-ly-tai-lieu",
    exact: false,
    main: ({ history }) => <QuanLyTaiLieu history={history} />,
  },
  {
    path: "/dao-tao/quan-ly-ky-thi",
    exact: false,
    main: ({ history }) => <QuanLyKyThi history={history} />,
  },
  {
    path: "/dao-tao/bai-thi",
    exact: false,
    main: ({ history }) => <BaiThi history={history} />,
  },
];

export default DaoTaoRoutes;
