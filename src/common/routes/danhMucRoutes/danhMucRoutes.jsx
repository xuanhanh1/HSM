import ChucVuDanhMuc from "../../../components/layouts/DanhMuc/chucVuDanhMuc/chucVuDanhMuc";
import CongThucTNTT from "../../../components/layouts/DanhMuc/congThucTNTT/congThucTNTT";
import KhoaPhong from "../../../components/layouts/DanhMuc/khoaPhong/khoaPhong";
import PhuCapThuThuatPhauThuat from "../../../components/layouts/DanhMuc/phuCapThuThuatPhauThuat/phuCapThuThuatPhauThuat";

const danhMucRoutes = [
  {
    path: "/danh-muc/khoa-phong",
    exact: false,
    main: ({ history }) => <KhoaPhong history={history} />,
  },
  {
    path: "/danh-muc/chuc-vu",
    exact: false,
    main: ({ history }) => <ChucVuDanhMuc history={history} />,
  },

  {
    path: "/danh-muc/phu-cap-thu-thuat-phau-thuat",
    exact: false,
    main: ({ history }) => <PhuCapThuThuatPhauThuat history={history} />,
  },
  {
    path: "/danh-muc/cong-thuc-tinh-thu-nhap-tang",
    exact: false,
    main: ({ history }) => <CongThucTNTT history={history} />,
  },
];

export default danhMucRoutes;
