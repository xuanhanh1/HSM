import Luong from "../../../components/layouts/TinhLuong/bangLuong/Luong";
import BangLuongCoBan from "../../../components/layouts/TinhLuong/bangLuongCoBan/bangLuongCoBan";
import BaoHiem from "../../../components/layouts/TinhLuong/baoHiem/baoHiem";

import LuongCoBan from "../../../components/layouts/TinhLuong/luongCoBan/luongCoBan";
import NghiPhep from "../../../components/layouts/TinhLuong/nghiPhep/nghiPhep";
import PhuCapDacThu from "../../../components/layouts/TinhLuong/phuCapDacThu/phuCapDacThu";
import ThuNhapTangThem from "../../../components/layouts/TinhLuong/thuNhapTangThem/thuNhapTangThem";
import ThuThuatPhauThuat from "../../../components/layouts/TinhLuong/thuThuatPhauThuat/thuThuatPhauThuat";
import TienLamThemGio from "../../../components/layouts/TinhLuong/tienLamThemGio/tienLamThemGio";
import TienTruc from "../../../components/layouts/TinhLuong/tienTruc/tienTruc";
import ThueThuNhapCaNhan from "../../../components/layouts/TinhLuong/thueThuNhapCaNhan/thueThuNhapCaNhan";

const tinhLuongRoutes = [
  {
    path: "/tinh-luong/luong",
    exact: false,
    main: ({ history }) => <Luong history={history} />,
  },
  {
    path: "/tinh-luong/bao-hiem",
    exact: false,
    main: ({ history }) => <BaoHiem history={history} />,
  },
  {
    path: "/tinh-luong/nghi-phep",
    exact: false,
    main: ({ history }) => <NghiPhep history={history} />,
  },
  {
    path: "/tinh-luong/luong-co-ban",
    exact: false,
    main: ({ history }) => <LuongCoBan history={history} />,
  },
  {
    path: "/tinh-luong/thu-nhap-tang-them",
    exact: false,
    main: ({ history }) => <ThuNhapTangThem history={history} />,
  },
  {
    path: "/tinh-luong/thu-thuat-phau-thuat",
    exact: false,
    main: ({ history }) => <ThuThuatPhauThuat history={history} />,
  },
  {
    path: "/tinh-luong/tien-truc",
    exact: false,
    main: ({ history }) => <TienTruc history={history} />,
  },
  {
    path: "/tinh-luong/luong-truc",
    exact: false,
    main: ({ history }) => <TienLamThemGio history={history} />,
  },
  {
    path: "/tinh-luong/phu-cap-dac-thu",
    exact: false,
    main: ({ history }) => <PhuCapDacThu history={history} />,
  },
  {
    path: "/tinh-luong/bang-luong-co-ban",
    exact: false,
    main: ({ history }) => <BangLuongCoBan history={history} />,
  },
  {
    path: "/tinh-luong/thue-thu-nhap",
    exact: false,
    main: ({ history }) => <ThueThuNhapCaNhan history={history} />,
  },
];

export default tinhLuongRoutes;
