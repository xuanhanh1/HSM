import _ from "lodash";

import baoCaoRoutes from "./baoCaoRoutes/baoCaoRoutes";
import ChamCongRoutes from "./chamCongRoutes/chamCongRoutes";
import DanhGiaRoutes from "./danhGiaRoutes/danhGiaRoutes";
import danhMucRoutes from "./danhMucRoutes/danhMucRoutes";
import DaoTaoRoutes from "./daoTaoRoutes/daoTaoRoutes";
import nhanVienRoutes from "./nhanVienRoutes/nhanVienRoutes";
import quanTriRoutes from "./quanTriRoutes/quanTriRoutes";
import tinhLuongRoutes from "./tinhLuongRoutes/tinhLuongRoutes";
var routes = [];
const exportArrayToObject = (array) => {
  routes = _.concat(routes, array);
};
exportArrayToObject([
  ...baoCaoRoutes,
  ...danhMucRoutes,
  ...nhanVienRoutes,
  ...quanTriRoutes,
  ...DaoTaoRoutes,
  ...tinhLuongRoutes,
  ...DanhGiaRoutes,
  ...ChamCongRoutes,
]);

export default routes;
