import { combineReducers } from "redux";
import * as types from "../contants/actionTypes";
import BenhVienReducers from "./BenhVien";
import DanhMucReducers from "./DanhMuc";
import MenuReducers from "./Menu";
import QuanTriReducers from "./QuanTri";
import TaiLieuReducer from "./TaiLieu";
import UsersReducers from "./Users";

const appReducer = combineReducers({
  BenhVienReducers,
  MenuReducers,
  UsersReducers,
  DanhMucReducers,
  QuanTriReducers,
  TaiLieuReducer,
});

const rootReducer = (state, action) => {
  //Clear all data in redux store to initial.
  if (action.type === types.DESTROY_SESSION) state = undefined;
  return appReducer(state, action);
};

export default rootReducer;
