import BangChamCong from "../../../components/layouts/BaoCao/bangChamCong/bangChamCong";
import BaoCaoNhanSu from "../../../components/layouts/BaoCao/baoCaoNhanSu/baoCaoNhanSu";
import ThuNhapTangThem from "../../../components/layouts/BaoCao/thuNhapTangThem/thuNhapTangThem";
import TienLuongThang from "../../../components/layouts/BaoCao/tienLuongThang/tienLuongThang";
import BaoCaoLuongCoBan from "../../../components/layouts/BaoCao/BaoCaoLuongCoBan/baoCaoLuongCoBan";
import BaoCaoDacThu from "../../../components/layouts/BaoCao/BaoCaoDacThu/dacThu";
import ThuThuatPhauThuat from "../../../components/layouts/BaoCao/ThuThuatPhauThuat/thuThuatPhauThuat";
import TienThuThuatPhauThuat from "../../../components/layouts/BaoCao/ThuThuatPhauThuat/TienThuThuatPhauThuat";
import BaoCaoBaoHiem from "../../../components/layouts/BaoCao/baoCaoBaoHiem/BaoHiem";

const baoCaoRoutes = [
  {
    path: "/bao-cao/tien-luong-thang",
    exact: false,
    main: ({ history }) => <TienLuongThang history={history} />,
  },
  {
    path: "/bao-cao/bang-cham-cong",
    exact: false,
    main: ({ history }) => <BangChamCong history={history} />,
  },
  {
    path: "/bao-cao/bao-cao-nhan-su",
    exact: false,
    main: ({ history }) => <BaoCaoNhanSu history={history} />,
  },
  {
    path: "/bao-cao/thu-nhap-tang-them",
    exact: false,
    main: ({ history }) => <ThuNhapTangThem history={history} />,
  },
  {
    path: "/bao-cao/luong-co-ban",
    exact: false,
    main: ({ history }) => <BaoCaoLuongCoBan history={history} />,
  },
  {
    path: "/bao-cao/luong-dac-thu",
    exact: false,
    main: ({ history }) => <BaoCaoDacThu history={history} />,
  },
  {
    path: "/bao-cao/thu-thuat-phau-thuat",
    exact: false,
    main: ({ history }) => <ThuThuatPhauThuat history={history} />,
  },
  {
    path: "/bao-cao/tien-thu-thuat-phau-thuat",
    exact: false,
    main: ({ history }) => <TienThuThuatPhauThuat history={history} />,
  },
  {
    path: "/bao-cao/bao-hiem",
    exact: false,
    main: ({ history }) => <BaoCaoBaoHiem history={history} />,
  },
];

export default baoCaoRoutes;
