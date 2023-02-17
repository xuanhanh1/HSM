import TaiLieuDaoTao from "../../../components/layouts/TaiLieuDaoTao/taiLieuDaoTao/taiLieuDaoTao";
import NganHangCauHoi from "../../../components/layouts/TaiLieuDaoTao/nganHangCauHoi/nganHangCauHoi";
import QuanLyTaiLieu from "../../../components/layouts/TaiLieuDaoTao/loaiTaiLieu/loaiTaiLieu";
import MucDoCauHoi from "../../../components/layouts/TaiLieuDaoTao/mucDoCauHoi/mucDoCauHoi";

const taiLieuDaoTaoRoutes = [
  {
    path: "/dao-tao/tai-lie-dao-tao",
    exact: false,
    main: ({ history }) => <TaiLieuDaoTao history={history} />,
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
    path: "/dao-tao/muc-do-cau-hoi",
    exact: false,
    main: ({ history }) => <MucDoCauHoi history={history} />,
  },
];

export default taiLieuDaoTaoRoutes;
