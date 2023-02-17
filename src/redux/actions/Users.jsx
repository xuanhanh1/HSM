import callApi from "../../config/configApi";
import * as types from "../contants/actionTypes";
import { Notification } from "../index";
import { createNhanVienForID } from "./DanhMuc";
import { getAllMenus } from "./Menu";

export const actLogin = (IUser) => (dispatch, getState) => {
  console.log(IUser);
  callApi("api/AuthManagement/Login", "POST", IUser)
    .then((res) => {
      if (res.data.result) {
        window.localStorage.setItem("token", JSON.stringify(res.data.token));
        window.localStorage.setItem(
          "infoNV",
          JSON.stringify(res.data.nhanVien)
        );
        // console.log("data login ", res.data.nhanVien);
        // get infor student
        callApi(`odata/Students?staff_id=${res.data.id}`, "GET").then((res) => {
          // console.log("data students", res.data[0])
          if (res.data.length > 0) {
            window.localStorage.setItem(
              "inforStudent",
              JSON.stringify(res.data[0])
            );
          }
        });
        //Notification("success", "Đăng nhập thành công !");
        dispatch(getAllMenus());
        dispatch({
          type: types.LOGIN,
          payload: res.data,
        });
      } else {
        const data = res.data;
        Notification("error", data.errors);
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.response?.data) {
        let obj = err.response?.data;
        Notification("error", obj.errors[0]);
      }
    });
};

export const actRegister = (IUser) => async (dispatch, getState) => {
  let result = await callApi("api/AuthManagement/Register", "POST", IUser)
    .then((res) => {
      if (!res.data.result) {
        Notification("error", res.data?.errors[0]);
        return false;
      } else {
        // //đăng kí nhân viên
        const result = dispatch(
          createNhanVienForID({ ...IUser, user_id: res.data.taiKhoanId })
        );
        return result;
      }
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response?.data) {
        let obj = error.response?.data;
        Notification("error", obj.errors[0]);
      }
      return false;
    });
  return result;
};

export const setStatusLoginWithToken = (status, token, isNV) => {
  return {
    type: types.LOGIN,
    payload: { Result: status, Token: token, NhanVien: isNV },
  };
};

export const actLogout = () => {
  Notification("success", "Đăng xuất thành công !");
  return {
    type: types.DESTROY_SESSION,
  };
};

//Thay đổi ngôn ngữ ứng dụng
export const changeLanguage = (language) => {
  return {
    type: types.CHANGE_LANGUAGE,
    language,
  };
};

export const connectionSignalR = (connection) => {
  return {
    type: types.CONNECTION_SIGNALR,
    connection,
  };
};
export const addStudent = (student) => (dispatch, getState) => {
  let result = callApi("odata/Students", "POST", student)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};

export const addForeignLanguage = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi("odata/ForeignLanguages", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};

