import callApi from "../../config/configApi";
import * as types from "../contants/actionTypes";
import { Notification } from "../index";

//push tài liệu
export const uploadTaiLieu = (data, setVisible) => (dispatch, getState) => {
  const newData = {
    create_date: data.CreateDate,
    name: data.ten_tl,
    content: data.content,
    creator_id: data.creator_id,
    document_level_id: data.level,
    training_id: data.KHOAHOCID,
    note: data.note,
  };

  let result = callApi(`odata/Documents`, "POST", newData)
    .then((res) => {
      const upload = { document_id: res.data.id, fd: data.fd };
      dispatch(uploadFile(upload));
      if (data.dataCH && data.dataCH.length > 0) {
        data.dataCH.forEach(async (data, index) => {
          await dispatch(uploadQuestion({ ...data, document_id: res.data.id }));
        });
      } else {
      }
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};
export const editTaiLieu = (data) => (dispatch, getState) => {
  console.log("🚀 ~ editTaiLieu ~ data", data);
  let dataEdit = {
    // create_date:  data.create_date,
    name: data.ten_tl,
    content: data.content,
    note: data.note,
    creator_id: data.creator_id,
    document_type_id: "f6242438-843a-49b8-a114-adba007ae42f",
    document_level_id: data.document_level_id,
    test_id: "",
    training_id: "",
  };

  let result = callApi(`odata/Documents?key=${data.id}`, "PUT", dataEdit)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log("err ", err);
      return false;
    });
  return result;
};
export const deleteTaiLieu = (id) => {
  let result = callApi(`odata/Documents?key=${id}`, "DELETE")
    .then((res) => {
      Notification("Success", "Xóa tài liệu thành công !");
      return true;
    })
    .catch((err) => {
      // Notification("error", err.response.data.Error[0])
      Notification("Error", "Xóa tài liệu không thành công");
      return false;
    });
  return result;
};
export const uploadFile = (ILISTFILE) => (dispatch, getState) => {
  let result = callApi(
    `api/FileUpload/SafeUpload_DocumentFile?document_id=${ILISTFILE.document_id}`,
    "POST",
    ILISTFILE.fd,
    "multipart/form-data"
  )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("err upload file", err.response.data);
      return false;
    });
  return result;
};
export const uploadDocumentFile = (ILISTFILE) => (dispatch, getState) => {
  console.log("🚀 ~ uploadDocumentFile ~ ILISTFILE", ILISTFILE);
  let result = callApi(
    `/odata/DocumentFiles`,
    "POST",
    [ILISTFILE.fd],
    "multipart/form-data"
  )
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};

//get questions
export const getAllQuestions = () => (dispatch, getState) => {
  callApi("odata/Questions", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_QUESTIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
export const uploadQuestion = (data) => (dispatch, getState) => {
  console.log("🚀 ~ uploadQuestion ~ data", data);
  let result = callApi("odata/Questions", "POST", data)
    .then((res) => {
      console.log("upload câu hỏi thành công");
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};
export const editQuestion = (data) => (dispatch, getState) => {
  console.log("🚀 ~ editQuestion ~ data", data);
  let result = callApi(`odata/Questions?key=${data.id}`, "PUT", data)
    .then((res) => {
      console.log("🚀 ~ .then ~ res", res);
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};
export const deleteQuestion = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Questions?key=${data}`, "DELETE")
    .then((res) => {
      dispatch(getAllQuestions());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};

//get tranning
export const getAllTranning = () => (dispatch, getState) => {
  callApi("odata/Trainings", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_TRANNINGS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
export const createTrainning = (data) => (dispatch, getState) => {
  console.log("🚀 ~ createTrainning ~ data", data);
  let result = callApi("odata/Trainings", "POST", data)
    .then((res) => {
      console.log(res.data);
      // dispatch(uploadTaiLieu({ ...data, training_id: res.data.id }))
      // if (data.pickStudents && data.pickStudents.length > 0) {
      //   let result2 = callApi(`odata/Tranings?${res.data.id}`, "PUT", data.pickStudents)
      //     .then((res) => {
      //       console.log(res.data);
      //       return true;
      //     })
      //     .catch((err) => console.log(err))
      // } else {
      //   return true
      // }
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};
export const editTrainning = (data) => (dispatch, getState) => {
  console.log("🚀 ~ editQuestion ~ data", data);
  let result = callApi(`odata/Training?key=${data.id}`, "PUT", data)
    .then((res) => {
      console.log("🚀 ~ .then ~ res", res);
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};

// get test
export const getAllTest = () => (dispatch, getState) => {
  callApi("odata/Tests", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_TESTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const createTest = (data) => (dispatch, getState) => {
  console.log("🚀 ~ createTrainning ~ data", data);
  let result = callApi("odata/Tests", "POST", data)
    .then((res) => {
      console.log(res.data);
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};

//GET ALL STUDENT
export const getAllStudents = () => (dispatch, getState) => {
  callApi("odata/Students", "GET").then((res) => {
    dispatch({
      type: types.GET_ALL_STUDENTS,
      payload: res.data,
    }).catch((err) => {
      console.log("err fc getAllStudents", err.response.data);
    });
  });
};
// put học viên
export const updateStudents = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Tranings?${data.id}`, "PUT", data.pickStudents)
    .then((res) => {
      // console.log(res.data);
      Notification("success", "Thêm học viên thành công");
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
  return result;
};
