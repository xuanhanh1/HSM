import { HubConnectionBuilder } from "@microsoft/signalr";
import {
  CHANGE_LANGUAGE,
  CONNECTION_SIGNALR,
  DESTROY_SESSION,
  LOGIN,
} from "../contants/actionTypes";
const initialState = {
  loginSuccess: undefined,
  language: "vi",
  connection: null,
};
// if (nhanVienInfor === null) {
//   initialState.connection = null;
// }
// else {
//   if (nhanVienInfor.LADONVINHAN === true) {
//     initialState.connection = new HubConnectionBuilder()
//       .withUrl("https://localhost:44312/Notification/UserNotiHub")
//       .withAutomaticReconnect()
//       .build()
//   }
// }
const UsersReducers = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      if (action.payload.result === true) {
        // const history = createBrowserHistory();
        // history.push("/");
        //const nhanVienInfor = JSON.parse(window.localStorage.getItem("infoNV"));
        const CONNECTION = new HubConnectionBuilder()
          .withUrl(`${window.BASE_URL}/Notification/UserNotiHub`)
          //.withAutomaticReconnect()
          .build();
        return {
          ...state,
          loginSuccess: action.payload.result,
          connection: CONNECTION,
        };
      }
      return {
        ...state,
        loginSuccess: action.payload.result,
        connection: null,
      };
    }
    case CONNECTION_SIGNALR:
      return {
        ...state,
        connection: action.connection,
      };
    case DESTROY_SESSION:
      return {
        ...state,
        loginSuccess: false,
      };
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };

    default:
      return state;
  }
};

export default UsersReducers;
