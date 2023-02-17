import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";

export const getAllMenus = () => (dispatch, getState) => {
  callApi("odata/menus/getall?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_MENU,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const getMenusByUser = () => (dispatch, getState) => {
  callApi("odata/menus?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_MENU_BY_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
