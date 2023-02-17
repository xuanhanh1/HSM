import { GET_ALL_MENU, GET_MENU_BY_USER } from "../contants/actionTypes";
import _ from "lodash";
const initialState = {
  lstMenu: [],
  lstAllMenu: [],
  lstChildMenu: [],
};

const MenuReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_MENU:
      _.map(action.payload.value, (item) => {
        item.items = item.CHILDREN;
        item.expanded = true;
      });
      return {
        ...state,
        lstAllMenu: action.payload.value,
      };
    case GET_MENU_BY_USER:
      let arr = [];
      _.map(action.payload.value, (item) => {
        arr.push(...item.CHILDREN);
      });
      return {
        ...state,
        lstMenu: action.payload.value,
        lstChildMenu: arr,
      };
    default:
      return state;
  }
};

export default MenuReducers;
