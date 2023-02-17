import CaNhan from "../../../components/layouts/DanhGia/caNhan/caNhan";
import TapThe from "../../../components/layouts/DanhGia/tapThe/tapThe";

const DanhGiaRoutes = [
  {
    path: "/danh-gia/ca-nhan",
    exact: false,
    main: ({ history }) => <CaNhan history={history} />,
  },
  {
    path: "/danh-gia/tap-the",
    exact: false,
    main: ({ history }) => <TapThe history={history} />,
  },
];

export default DanhGiaRoutes;
