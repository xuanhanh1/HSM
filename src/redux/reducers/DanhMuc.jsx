import {
  GET_KHOAPHONG,
  GET_NHANVIEN,
  GET_CHUCVU,
  GET_NHANVIEN_BY_KHOAPHONGID,
} from "../contants/actionTypes";
import _ from "lodash";
import callApi from "../../config/configApi";
const initialState = {
  lstKhoaPhongs: [],
  lstDonViNhanKP: [],
  lstNhanViens: [],
  lstPositions: [],
  lstNhanViensByKhoaPhong: [],
};

const arr = [];
callApi("odata/AvailableCatalogs/StaffStatuss").then((res) => {
  arr.push(...res.data);
});

const DanhMucReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_KHOAPHONG:
      return {
        ...state,
        lstKhoaPhongs: action.payload,
      };
    case GET_NHANVIEN:
      const userLogin = JSON.parse(localStorage.getItem("infoNV"));
      const newLst = action.payload.filter((item) => {
        if (item.id !== userLogin.id) {
          return item;
        }
      });
      return {
        ...state,
        lstNhanViens:
          userLogin.id === "f6f32d6f-8384-4fe4-ae12-aeb700b0b464"
            ? action.payload
            : newLst,
      };
    case GET_CHUCVU:
      return {
        ...state,
        lstPositions: action.payload,
      };

    case GET_NHANVIEN_BY_KHOAPHONGID:
      return {
        ...state,
        lstNhanViensByKhoaPhong: action.payload,
      };
    default:
      return state;
  }
};

export default DanhMucReducers;
