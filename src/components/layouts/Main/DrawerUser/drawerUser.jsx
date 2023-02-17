import React, { useEffect, useState } from "react";
import { Drawer, Button, Divider, Spin } from "antd";
import { useLocalStorage, Input, Notification, callApi } from "../../index";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { actLogout } from "../../../../redux/actions/Users";
import "./index.css";
import { useHistory } from "react-router-dom";
import openNotificationWithIcon from "../../../../common/notification/notification";
function DrawerUser(props) {
  const { isVisible, onClose } = props;
  const history = useHistory();
  const [isSaveInfo, setSaveInfo] = useLocalStorage("luuTT", false);
  const [inforNhanVien, setInforNhanVien] = useLocalStorage("infoNV", {});
  const [inforhocVien, setInforHocVien] = useLocalStorage("inforStudent", {});
  // console.log("🚀 ~ DrawerUser ~ inforhocVien", inforhocVien)
  const [isVisibleFormPassWord, setIsVisibleFormPassWord] = useState(false);
  const [isVisibleFormEmail, setIsVisibleFormEmail] = useState(false);
  const [resetPass, setResetPass] = useState(false);
  const [getPass, setGetPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(actLogout());
    setSaveInfo(false);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("benhVienId");
    window.localStorage.removeItem("infoNV");
    window.localStorage.removeItem("inforStudent");
    history.push("/login");
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    let nv = JSON.parse(window.localStorage.getItem("infoNV"));
    let hv = JSON.parse(window.localStorage.getItem("inforStudent"));
    setInforHocVien(hv);
    setInforNhanVien(nv);
  }, []);
  //Submit form
  // console.log(inforNhanVien);
  const onSubmit = (data) => {
    setIsLoading(true);
    if (data.NewPassword === data.ConfirmPassword) {
      const body = {
        OldPassword: data.OldPassword,
        NewPassword: data.NewPassword,
        ConfirmPassword: data.ConfirmPassword,
        Username: inforNhanVien.user_name,
      };
      // console.log(body);
      callApi(
        `api/AuthManagement/ChangePassword`,
        "POST",
        JSON.stringify(body)
      ).then((res) => {
        if (res.data.Result) {
          Notification(
            "success",
            "Bạn đã đổi password thành công. Vui lòng đăng nhập lại bằng mật khẩu mới."
          );
          setTimeout(() => {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("benhVienId");
            window.localStorage.removeItem("infoNV");
            window.location = "/login";
          }, 2000);
        } else {
          Notification("error", res.data.Errors[0]);
        }
        setIsLoading(false);
      });
    } else {
      Notification(
        "warning",
        "Mật khẩu mới và Xác nhận mật khẩu không trùng nhau."
      );
      setIsLoading(false);
    }
  };
  const onSubmitFormEmail = (data) => {
    setIsLoading(true);
    const body = {
      Username: inforNhanVien.user_name,
      Password: data.Password,
      NewEmail: data.NewEmail,
    };
    callApi(
      `api/AuthManagement/ChangeEmailConfirm`,
      "POST",
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.data.Result) {
          Notification(
            "success",
            "Bạn đã đổi email xác nhận tài khoản thành công."
          );
          window.localStorage.setItem(
            "infoNV",
            JSON.stringify(res.data.NhanVien)
          );
          setInforNhanVien(res.data.NhanVien);
          emptyForm();
          setValue("CurrentEmail", res.data.NhanVien.CONFIRMEMAIL);
        } else {
          Notification("error", res.data.Errors[0]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        Notification("error", "Có lỗi trong quá trình sửa. Vui lòng thử lại");
        setIsLoading(false);
      });
  };
  const emptyForm = () => {
    setValue("OldPassword", "");
    setValue("NewPassword", "");
    setValue("ConfirmPassword", "");

    setValue("CurrentEmail", "");
    setValue("Password", "");
    setValue("NewEmail", "");
  };
  const handleClickClose = () => {
    emptyForm();

    onClose(false);
    setIsVisibleFormPassWord(false);
    setIsVisibleFormEmail(false);
  };
  const handleClickChangePassword = () => {
    setIsVisibleFormPassWord(!isVisibleFormPassWord);
  };

  const handleClickChangeEmail = () => {
    setIsVisibleFormEmail(!isVisibleFormEmail);
    setValue("CurrentEmail", inforNhanVien.CONFIRMEMAIL);
  };
  const handleClickResetPassword = () => {
    setResetPass(true);
  };
  const HandleResetPass = () => {
    setGetPass(true);
    setResetPass(!resetPass);
  };
  return (
    <div>
      <Drawer
        placement="right"
        width={"350px"}
        visible={isVisible}
        onClose={handleClickClose}
        maskClosable={true}
      >
        <div className="inforUser">
          <div>
            <a>UserName: {inforNhanVien.name}</a>
            <h5>
              <b>Khoa/phòng:</b> {inforNhanVien.department_name}
            </h5>
            <h5>
              <b>Tên NV: </b> {inforNhanVien.name}
            </h5>
            <h5>
              <b>Chức vụ:</b> {inforNhanVien.position_name}
            </h5>
            <Button onClick={onLogout}>Đăng xuất</Button>
          </div>
        </div>
        <Divider />
        <div className="toolUserBar">
          <div>
            <div onClick={() => handleClickChangePassword()}>
              <a>Đổi mật khẩu</a>
              <p>Thay đổi mật khẩu tài khoản của bạn</p>
            </div>
          </div>
          <div>
            <div onClick={handleClickResetPassword}>
              <a>Quên mật khẩu</a>
              <p>Đặt lại mật khẩu tài khoản của bạn</p>
            </div>
          </div>
          <div>
            <div onClick={() => handleClickChangeEmail()}>
              <a>Đổi email xác nhận của tài khoản</a>
            </div>
          </div>
        </div>
        <Divider />
        {isVisibleFormPassWord ? (
          <Spin spinning={isLoading}>
            <form
              className="form"
              id="formChangePassword"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                type="password"
                label="MatKhauCu"
                name={register("OldPassword", { required: true })}
                required={true}
                errors={errors}
              />
              <Input
                type="password"
                label="MatKhauMoi"
                name={register("NewPassword", { required: true })}
                required={true}
                errors={errors}
              />
              <Input
                type="password"
                label="XacNhanMatKhau"
                name={register("ConfirmPassword", { required: true })}
                required={true}
                errors={errors}
              />
              <div className="text-center">
                <p style={{ fontSize: "12px", color: "lightgray" }}>
                  Khi thay đổi thành công. Bạn sẽ phải login lại.
                </p>
                <button
                  form="formChangePassword"
                  key="submit"
                  htmlType="submit"
                  className="btnSubmit"
                  style={{ marginTop: "5px" }}
                  disabled={isLoading}
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </Spin>
        ) : null}

        {isVisibleFormEmail ? (
          <Spin spinning={isLoading}>
            <form
              className="form"
              id="formChangeEmail"
              onSubmit={handleSubmit(onSubmitFormEmail)}
            >
              <Input
                type="text"
                label="EmailHienTai"
                name={register("CurrentEmail", { required: true })}
                disabled
              />
              <Input
                type="email"
                label="EmailMoi"
                name={register("NewEmail", { required: true })}
                required={true}
                errors={errors}
              />
              <Input
                type="password"
                label="MatKhau"
                name={register("Password", { required: true })}
                required={true}
                errors={errors}
              />
              <div className="text-center">
                <button
                  form="formChangeEmail"
                  key="submit"
                  htmlType="submit"
                  className="btnSubmit"
                  style={{ marginTop: "5px" }}
                  disabled={isLoading}
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </Spin>
        ) : null}
        {resetPass ? (
          <div>
            <Button type="primary" onClick={HandleResetPass}>
              Lấy mật khẩu
            </Button>
          </div>
        ) : (
          ""
        )}
        {getPass ? (
          <Input
            type="text"
            label="Mật khẩu reset"
            name={register("OldPassword", { required: true })}
            // required={true}
            errors={errors}
            disabled
          />
        ) : (
          ""
        )}
      </Drawer>
    </div>
  );
}

DrawerUser.propTypes = {};

export default DrawerUser;
