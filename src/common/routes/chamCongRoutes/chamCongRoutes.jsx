import ChamCong from "../../../components/layouts/chamCong/bangChamCong/chamCong";
import NgayCong from "../../../components/layouts/chamCong/ngayCong/ngayCong";
import NgayTinhCong from "../../../components/layouts/chamCong/ngayTinhCong/ngayTinhCong";

const ChamCongRoutes = [
  {
    path: "/cham-cong/bang-cham-cong",
    exact: false,
    main: ({ history }) => <ChamCong history={history} />,
  },
  {
    path: "/cham-cong/ngay-tinh-cong",
    exact: false,
    main: ({ history }) => <NgayTinhCong history={history} />,
  },
  {
    path: "/cham-cong/ngay-cong",
    exact: false,
    main: ({ history }) => <NgayCong history={history} />,
  },
];

export default ChamCongRoutes;