export const addComputing = (data) => (dispatch, getState) => {
  let result = callApi("odata/Computings", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddAllowances = (data) => (dispatch, getState) => {
  let result = callApi("odata/Allowances", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response);
      Notification("error", err.response.data?.errors[0]);
      return false;
    });
  return result;
};
export const AddFamilyRelationships = (data) => (dispatch, getState) => {
  let result = callApi("odata/FamilyRelationships", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddDiscipline = (data) => (dispatch, getState) => {
  let result = callApi("odata/Disciplines", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddStaffPlannings = (data) => (dispatch, getState) => {
  let result = callApi("odata/StaffPlannings", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddEmulationRewards = (data) => (dispatch, getState) => {
  let result = callApi("odata/EmulationRewards", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddPartyGovernments = (data) => (dispatch, getState) => {
  let result = callApi("odata/PartyGovernments", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddPoliticalTheorys = (data) => (dispatch, getState) => {
  let result = callApi("odata/PoliticalTheorys", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddStateManagements = (data) => (dispatch, getState) => {
  let result = callApi("odata/StateManagements", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddNationalSecuritys = (data) => (dispatch, getState) => {
  let result = callApi("odata/NationalSecuritys", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddAcademicTitles = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi("odata/AcademicTitles", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddAnnualReviews = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi("odata/AnnualReviews", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddEthnicLanguages = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi("odata/EthnicLanguages", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddSalaryInfors = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi("odata/SalaryInfors", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response);
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};
export const AddWorkingProcesss = (data) => (dispatch, getState) => {
  let result = callApi("odata/WorkingProcesss", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response);
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};
export const AddEducates = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi("odata/Educates", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddBuildings = (data) => (dispatch, getState) => {
  let result = callApi("odata/Buildings", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddImmovables = (data) => (dispatch, getState) => {
  let result = callApi("odata/Immovables", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddMovables = (data) => (dispatch, getState) => {
  let result = callApi("odata/Movables", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddLaborContracts = (data) => (dispatch, getState) => {
  let result = callApi("odata/LaborContracts", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};

export const AddPracticingCertificates = (data) => (dispatch, getState) => {
  let result = callApi("odata/PracticingCertificates", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddCultivates = (data) => (dispatch, getState) => {
  let result = callApi("odata/Cultivates", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
//edit
export const EditForeignLanguage = (data) => (dispatch, getState) => {
  let result = callApi(`odata/ForeignLanguages?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};

export const EditComputing = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Computings?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditAllowances = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Allowances?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response);
      Notification("error", err.response.data?.errors[0]);
      return false;
    });
  return result;
};
export const EditFamilyRelationships = (data) => (dispatch, getState) => {
  let result = callApi(`odata/FamilyRelationships?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditDiscipline = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Disciplines?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditStaffPlannings = (data) => (dispatch, getState) => {
  let result = callApi(`odata/StaffPlannings?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditEmulationRewards = (data) => (dispatch, getState) => {
  let result = callApi(`odata/EmulationRewards?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditPartyGovernments = (data) => (dispatch, getState) => {
  let result = callApi(`odata/PartyGovernments?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditPoliticalTheorys = (data) => (dispatch, getState) => {
  let result = callApi(`odata/PoliticalTheorys?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditStateManagements = (data) => (dispatch, getState) => {
  let result = callApi(`odata/StateManagements?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditNationalSecuritys = (data) => (dispatch, getState) => {
  let result = callApi(`odata/NationalSecuritys?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditAcademicTitles = (data) => (dispatch, getState) => {
  let result = callApi(`odata/AcademicTitles?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditAnnualReviews = (data) => (dispatch, getState) => {
  let result = callApi(`odata/AnnualReviews?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditEthnicLanguages = (data) => (dispatch, getState) => {
  let result = callApi(`odata/EthnicLanguages?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditSalaryInfors = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/SalaryInfors?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditWorkingProcesss = (data) => (dispatch, getState) => {
  let result = callApi(`odata/WorkingProcesss?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditEducates = (data) => (dispatch, getState) => {
  console.log(data);
  console.log(`odata/Educates?key=${data.id}`);
  let result = callApi(`odata/Educates?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditBuildings = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Buildings?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditImmovables = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Immovables?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditMovables = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Movables?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditLaborContracts = (data) => (dispatch, getState) => {
  let result = callApi(`odata/LaborContracts?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditPracticingCertificates = (data) => (dispatch, getState) => {
  let result = callApi(
    `odata/PracticingCertificates?key=${data.id}`,
    "PUT",
    data
  )
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditCultivates = (data) => (dispatch, getState) => {
  let result = callApi(`odata/Cultivates?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};

export const AddStaffTypes = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/StaffTypes`, "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const EditStaffTypes = (data) => (dispatch, getState) => {
  let result = callApi(`odata/StaffTypes?key=${data.idEdit}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};

export const DeleteStaffTypes = (ID) => (dispatch, getState) => {
  callApi(`odata/StaffTypes?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa loại nhân viên thành công !");
      //dispatch(getALLDepartments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa loại nhân viên thất bại !");
    });
};
