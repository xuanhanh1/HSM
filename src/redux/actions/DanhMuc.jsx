import _ from "lodash";
import callApi from "../../config/configApi";
import * as types from "../contants/actionTypes";
import { Notification } from "../index";
//Khoa phòng
export const getALLDepartments =
  (rsData = false) =>
  (dispatch, getState) => {
    const lstKhoaPhong = getState().DanhMucReducers.lstDepartments;
    if (_.isEmpty(lstKhoaPhong) || rsData) {
      callApi("odata/Departments", "GET")
        .then((res) => {
          dispatch({
            type: types.GET_KHOAPHONG,
            payload: res.data.value,
          });
        })
        .catch((err) => {
          console.error(err);
          // console.log(err.response.data);
        });
    }
  };

export const createDepartments = (IDepartments) => (dispatch, getState) => {
  console.log(IDepartments);
  let result = callApi("odata/Departments", "POST", IDepartments)
    .then((res) => {
      console.log(res);
      Notification("success", "Thêm mới khoa phòng thành công !");
      dispatch(getALLDepartments());
      return true;
    })
    .catch((err) => {
      console.log(err);
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};
export const createTypesDepartment = (ILstTypes) => (dispatch, getState) => {
  let result = callApi(
    `odata/TypeMedicalSupplies/AddTypeDepartment?DepartmentId=${ILstTypes.Id}`,
    "POST",
    ILstTypes.LstTypes
  )
    .then((res) => {
      Notification("success", "Cập nhật loại khoa/phòng thành công !");
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};
export const editDepartments = (IDepartments) => (dispatch, getState) => {
  callApi(`odata/Departments?key=${IDepartments.Id}`, "PUT", IDepartments)
    .then((res) => {
      Notification("success", "Sửa khoa phòng thành công !");
      //dispatch(getALLDepartments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.errors[0]);
    });
};

export const deleteDepartments = (ID) => (dispatch, getState) => {
  callApi(`odata/Departments?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa khoa phòng thành công !");
      //dispatch(getALLDepartments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa khoa phòng thất bại !");
    });
};
//Nhân viên
export const getALLNhanViens = () => (dispatch, getState) => {
  callApi("odata/Staffs", "GET")
    .then((res) => {
      // dispatch(getALLDepartments());
      // dispatch(getALLPositions());
      dispatch({
        type: types.GET_NHANVIEN,
        payload: res.data.value,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
//get nhân viên trong danh mục => trừ nv của tài khoản đang đăng nhập ra
export const getALLNhanVienInDanhMuc =
  (NhanVien_Id) => (dispatch, getState) => {
    callApi(`odata/Staffs?$filter=Id ne ${NhanVien_Id}`, "GET")
      .then((res) => {
        dispatch(getALLDepartments());
        dispatch(getALLPositions());
        dispatch({
          type: types.GET_NHANVIEN,
          payload: res.data.value,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
export const createNhanVienForID = (INhanViens) => (dispatch, getState) => {
  let result = callApi("odata/Staffs", "POST", {
    ...INhanViens,
    hospital_id: INhanViens.HospitalId,
  })
    .then((res) => {
      //add student
      // dispatch(
      //   addStudent({
      //     staff_id: res.data.id,
      //     is_using: true,
      //   })
      // );
      dispatch(updateUserRole(INhanViens));
      //return staff_id
      return res.data.id;
    })
    .catch((err) => {
      console.log(err.response);
      Notification("error", err.response?.data.errors[0]);
      return false;
    });
  return result;
};

export const editNhanViens = (INhanViens) => (dispatch, getState) => {
  const data = {
    code: INhanViens.code,
    number_sign: INhanViens.number_sign,
    name: INhanViens.name,
    contact: INhanViens.contact,
    position_id: INhanViens.position_id,
    department_id: INhanViens.department_id,
    user_id: INhanViens.user_id,
    hospital_id: INhanViens.hospital_id,
    codekt: INhanViens.codekt,
    codehis: INhanViens.codehis,
  };
  callApi(`odata/Staffs?key=${INhanViens.id}`, "PUT", data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.errors[0]);
    });
};

export const deleteNhanViens = (ID) => (dispatch, getState) => {
  callApi(`odata/Staffs?key=${ID}`, "DELETE")
    .then((res) => {
      dispatch(getALLNhanVienInDanhMuc(ID));
      Notification("success", "Xóa nhân viên thành công !");
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa nhân viên thất bại !");
    });
};

export const createStaffInfor = (staff) => (dispatch, getState) => {
  console.log(staff);
  let result = callApi("odata/StaffInfors", "POST", staff)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response);
      Notification("error", err.response?.data.errors[0]);
      return false;
    });
  return result;
};
export const EditStaffInfor = (staff) => (dispatch, getState) => {
  console.log(`odata/StaffInfors?key=${staff.staff_infor_id}`);
  console.log("edit staff", staff);
  let result = callApi(
    `odata/StaffInfors?key=${staff.staff_infor_id}`,
    "PUT",
    staff
  )
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response);
      Notification("error", err.response?.data.errors[0]);
      return false;
    });
  return result;
};
export const createBanks = (IBanks) => (dispatch, getState) => {
  let result = callApi("odata/BankSuppliers", "POST", IBanks)
    .then((res) => {
      Notification("success", "Thêm mới tài khoản thành công !");
      return true;
    })
    .catch((err) => {
      if (err.response?.data) {
        Notification("error", err.response?.data.Errors);
      }
      return false;
    });
  return result;
};

export const editBanks = (IBanks) => (dispatch, getState) => {
  let result = callApi(`odata/BankSuppliers?key=${IBanks.Id}`, "PUT", IBanks)
    .then((res) => {
      Notification("success", "Sửa tài khoản thành công !");
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};

export const deleteBanks = (ID) => (dispatch, getState) => {
  let result = callApi(`odata/BankSuppliers?banksupplier_id=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa tài khoản thành công !");
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};

export const getLstNhanVienByKhoaPhongID = (ID) => (dispatch, getState) => {
  callApi(`odata/Staffs?$filter=KHOAPHONGID eq ${ID}`, "GET")
    .then((res) => {
      dispatch({
        type: types.GET_NHANVIEN_BY_KHOAPHONGID,
        payload: res.data.value,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

//Chức vụ
export const getALLPositions = () => (dispatch, getState) => {
  callApi("odata/Positions", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_CHUCVU,
        payload: res.data.value,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
export const createPositions = (IPositions) => (dispatch, getState) => {
  console.log(IPositions);
  let result = callApi("odata/Positions", "POST", IPositions)
    .then((res) => {
      Notification("success", "Thêm mới chức vụ thành công !");
      dispatch(getALLPositions());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response?.data.errors[0]);
      return false;
    });
  return result;
};

export const editPositions = (IPositions) => (dispatch, getState) => {
  let result = callApi(
    `odata/Positions?key=${IPositions.id}`,
    "PUT",
    IPositions
  )
    .then((res) => {
      Notification("success", "Sửa chức vụ thành công !");
      dispatch(getALLPositions());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response?.data.errors[0]);
      return false;
    });
  return result;
};

export const deletePositions = (ID) => (dispatch, getState) => {
  callApi(`odata/Positions?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa chức vụ thành công !");
      dispatch(getALLPositions());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa chức vụ thất bại !");
    });
};

export const updateUserRole = (IUser) => (dispatch, getState) => {
  let result = callApi(
    `odata/Roles/UpdateUserRole?UserId=${IUser.user_id}`,
    "POST",
    IUser.lstRoles
  )
    .then((response) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const AddTimesheetsCoeffs = (data) => (dispatch, getState) => {
  let result = callApi(`odata/TimesheetsCoeffs`, "POST", data)
    .then((response) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};

export const EditTimesheetsCoeffs = (data) => (dispatch, getState) => {
  let result = callApi(`odata/TimesheetsCoeffs?key=${data.id}`, "PUT", data)
    .then((response) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};
export const DeleteTimesheetsCoeffs = (ID) => (dispatch, getState) => {
  let result = callApi(`odata/TimesheetsCoeffs?key=${ID}`, "DELETE")
    .then((response) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      console.log(err.response);
      return false;
    });
  return result;
};

export const createStandardTimes = (data) => (dispatch, getState) => {
  let result = callApi(`odata/StandardTimes`, "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};
export const EditStandardTimes = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/StandardTimes?key=${data.idEdit}`, "PUT", data)
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};

export const deleteStandardTimes = (ID) => (dispatch, getState) => {
  callApi(`odata/StandardTimes?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa ngày tính công thành công !");
      //dispatch(getALLDepartments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa ngày tính công thất bại !");
    });
};

export const createSurgeryBenefits = (data) => (dispatch, getState) => {
  let result = callApi(`odata/SurgeryBenefits`, "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};
export const EditSurgeryBenefits = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/SurgeryBenefits?key=${data.idEdit}`, "PUT", data)
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};

export const deleteSurgeryBenefits = (ID) => (dispatch, getState) => {
  callApi(`odata/SurgeryBenefits?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa đặc thù thành công !");
      //dispatch(getALLDepartments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa đặc thù thất bại !");
    });
};

export const createExtraSalaryTypes = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/ExtraSalaryTypes`, "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};
export const EditExtraSalaryTypes = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/ExtraSalaryTypes?key=${data.id}`, "PUT", data)
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};

export const deleteExtraSalaryTypes = (ID) => (dispatch, getState) => {
  callApi(`odata/SurgeryBenefits?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa công thức tính TNTT thành công !");
      //dispatch(getALLDepartments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa công thức tính TNTT thất bại !");
    });
};
export const AddExtraSalarys = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/AddExtraSalarys`, "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};

export const AddExtraSalaryFormulas = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/ExtraSalaryFormulas`, "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.errors[0]);
      return false;
    });
  return result;
};
