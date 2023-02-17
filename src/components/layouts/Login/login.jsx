import React, { useState, useEffect } from "react";
import "./index.css";
import {
  useLoading,
  logoTekmedi,
  useLocalStorage,
  callApi,
  Notification,
} from "../index";
import { useForm } from "react-hook-form";
import { Button, Spin, Dropdown, Menu, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getALLBenhViens } from "../../../redux/actions/BenhVien";
import { actLogin } from "../../../redux/actions/Users";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

//Menu Dropdown danh sách BenhViens
const menu = (data, setValue) => {
  return (
    <Menu onClick={(e) => setValue("BENHVIENID", e.key)}>
      {_.map(data, (item) => {
        return (
          <Menu.Item
            onClick={() =>
              setValue("BENHVIEN", `${item.MA_BV} - ${item.TEN_BV}`)
            }
            key={item.id}
          >{`${item.MA_BV} - ${item.TEN_BV}`}</Menu.Item>
        );
      })}
    </Menu>
  );
};

export default function Login(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = useForm();
  const lstBenhViens = useSelector(
    (state) => state.BenhVienReducers.lstBenhViens
  );
  const [isLoading, setLoading] = useLoading(lstBenhViens);
  //Chuyển đổi giao diện
  const [isForgot, setForgot] = useState(false);
  //Lưu xuống localStorage
  const [isSaveInfo, setSaveInfo] = useLocalStorage("luuTT", false);
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  //Lấy danh sách bệnh viện
  useEffect(() => {
    dispatch(getALLBenhViens());
  }, []);
  //Submit form
  const onSubmit = (data) => {
    if (isForgot) {
      //quên mật khẩu
      setLoading(true);
      const body = { Email: data.EMAIL };
      callApi(`api/AuthManagement/ForgotPassword`, "POST", JSON.stringify(body))
        .then((res) => {
          if (res.data.Result) {
            setLoading(false);
            Notification(
              "success",
              "Hệ thống đã gửi mail Reset password cho bạn.Bạn vui lòng kiểm tra email"
            );
          } else {
            setLoading(false);
            Notification("error", res.data.Errors[0]);
          }
        })
        .catch((err) => {
          setLoading(false);
          Notification(
            "error",
            "Email bạn nhập không phải kiểu email. Vui lòng kiểm tra lại"
          );
        });
    } else {
      //đăng nhập
      history.push("/");
      const BENHVIENID = _.some(lstBenhViens, (x) => x.id === data.BENHVIENID)
        ? data.BENHVIENID
        : "00000000-0000-0000-0000-000000000000";
      setSaveInfo(data.luuTT);
      setBenhVienId(BENHVIENID);
      const formatDataLogin = {
        Username: data.USERNAME,
        Password: data.PASSWORD,
        HospitalId: data.BENHVIENID,
      };

      dispatch(actLogin({ ...formatDataLogin, BENHVIENID }));
    }
  };
  return (
    <Spin spinning={isLoading} size="large">
      <div className="Login">
        <div className="bgTop">
          <div className="_boxTitle">
            <h1 style={{ fontWeight: 600 }}>Tek.HSM</h1>
            <h2 style={{ fontWeight: "normal", fontSize: 17 }}>
              Quản lý nhân sự và thanh toán cá nhân
            </h2>
          </div>
        </div>
        <div className="bgCenter">
          <div className="_boxLogin">
            {isForgot ? (
              <div className="forgot-form">
                <h1 style={{ fontWeight: 600 }}>Quên mật khẩu</h1>
                <p>
                  Liên kết đặt lại mật khẩu sẽ được gửi đến email của bạn để đặt
                  lại mật khẩu của bạn. Nếu bạn không nhận được email trong vòng
                  vài phút, vui lòng thử lại.
                </p>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                  <input
                    {...register("EMAIL", { required: true })}
                    placeholder="Địa chị email *"
                    style={{ height: 80 }}
                    autoComplete="off"
                    type="email"
                  />
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <Button onClick={() => setForgot(false)}>Trở về</Button>
                    </Col>
                    <Col span={6}>
                      <button type="submit" disabled={isLoading}>
                        Gửi đi
                      </button>
                    </Col>
                  </Row>
                </form>
              </div>
            ) : (
              <>
                <h1 style={{ fontWeight: 600 }}>Đăng nhập</h1>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                  <Dropdown overlay={menu(lstBenhViens, setValue)}>
                    <input
                      {...register("BENHVIEN")}
                      placeholder="Chọn bệnh viện"
                      autoComplete="off"
                    />
                  </Dropdown>
                  <input
                    {...register("USERNAME", { required: true })}
                    placeholder={t("TaiKhoan")}
                  />
                  <input
                    {...register("PASSWORD", { required: true })}
                    placeholder={t("MatKhau")}
                    type="password"
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "right",
                      alignItems: "center",
                    }}
                  >
                    <h4
                      className="forgotPassword"
                      style={{ fontWeight: 600 }}
                      onClick={() => setForgot(true)}
                    >
                      Quên mật khẩu?
                    </h4>
                  </div>
                  <button type="submit">{t("DangNhap")}</button>
                </form>
              </>
            )}
          </div>
        </div>
        <div className="bgBottom"></div>
      </div>
    </Spin>
  );
}

Login.propTypes = {};

Login.defaultProps = {};
