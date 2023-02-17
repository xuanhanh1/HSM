import * as types from "../contants/actionTypes";

const initialState = {
  lstQuestions: [],
  lstTrannings: [],
  lstStudents: [],
  lstTests: [],
};

const TaiLieuReducer = (state = initialState, action) => {
  // console.log("🚀 ~ TaiLieuReducer ~ action", action)
  switch (action.type) {
    case types.GET_ALL_QUESTIONS:
      return {
        ...state,
        lstQuestions: action.payload,
      };
    case types.GET_ALL_TRANNINGS:
      // console.log("action payload", action.payload);
      return {
        ...state,
        lstTrannings: action.payload,
      };
    case types.GET_ALL_STUDENTS:
      return {
        ...state,
        lstStudents: action.payload,
      };
    case types.GET_ALL_TESTS:
      return {
        ...state,
        lstTests: action.payload,
      };

    default:
      return state;
  }
};

export default TaiLieuReducer;
