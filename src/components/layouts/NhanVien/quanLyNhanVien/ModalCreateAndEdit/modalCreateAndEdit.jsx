import { Col, Divider, Modal, Radio, Row, Space, Spin, Tabs } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
// import { editNhanViens } from "../../../../../redux/actions/DanhMuc";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import {
  createStaffInfor,
  editNhanViens,
  EditStaffInfor,
} from "../../../../../redux/actions/DanhMuc";
import {
  getAllRoles,
  updUserRoles,
} from "../../../../../redux/actions/QuanTri";
import { actRegister } from "../../../../../redux/actions/Users";

import {
  callApi,
  DatePicker,
  Input,
  moment,
  Notification,
  Select,
  TextArea,
  useLocalStorage,
  _,
} from "../../../index";
import ThongTinLuong from "./thongTinLuong/thongTinLuong";

import ChucVuDang from "./dangDoanChinhQuyen/chucVuDang";
import DaoTaoBoiDuong from "./daoTaoBoiDuong/daoTaoBoiDuong";
import QuaTrinhNVCongTac from "./quaTrinhCongTac/quaTrinhNVCongTac";
import ThiDuaKhenThuong from "./thiDuaKhenThuong/thiDuaKhenThuong";

import ChungChiHanhNghe from "./chungChiHanhNghe/chungChiHanhNghe";
import DaoTaoChuyenMon from "./daoTaoChuyenMon/daoTaoChuyenMon";
import ThongTinKyLuat from "./kyLuat/thongTinKyLuat";
import NgoaiNgu from "./ngoaiNguTinHoc/ngoaiNgu";
import TinHoc from "./ngoaiNguTinHoc/tinHoc";
import PhuCap from "./phuCap/phuCap";
import QuanHeGiaDinh from "./quanHeGiaDinh/quanHeGiaDinh";
import QuyHoachCanBo from "./quyHoachCanBo/quyHoachCanBo";
import ThongTinHopDong from "./thongTinHopDong/thongTinHopDong";
import ChinhTri from "./liLuanChinhTri/chinhTri/chinhTri";
import QuanLyNhaNuoc from "./liLuanChinhTri/quanLyNhaNuoc/quanLyNhaNuoc";
import AnNinhQuocPhong from "./liLuanChinhTri/anNinhQuocPhong/anNinhQuocPhong";
import ChucDanh from "./chucDanh/chucDanhKhoaHoc/chucDanh";
import DanToc from "./chucDanh/danToc/danToc";
import DanhGiaCanBoHangNam from "./chucDanh/danhGiaCanBo/danhGiaCanBo";
import NhaOCongTrinh from "./keKhaiTaiSan/nhaOCongTrinh/nhaO";
import QuyenSuDungDat from "./keKhaiTaiSan/QuyenSuDungDat/quyenSuDungDat";
import TaiSanKhac from "./keKhaiTaiSan/taiSanKhac/taiSanKhac";
const checkPlace = (a, b, c) => {
  if (a) {
    if (b) {
      if (c) {
        return c;
      } else {
        return b;
      }
    } else {
      return a;
    }
  }
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  preview: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
  },
  image: { maxWidth: "100%", maxHeight: 150, objectFit: "contain" },
  delete: {
    cursor: "pointer",
    padding: 4,
    background: "red",
    color: "white",
    border: "none",
  },
};
const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  const lstRoles = useSelector((state) => state.QuanTriReducers.lstRoles);
  const [staffId, setStaffId] = useState("");
  const [isLstPickRoles, setLstPickRoles] = useState([{ NAME: "Nh??n vi??n" }]);
  const [lstKhoaPhong, setLstKhoaPhong] = useState([]);
  const [lstChucVu, setLstChucVu] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [show, setShow] = useState(false);
  const [dataShow, setDataShow] = useState(null);
  const [valueRole, setValueRole] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  //get roles
  useEffect(() => {
    console.log("re-render");
    dispatch(getAllRoles());
    if (isStatus === 1) {
      if (_.isEmpty(lstRoles)) {
        dispatch(getAllRoles());
      } else {
        callApi(`odata/Roles/GetRolesOfUser?UserId=${objEdit.user_id}`, "GET")
          .then((res) => {
            console.log(res.data.value);
            console.log(lstRoles);
            if (lstRoles.length > 0 && res.data.value.length > 0) {
              const IdRoleEdit =
                lstRoles &&
                lstRoles.filter((item) => {
                  if (res.data.value[0] === item.NAME) {
                    console.log(item);
                    setValueRole(item.Id);
                    setLstPickRoles({ NAME: item.NAME });
                  }
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [_.isEmpty(lstRoles)]);
  useEffect(() => {
    //edit ph???i format date time tr?????c
    if (isStatus === 1) {
      objEdit.start_date = moment(objEdit.start_date);
      objEdit.NGAYSINH = moment(objEdit.NGAYSINH);
      objEdit.official_date = moment(objEdit.official_date);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  useEffect(() => {
    callApi("odata/Departments", "GET").then((res) => {
      setLstKhoaPhong(res.data.value);
    });
  }, []);
  useEffect(() => {
    callApi("odata/Positions", "GET").then((res) => {
      setLstChucVu(res.data.value);
    });
  }, []);
  //get info
  useEffect(() => {
    if (isStatus === 1) {
      setLoadingEdit(true);
      callApi(`odata/StaffInfors?$filter=staff_id eq ${objEdit.id}`, "GET")
        .then((res) => {
          console.log(res);
          if (res.data.value.length > 0) {
            const result = res.data.value[0];
            result.date_of_birth = _.isNull(result.date_of_birth)
              ? null
              : moment(result.date_of_birth);
            result.date_of_issue = _.isNull(result.date_of_issue)
              ? null
              : moment(result.date_of_issue);
            result.recruited_date = _.isNull(result.recruited_date)
              ? null
              : moment(result.recruited_date);
            result.offical_recruited_date = _.isNull(
              result.offical_recruited_date
            )
              ? null
              : moment(result.offical_recruited_date);
            result.party_date = _.isNull(result.party_date)
              ? null
              : moment(result.party_date);
            result.offical_party_date = _.isNull(result.offical_party_date)
              ? null
              : moment(result.offical_party_date);
            result.enlistment_date = _.isNull(result.enlistment_date)
              ? null
              : moment(result.enlistment_date);
            result.demobilization_date = _.isNull(result.demobilization_date)
              ? null
              : moment(result.demobilization_date);
            result.retire_date = _.isNull(result.retire_date)
              ? null
              : moment(result.retire_date);
            result.quit_date = _.isNull(result.quit_date)
              ? null
              : moment(result.quit_date);
            result.contract_expiry_date = _.isNull(result.contract_expiry_date)
              ? null
              : moment(result.contract_expiry_date);
            result.death_date = _.isNull(result.death_date)
              ? null
              : moment(result.death_date);
            result.transfer_date = _.isNull(result.transfer_date)
              ? null
              : moment(result.transfer_date);
            setValueReactFormHook(result, setValue);
          }
          setLoadingEdit(false);
        })
        .catch((err) => {
          console.log(err.response);
          setLoadingEdit(false);
        });
    }
  }, []);
  const handleCancel = () => {
    setVisible(false);
  };
  const onChangeVT = (e) => {
    let arr = [];
    _.filter(lstRoles, (item) => {
      if (e.target.value === item.Id) {
        arr.push({ NAME: item.NAME });
      }
    });
    setLstPickRoles(arr);
  };
  //Submit form

  const onSubmit = async (data) => {
    //???? c?? staff_id
    //submit chi ti???t
    const place_of_birth_id =
      checkPlace(
        watch().place_of_birth_province_id,
        watch().place_of_birth_district_id,
        watch().place_of_birth_ward_id
      ) || "";
    const place_of_origin_id =
      checkPlace(
        watch().place_of_origin_province_id,
        watch().place_of_origin_district_id,
        watch().place_of_origin_ward_id
      ) || "";
    const place_of_residence_id =
      checkPlace(
        watch().place_of_residence_province_id,
        watch().place_of_residence_district_id,
        watch().place_of_residence_ward_id
      ) || "";
    const place_of_current_id =
      checkPlace(
        watch().place_of_current_province_id,
        watch().place_of_current_district_id,
        watch().place_of_current_ward_id
      ) || "";
    if (isStatus === 0) {
      const result = await dispatch(
        createStaffInfor({
          staff_id: staffId,
          ...data,
          height: parseInt(data.height),
          weight: parseInt(data.weight),
          place_of_birth_id: place_of_birth_id,
          place_of_origin_id: place_of_origin_id,
          place_of_residence_id: place_of_residence_id,
          place_of_current_id: place_of_current_id,
        })
      );
      if (result) {
        openNotificationWithIcon(
          "success",
          "Th??m chi ti???t nh??n vi??n th??nh c??ng"
        );
        setVisible(false);
        setObjEdit({});
      }
    } else {
      // khi edit g???i 2 api c???p nh???t l???i th??ng tin c?? b???n/th??ng tin nh??n vi??n
      // C???p nh???t khoa ph??ng
      dispatch(
        editNhanViens({
          ...data,
          position_id: watch().position_id,
          department_id: watch().department_id,
          id: objEdit.id,
          hospital_id: isBenhVienId,
        })
      );
      if (objEdit.staff_infor_id === null) {
        //th??m m???i staff infor
        const result = await dispatch(
          createStaffInfor({
            staff_id: objEdit.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Th??m chi ti???t nh??n vi??n th??nh c??ng"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        // C???p nh???n staff info
        const result = await dispatch(
          EditStaffInfor({
            staff_id: objEdit.id,
            staff_infor_id: objEdit.staff_infor_id,
            ...data,
            height: parseInt(data.height),
            weight: parseInt(data.weight),
            place_of_birth_id: place_of_birth_id,
            place_of_origin_id: place_of_origin_id,
            place_of_residence_id: place_of_residence_id,
            place_of_current_id: place_of_current_id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "S???a chi ti???t nh??n vi??n th??nh c??ng"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    }
  };
  //upload avatar
  const imageChange = (e) => {
    const isJpgOrPng =
      e.target.files[0]?.type === "image/jpeg" ||
      e.target.files[0]?.type === "image/png";
    if (!isJpgOrPng) {
      openNotificationWithIcon("error", "File upload ph???i ??? d???ng jpg/png");
      return;
    }
    const isLt2M = e.target.files[0]?.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      openNotificationWithIcon("error", "File upload v?????t qu?? gi???i h???n");
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
  };
  const onSubmitBase = async (data) => {
    //submit c?? b???n
    let dataSend = {
      codekt: data.codekt,
      codehis: data.codehis,
      code: data.code,
      name: data.name,
      number_sign: data.number_sign,
      contact: data.email,
      start_date: moment(watch().recruitment_recruited_date).format(),
      official_date: moment(watch().recruitment_office_date).format(),
      HospitalId: isBenhVienId,
      position_id: watch().position_id,
      department_id: watch().department_id,
      UserName: data.USERNAME,
      Password: data.PASSWORD,
      Email: data.email,
      //role
      lstRoles: isLstPickRoles,
      position_name: lstChucVu.find((item) => {
        if (item.id === watch().position_id) {
          return item.name;
        }
      }),
      department_name: lstKhoaPhong.findIndex(
        (item) => item.id === watch().department_id
      ),
    };
    if (
      watch().USERNAME === "" ||
      watch().PASSWORD === "" ||
      watch().REPASSWORD === ""
    ) {
      openNotificationWithIcon(
        "warning",
        "Vui l??ng nh???p th??ng tin t??i kho???n ????ng nh???p"
      );
      return;
    }
    if (watch().PASSWORD.length < 6 || watch().REPASSWORD.length < 6) {
      openNotificationWithIcon("warning", "M???t kh???u ??t nh???t 6 k?? t???");
      return;
    }
    if (watch().PASSWORD !== watch().REPASSWORD) {
      openNotificationWithIcon("warning", "M???t kh???u kh??ng tr??ng nhau");
      return;
    }
    if (isLstPickRoles.length === 0) {
      Notification("warning", "Vui l??ng ch???n vai tr?? cho ng?????i d??ng n??y");
    } else {
      //add th??ng tin c?? b???n tr?????c
      if (isStatus === 0) {
        //Th??m m???i
        const response_staff_id = await dispatch(actRegister(dataSend));
        if (response_staff_id) {
          openNotificationWithIcon(
            "success",
            "Th??m th??ng tin c?? b???n th??nh c??ng",
            "Vui l??ng th??m chi ti???t nh??n vi??n"
          );
          setStaffId(response_staff_id);
          setDataShow(dataSend);
          setShow(true);
        }
      } else {
        //S???a
        // dispatch(updUserRoles({ Id: objEdit.Id, lstRoles: isLstPickRoles }));
        // dispatch(editNhanViens(data));
        // setObjEdit({});
        // setVisible(false);
        setObjEdit({});
        console.log("edit onSubmitBase");
      }
    }
  };
  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("ThemNV") : t("SuaNV")}
        visible={isVisible}
        centered={true}
        width={"90vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 10, bottom: 10 }}
        footer={
          show || isStatus === 1
            ? [
                <button onClick={handleCancel} className="btnCancel">
                  {t("Huy")}
                </button>,
                <button
                  form="form"
                  key="submit"
                  htmlType="submit"
                  className="btnSubmit"
                >
                  {t("LuuThongTin")}
                </button>,
              ]
            : ""
        }
      >
        {loadingEdit ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50vw",
            }}
          >
            <Space size="middle">
              <Spin size="large" />
            </Space>
          </div>
        ) : (
          <>
            {dataShow ? (
              <form>
                <Tabs defaultActiveKey="1">
                  <TabPane tab={"Th??ng tin c?? b???n"} key="1">
                    <div style={{ height: "250px" }}>
                      <Row gutter={[8, 0]}>
                        <Col span={18} push={6}>
                          <Row gutter={[8, 0]}>
                            <Col span={12}>
                              <p className="data-show-text">
                                <span style={{ fontWeight: "bold" }}>
                                  M?? c??n b???:{" "}
                                </span>
                                {dataShow.code}
                              </p>
                            </Col>
                            <Col span={12}>
                              <p className="data-show-text">
                                <span style={{ fontWeight: "bold" }}>
                                  Email:{" "}
                                </span>
                                {dataShow.Email}
                              </p>
                            </Col>
                            <Col span={12}>
                              <p className="data-show-text">
                                <span style={{ fontWeight: "bold" }}>
                                  T??n c??n b???:{" "}
                                </span>
                                {dataShow.name}
                              </p>
                            </Col>

                            <Col span={12}>
                              <p className="data-show-text">
                                <span style={{ fontWeight: "bold" }}>
                                  S??? hi???u c??n b???:{" "}
                                </span>
                                {dataShow.number_sign}
                              </p>
                            </Col>
                            <Col span={12}>
                              <p className="data-show-text">
                                <span style={{ fontWeight: "bold" }}>
                                  M?? k??? to??n:{" "}
                                </span>
                                {dataShow.codekt}
                              </p>
                            </Col>
                            <Col span={12}>
                              <p className="data-show-text">
                                <span style={{ fontWeight: "bold" }}>
                                  M?? hsoft:{" "}
                                </span>
                                {dataShow.codehis}
                              </p>
                            </Col>
                            <Col span={12}>
                              <p className="data-show-text">
                                <span style={{ fontWeight: "bold" }}>
                                  Ch???c v???:{" "}
                                </span>
                                {dataShow.position_name.name}
                              </p>
                            </Col>
                            <Col span={12}>
                              <p className="data-show-text">
                                <span style={{ fontWeight: "bold" }}>
                                  Khoa/Ph??ng:{" "}
                                </span>
                                {lstKhoaPhong[dataShow.department_name].name}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={6} pull={18}>
                          <div className="box-avatar">
                            {selectedImage && (
                              <div style={styles.preview}>
                                <img
                                  src={URL.createObjectURL(selectedImage)}
                                  style={styles.image}
                                  alt="Thumb"
                                />
                                <button
                                  onClick={removeSelectedImage}
                                  style={styles.delete}
                                >
                                  Remove This Image
                                </button>
                              </div>
                            )}
                            <input
                              accept="image/*"
                              type="file"
                              onChange={imageChange}
                              readOnly
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </TabPane>
                  <TabPane tab={"T??i kho???n ????ng nh???p"} key="2">
                    <div style={{ height: "250px" }}>
                      <Col span={12}>
                        <Input
                          label="TenTruyCap"
                          defaultValue={dataShow.UserName}
                          readOnly
                        />
                      </Col>
                    </div>
                  </TabPane>
                  <TabPane tab={t("VaiTro")} key="3">
                    <div style={{ height: "250px" }}>
                      <Radio.Group defaultValue={dataShow.lstRoles[0].Id}>
                        {dataShow.lstRoles.length > 0 &&
                          dataShow.lstRoles.map((val) => (
                            <Radio value={val.Id} key={val.Id}>
                              {val.NAME}
                            </Radio>
                          ))}
                      </Radio.Group>
                    </div>
                  </TabPane>
                </Tabs>
              </form>
            ) : (
              <>
                <form
                  className="form2"
                  id="form2"
                  onSubmit={handleSubmit(onSubmitBase)}
                >
                  {isStatus === 0 ? (
                    <Tabs defaultActiveKey="1">
                      <TabPane tab={"Th??ng tin c?? b???n"} key="1">
                        <div style={{ height: "300px" }}>
                          <Row gutter={[8, 0]}>
                            <Col span={18} push={6}>
                              <Row gutter={[8, 0]}>
                                <Col span={12}>
                                  <Input
                                    label="MaNV"
                                    name={register("code", { required: true })}
                                    required={true}
                                    errors={errors}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Input
                                    label="Email"
                                    name={register("email", {
                                      required: true,
                                      pattern: {
                                        value:
                                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                      },
                                    })}
                                    required={true}
                                    errors={errors}
                                    type="email"
                                  />
                                </Col>
                                <Col span={12}>
                                  <Input
                                    label="TenNV"
                                    name={register("name", { required: true })}
                                    required={true}
                                    errors={errors}
                                  />
                                </Col>

                                <Col span={12}>
                                  <Input
                                    label="S??? hi???u c??n b???"
                                    name={register("number_sign")}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Input
                                    label="M?? k??? to??n"
                                    name={register("codekt")}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Input
                                    label="M?? Hsoft"
                                    name={register("codehis")}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Select
                                    control={control}
                                    label="ChucVu"
                                    name={"position_id"}
                                    arrayItem={lstChucVu}
                                    valueOpt="id"
                                    nameOpt="name"
                                    required
                                    errors={errors}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Select
                                    control={control}
                                    label="KhoaPhong"
                                    name={"department_id"}
                                    arrayItem={lstKhoaPhong}
                                    valueOpt="id"
                                    nameOpt="name"
                                    required
                                    errors={errors}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col span={6} pull={18}>
                              <div className="box-avatar">
                                {selectedImage && (
                                  <div style={styles.preview}>
                                    <img
                                      src={URL.createObjectURL(selectedImage)}
                                      style={styles.image}
                                      alt="Thumb"
                                    />
                                    <button
                                      onClick={removeSelectedImage}
                                      style={styles.delete}
                                    >
                                      Remove This Image
                                    </button>
                                  </div>
                                )}
                                <input
                                  accept="image/*"
                                  type="file"
                                  onChange={imageChange}
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </TabPane>
                      <TabPane tab={"T??i kho???n ????ng nh???p"} key="2">
                        <div style={{ height: "250px" }}>
                          <Col span={12}>
                            <Input
                              label="TenTruyCap"
                              name={
                                isStatus === 0
                                  ? register("USERNAME")
                                  : register("user_name")
                              }
                              required={true}
                              errors={errors}
                            />
                          </Col>
                          <Col span={12}>
                            {isStatus === 0 ? (
                              <>
                                <Input
                                  label="MatKhau"
                                  name={register("PASSWORD")}
                                  type="password"
                                  required={true}
                                  errors={errors}
                                />
                                <Input
                                  label="ReMatKhau"
                                  name={register("REPASSWORD")}
                                  type="password"
                                  required={true}
                                  errors={errors}
                                />
                              </>
                            ) : (
                              <></>
                            )}
                          </Col>
                        </div>
                      </TabPane>
                      <TabPane tab={t("VaiTro")} key="3">
                        <div style={{ height: "250px" }}>
                          <Radio.Group
                            onChange={onChangeVT}
                            defaultValue={
                              isStatus === 0
                                ? "16346513-4966-4fa7-9575-aecf008be49a"
                                : isLstPickRoles
                            }
                          >
                            {lstRoles.length > 0 &&
                              lstRoles.map((val) => (
                                <Radio value={val.Id}>{val.NAME}</Radio>
                              ))}
                          </Radio.Group>
                        </div>
                      </TabPane>
                    </Tabs>
                  ) : (
                    <Tabs defaultActiveKey="1">
                      <TabPane tab={"Th??ng tin c?? b???n"} key="1">
                        <div style={{ height: "250px" }}>
                          <Row gutter={[8, 0]}>
                            <Col span={18} push={6}>
                              <Row gutter={[8, 0]}>
                                <Col span={12}>
                                  <Input
                                    label="MaNV"
                                    name={register("code")}
                                    readOnly
                                    disabled
                                  />
                                </Col>
                                <Col span={12}>
                                  <Input
                                    label="Email"
                                    name={register("email")}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Input
                                    label="M?? k??? to??n"
                                    name={register("codekt")}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Input
                                    label="M?? Hsoft"
                                    name={register("codehis")}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Input
                                    label="TenNV"
                                    name={register("name")}
                                    readOnly
                                    disabled
                                  />
                                </Col>

                                <Col span={12}>
                                  <Input
                                    label="S??? hi???u c??n b???"
                                    name={register("number_sign")}
                                    readOnly
                                    disabled
                                  />
                                </Col>
                                <Col span={12}>
                                  <Select
                                    control={control}
                                    label="ChucVu"
                                    name={"position_id"}
                                    arrayItem={lstChucVu}
                                    valueOpt="id"
                                    nameOpt="name"
                                    readOnly
                                    errors={errors}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Select
                                    control={control}
                                    label="KhoaPhong"
                                    name={"department_id"}
                                    arrayItem={lstKhoaPhong}
                                    valueOpt="id"
                                    nameOpt="name"
                                    readOnly
                                    errors={errors}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col span={6} pull={18}>
                              <div className="box-avatar">
                                {selectedImage && (
                                  <div style={styles.preview}>
                                    <img
                                      src={URL.createObjectURL(selectedImage)}
                                      style={styles.image}
                                      alt="Thumb"
                                    />
                                  </div>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </TabPane>
                      <TabPane tab={"T??i kho???n ????ng nh???p"} key="2">
                        <div style={{ height: "250px" }}>
                          <Col span={12}>
                            <Input
                              label="TenTruyCap"
                              name={
                                isStatus === 0
                                  ? register("USERNAME")
                                  : register("user_name")
                              }
                              readOnly
                              disabled
                            />
                          </Col>
                          <Col span={12}>
                            {isStatus === 0 ? (
                              <>
                                <Input
                                  label="MatKhau"
                                  name={register("PASSWORD")}
                                  type="password"
                                  required={true}
                                  errors={errors}
                                />
                                <Input
                                  label="ReMatKhau"
                                  name={register("REPASSWORD")}
                                  type="password"
                                  required={true}
                                  errors={errors}
                                />
                              </>
                            ) : (
                              <></>
                            )}
                          </Col>
                        </div>
                      </TabPane>
                      <TabPane tab={t("VaiTro")} key="3">
                        <div style={{ height: "250px" }}>
                          <Radio.Group onChange={onChangeVT} value={valueRole}>
                            {lstRoles.length > 0 &&
                              lstRoles.map((val) => {
                                // console.log(val);
                                return <Radio value={val.Id}>{val.NAME}</Radio>;
                              })}
                          </Radio.Group>
                        </div>
                      </TabPane>
                    </Tabs>
                  )}
                </form>
                {isStatus === 0 && (
                  <div
                    className="btn-submit-base"
                    style={{ textAlign: "right" }}
                  >
                    <button
                      form="form2"
                      key="submit"
                      htmlType="submit"
                      className="btnSubmit"
                    >
                      {t("LuuThongTin")}
                    </button>
                  </div>
                )}
              </>
            )}
            {isStatus === 1 ? (
              <>
                <Divider />
                <Tabs defaultActiveKey="1" tabPosition={"left"}>
                  {/* Th??ng tin nh??n vi??n */}
                  <TabPane tab={t("ThongTinNV")} key="1">
                    <form
                      className="form"
                      id="form"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Row gutter={[8, 0]}>
                        <Col span={6}>
                          <Input
                            label="H??? v?? t??n kh??c "
                            name={register("other_name")}
                            // required={true}
                            control={control}
                            errors={errors}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="NgaySinh"
                            name="date_of_birth"
                            control={control}
                            defaultValue={null}
                            required={true}
                            errors={errors}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="GioiTinh"
                            name={"sex_id"}
                            arrayItem={"odata/AvailableCatalogs/Sexs"}
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="DienThoai"
                            name={register("phone")}
                            control={control}
                          />
                        </Col>

                        <Col span={6}>
                          <Select
                            control={control}
                            label="Ph??n lo???i c??n b???"
                            name={"staff_type_id"}
                            arrayItem={"odata/AvailableCatalogs/StaffTypes"}
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="Tr???ng th??i c??n b???"
                            name={"staff_status_id"}
                            arrayItem={"odata/AvailableCatalogs/StaffStatuss"}
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="D??n t???c"
                            name={"ethnic_id"}
                            arrayItem={"odata/AvailableCatalogs/Ethnics"}
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="T??n gi??o"
                            name={"religion_id"}
                            arrayItem={"odata/AvailableCatalogs/Religions"}
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="S??? CMND/CCCD"
                            name={register("identify", { required: true })}
                            required
                            errors={errors}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y c???p CMND/CCCD"
                            // name="date_of_issue"
                            name={"date_of_issue"}
                            control={control}
                            defaultValue={null}
                            required={true}
                            errors={errors}
                            // required
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="N??i c???p CMND/CCCD"
                            name={register("place_of_issue", {
                              required: true,
                            })}
                            required={true}
                            errors={errors}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="M?? s??? thu??? c?? nh??n"
                            name={register("tax_code")}
                            control={control}
                          />
                        </Col>
                      </Row>

                      {/* <Row gutter={[8, 0]}>
                        <Col span={3}>
                          <h5>N??i sinh</h5>
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="T???nh/Th??nh ph???"
                            name={"place_of_birth_province_id"}
                            arrayItem={
                              "odata/AvailableCatalogs/Places/Province"
                            }
                            valueOpt="id"
                            nameOpt="province_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="Qu???n/Huy???n"
                            name={"place_of_birth_district_id"}
                            arrayItem={arrQuanHuyenTpNoiSinh}
                            valueOpt="id"
                            nameOpt="district_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="Ph?????ng/X??"
                            name={"place_of_birth_ward_id"}
                            arrayItem={arrPhuongXaTpNoiSinh}
                            valueOpt="id"
                            nameOpt="ward_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                      </Row>
                      <Row gutter={[8, 0]}>
                        <Col span={3}>
                          <h5>N??i ???</h5>
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="T???nh/Th??nh ph???"
                            name={"place_of_current_province_id"}
                            arrayItem={
                              "odata/AvailableCatalogs/Places/Province"
                            }
                            valueOpt="id"
                            nameOpt="province_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="Qu???n/Huy???n"
                            name={"place_of_current_district_id"}
                            arrayItem={arrQuanHuyenTpNoiO}
                            valueOpt="id"
                            nameOpt="district_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="Ph?????ng/X??"
                            name={"place_of_current_ward_id"}
                            arrayItem={arrPhuongXaTpNoiO}
                            valueOpt="id"
                            nameOpt="ward_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                      </Row>
                      <Row gutter={[8, 0]}>
                        <Col span={3}>
                          <h5>Qu?? qu??n</h5>
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="T???nh/Th??nh ph???"
                            name={"place_of_origin_province_id"}
                            arrayItem={
                              "odata/AvailableCatalogs/Places/Province"
                            }
                            valueOpt="id"
                            nameOpt="province_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="Qu???n/Huy???n"
                            name={"place_of_origin_district_id"}
                            arrayItem={arrQuanHuyenTpQueQuan}
                            valueOpt="id"
                            nameOpt="district_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="Ph?????ng/X??"
                            name={"place_of_origin_ward_id"}
                            arrayItem={arrPhuongXaTpQueQuan}
                            valueOpt="id"
                            nameOpt="ward_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                      </Row>
                      <Row gutter={[8, 0]}>
                        <Col span={3}>
                          <h5>H??? kh???u th?????ng tr??</h5>
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="T???nh/Th??nh ph???"
                            name={"place_of_residence_province_id"}
                            arrayItem={
                              "odata/AvailableCatalogs/Places/Province"
                            }
                            valueOpt="id"
                            nameOpt="province_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="Qu???n/Huy???n"
                            name={"place_of_residence_district_id"}
                            arrayItem={arrQuanHuyenTpHKTT}
                            valueOpt="id"
                            nameOpt="district_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={7}>
                          <Select
                            control={control}
                            label="Ph?????ng/X??"
                            name={"place_of_residence_ward_id"}
                            arrayItem={arrPhuongXaTpHKTT}
                            valueOpt="id"
                            nameOpt="ward_name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                      </Row> */}
                      <Row gutter={[8, 0]}>
                        <Col span={12}>
                          <Input
                            label="?????a ch???"
                            name={register("address")}
                            control={control}
                          />
                        </Col>
                      </Row>
                      <Row gutter={[8, 0]}>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="H??nh th???c tuy???n d???ng"
                            name={"recruitment_form_id"}
                            arrayItem={
                              "odata/AvailableCatalogs/RecruitmentForms"
                            }
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="C?? quan tuy???n d???ng"
                            name={register("recruitment_agency")}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y tuy???n d???ng"
                            name="recruited_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y v??? c?? quan"
                            name="offical_recruited_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="Tr??nh ????? ph??? th??ng"
                            name={"general_education_id"}
                            arrayItem={
                              "odata/AvailableCatalogs/GeneralEducations"
                            }
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="Ngh??? nghi???p (tr?????c khi tuy???n d???ng)"
                            name={"job_id"}
                            arrayItem={"odata/AvailableCatalogs/Jobs"}
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="C??ng vi???c ch??nh"
                            name={register("main_work")}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="S??? tr?????ng c??ng t??c"
                            name={register("forte_work")}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y v??o ?????ng"
                            name="party_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y ch??nh th???c v??o ?????ng "
                            name="offical_party_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>

                        <Col span={6}>
                          <Input
                            label="S??? th??? ?????ng "
                            name={register("party_number")}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="Nh??m gia ????nh ch??nh s??ch"
                            name={"family_type_id"}
                            arrayItem={"odata/AvailableCatalogs/FamilyTypes"}
                            valueOpt="id"
                            nameOpt="name"
                            errors={errors}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y nh???p ng?? "
                            name="enlistment_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y xu???t ng?? "
                            name="demobilization_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="Qu??n h??m cao nh???t"
                            name={"highest_rank_id"}
                            arrayItem={"odata/AvailableCatalogs/MilitaryRanks"}
                            valueOpt="id"
                            nameOpt="name"
                            errors={errors}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="H???ng th????ng binh"
                            name={"wounded_soldier_id"}
                            arrayItem={
                              "odata/AvailableCatalogs/WoundedSoldiers"
                            }
                            valueOpt="id"
                            nameOpt="name"
                            errors={errors}
                          />
                        </Col>

                        <Col span={6}>
                          <Select
                            control={control}
                            label="S???c kh???e"
                            name={"health_type_id"}
                            arrayItem={"odata/AvailableCatalogs/HealthTypes"}
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="Chi???u cao (cm) "
                            name={register("height")}
                            type="number"
                            min={0}
                            defaultValue={0}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="C??n n???ng (kg)"
                            name={register("weight")}
                            type="number"
                            min={0}
                            defaultValue={0}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            control={control}
                            label="Nh??m m??u"
                            name={"blood_id"}
                            arrayItem={"odata/AvailableCatalogs/Bloods"}
                            valueOpt="id"
                            nameOpt="name"
                            optNull={false}
                            // required={true}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="S??? b???o hi???m x?? h???i "
                            name={register("social_insurance_number")}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="S??? th??? b???o h???m y t??? "
                            name={register("health_insurance_number")}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            label="N??i c???p b???o hi???m x?? h??i "
                            name={register("social_insurance_place_issue")}
                            control={control}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y h???t h???n h???p ?????ng"
                            name="contract_expiry_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y ngh??? h??u"
                            name="retire_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y ngh??? vi???c"
                            name="quit_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y chuy???n c??ng t??c"
                            name="transfer_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>
                        <Col span={6}>
                          <DatePicker
                            placeholder="Ch???n ng??y"
                            label="Ng??y t??? tr???n"
                            name="death_date"
                            control={control}
                            defaultValue={null}
                          />
                        </Col>

                        <Col span={12}>
                          <TextArea
                            label="L???ch s??? b???n th??n"
                            name={register("self_history")}
                            control={control}
                          />
                        </Col>
                        <Col span={12}>
                          <TextArea
                            label="Nh???n x??t ????nh gi?? ????n v???"
                            name={register("comment")}
                            control={control}
                          />
                        </Col>
                      </Row>
                    </form>
                  </TabPane>

                  <TabPane tab={t("TtLuong")} key="2">
                    <ThongTinLuong
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("phucap")} key="3">
                    <PhuCap
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("ChucVuDangDoanChinhQuyen")} key="4">
                    <ChucVuDang
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("QuaTrinhNhanVienCongTac")} key="5">
                    <QuaTrinhNVCongTac
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("daotaochuyemon")} key="6">
                    <DaoTaoChuyenMon
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                    <Divider />

                    <ChungChiHanhNghe
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("THhiDuaKhenThuong")} key="7">
                    <ThiDuaKhenThuong
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("TTKL")} key="8">
                    <ThongTinKyLuat
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("NNTH")} key="9">
                    <NgoaiNgu
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                    <TinHoc
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("LLCT")} key="10">
                    <ChinhTri
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                    <Divider />

                    <QuanLyNhaNuoc
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                    <Divider />

                    <AnNinhQuocPhong
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("CDKH")} key="11">
                    <ChucDanh
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                    <Divider />
                    <DanToc
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                    <Divider />
                    <DanhGiaCanBoHangNam
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("TTHD")} key="12">
                    <ThongTinHopDong
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("QHGD")} key="13">
                    <QuanHeGiaDinh
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("KKTS")} key="14">
                    {/* <KeKhaiTaiSan /> */}
                    <NhaOCongTrinh
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                    <Divider />
                    <QuyenSuDungDat
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                    <Divider />
                    <TaiSanKhac
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("QHCB")} key="15">
                    <QuyHoachCanBo
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                  <TabPane tab={t("DTBD")} key="16">
                    <DaoTaoBoiDuong
                      staffId={staffId}
                      isParentStatus={isStatus}
                      objParent={objEdit}
                    />
                  </TabPane>
                </Tabs>
              </>
            ) : (
              show && (
                <>
                  <Divider></Divider>
                  <Tabs defaultActiveKey="1" tabPosition={"left"}>
                    {/* Th??ng tin nh??n vi??n */}
                    <TabPane tab={t("ThongTinNV")} key="1">
                      <form
                        className="form"
                        id="form"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <Row gutter={[8, 0]}>
                          <Col span={6}>
                            <Input
                              label="H??? v?? t??n kh??c "
                              name={register("other_name")}
                              // required={true}
                              control={control}
                              errors={errors}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="NgaySinh"
                              name="date_of_birth"
                              control={control}
                              defaultValue={null}
                              required={true}
                              errors={errors}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="GioiTinh"
                              name={"sex_id"}
                              arrayItem={"odata/AvailableCatalogs/Sexs"}
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="DienThoai"
                              name={register("phone")}
                              control={control}
                            />
                          </Col>

                          <Col span={6}>
                            <Select
                              control={control}
                              label="Ph??n lo???i c??n b???"
                              name={"staff_type_id"}
                              arrayItem={"odata/AvailableCatalogs/StaffTypes"}
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="Tr???ng th??i c??n b???"
                              name={"staff_status_id"}
                              arrayItem={"odata/AvailableCatalogs/StaffStatuss"}
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="D??n t???c"
                              name={"ethnic_id"}
                              arrayItem={"odata/AvailableCatalogs/Ethnics"}
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="T??n gi??o"
                              name={"religion_id"}
                              arrayItem={"odata/AvailableCatalogs/Religions"}
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="S??? CMND/CCCD"
                              name={register("identify", { required: true })}
                              required
                              errors={errors}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y c???p CMND/CCCD"
                              // name="date_of_issue"
                              name={"date_of_issue"}
                              control={control}
                              defaultValue={null}
                              errors={errors}
                              required={true}
                              // required
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="N??i c???p CMND/CCCD"
                              name={register("place_of_issue", {
                                required: true,
                              })}
                              required={true}
                              errors={errors}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="M?? s??? thu??? c?? nh??n"
                              name={register("tax_code")}
                              control={control}
                            />
                          </Col>
                        </Row>

                        {/* <Row gutter={[8, 0]}>
                          <Col span={3}>
                            <h5>N??i sinh</h5>
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="T???nh/Th??nh ph???"
                              name={"place_of_birth_province_id"}
                              arrayItem={
                                "odata/AvailableCatalogs/Places/Province"
                              }
                              valueOpt="id"
                              nameOpt="province_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="Qu???n/Huy???n"
                              name={"place_of_birth_district_id"}
                              arrayItem={arrQuanHuyenTpNoiSinh}
                              valueOpt="id"
                              nameOpt="district_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="Ph?????ng/X??"
                              name={"place_of_birth_ward_id"}
                              arrayItem={arrPhuongXaTpNoiSinh}
                              valueOpt="id"
                              nameOpt="ward_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                          <Col span={3}>
                            <h5>N??i ???</h5>
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="T???nh/Th??nh ph???"
                              name={"place_of_current_province_id"}
                              arrayItem={
                                "odata/AvailableCatalogs/Places/Province"
                              }
                              valueOpt="id"
                              nameOpt="province_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="Qu???n/Huy???n"
                              name={"place_of_current_district_id"}
                              arrayItem={arrQuanHuyenTpNoiO}
                              valueOpt="id"
                              nameOpt="district_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="Ph?????ng/X??"
                              name={"place_of_current_ward_id"}
                              arrayItem={arrPhuongXaTpNoiO}
                              valueOpt="id"
                              nameOpt="ward_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                          <Col span={3}>
                            <h5>Qu?? qu??n</h5>
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="T???nh/Th??nh ph???"
                              name={"place_of_origin_province_id"}
                              arrayItem={
                                "odata/AvailableCatalogs/Places/Province"
                              }
                              valueOpt="id"
                              nameOpt="province_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="Qu???n/Huy???n"
                              name={"place_of_origin_district_id"}
                              arrayItem={arrQuanHuyenTpQueQuan}
                              valueOpt="id"
                              nameOpt="district_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="Ph?????ng/X??"
                              name={"place_of_origin_ward_id"}
                              arrayItem={arrPhuongXaTpQueQuan}
                              valueOpt="id"
                              nameOpt="ward_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                        </Row> */}
                        <Row gutter={[8, 0]}>
                          <Col span={3}>
                            <h5>H??? kh???u th?????ng tr??</h5>
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="T???nh/Th??nh ph???"
                              name={"place_of_residence_province_id"}
                              arrayItem={
                                "odata/AvailableCatalogs/Places/Province"
                              }
                              valueOpt="id"
                              nameOpt="province_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          {/* <Col span={7}>
                            <Select
                              control={control}
                              label="Qu???n/Huy???n"
                              name={"place_of_residence_district_id"}
                              arrayItem={arrQuanHuyenTpHKTT}
                              valueOpt="id"
                              nameOpt="district_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={7}>
                            <Select
                              control={control}
                              label="Ph?????ng/X??"
                              name={"place_of_residence_ward_id"}
                              arrayItem={arrPhuongXaTpHKTT}
                              valueOpt="id"
                              nameOpt="ward_name"
                              optNull={false}
                              // required={true}
                            />
                          </Col> */}
                        </Row>
                        <Row gutter={[8, 0]}>
                          <Col span={12}>
                            <Input
                              label="?????a ch???"
                              name={register("address")}
                              control={control}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="H??nh th???c tuy???n d???ng"
                              name={"recruitment_form_id"}
                              arrayItem={
                                "odata/AvailableCatalogs/RecruitmentForms"
                              }
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="C?? quan tuy???n d???ng"
                              name={register("recruitment_agency")}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y tuy???n d???ng"
                              name="recruited_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y v??? c?? quan"
                              name="offical_recruited_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="Tr??nh ????? ph??? th??ng"
                              name={"general_education_id"}
                              arrayItem={
                                "odata/AvailableCatalogs/GeneralEducations"
                              }
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="Ngh??? nghi???p (tr?????c khi tuy???n d???ng)"
                              name={"job_id"}
                              arrayItem={"odata/AvailableCatalogs/Jobs"}
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="C??ng vi???c ch??nh"
                              name={register("main_work")}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="S??? tr?????ng c??ng t??c"
                              name={register("forte_work")}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y v??o ?????ng"
                              name="party_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y ch??nh th???c v??o ?????ng "
                              name="offical_party_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>

                          <Col span={6}>
                            <Input
                              label="S??? th??? ?????ng "
                              name={register("party_number")}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="Nh??m gia ????nh ch??nh s??ch"
                              name={"family_type_id"}
                              arrayItem={"odata/AvailableCatalogs/FamilyTypes"}
                              valueOpt="id"
                              nameOpt="name"
                              errors={errors}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y nh???p ng?? "
                              name="enlistment_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y xu???t ng?? "
                              name="demobilization_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="Qu??n h??m cao nh???t"
                              name={"highest_rank_id"}
                              arrayItem={
                                "odata/AvailableCatalogs/MilitaryRanks"
                              }
                              valueOpt="id"
                              nameOpt="name"
                              errors={errors}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="H???ng th????ng binh"
                              name={"wounded_soldier_id"}
                              arrayItem={
                                "odata/AvailableCatalogs/WoundedSoldiers"
                              }
                              valueOpt="id"
                              nameOpt="name"
                              errors={errors}
                            />
                          </Col>

                          <Col span={6}>
                            <Select
                              control={control}
                              label="S???c kh???e"
                              name={"health_type_id"}
                              arrayItem={"odata/AvailableCatalogs/HealthTypes"}
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="Chi???u cao (cm) "
                              name={register("height")}
                              type="number"
                              min={0}
                              defaultValue={0}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="C??n n???ng (kg)"
                              name={register("weight")}
                              type="number"
                              min={0}
                              defaultValue={0}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              control={control}
                              label="Nh??m m??u"
                              name={"blood_id"}
                              arrayItem={"odata/AvailableCatalogs/Bloods"}
                              valueOpt="id"
                              nameOpt="name"
                              optNull={false}
                              // required={true}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="S??? b???o hi???m x?? h???i "
                              name={register("social_insurance_number")}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="S??? th??? b???o h???m y t??? "
                              name={register("health_insurance_number")}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              label="N??i c???p b???o hi???m x?? h??i "
                              name={register("social_insurance_place_issue")}
                              control={control}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y h???t h???n h???p ?????ng"
                              name="contract_expiry_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y ngh??? h??u"
                              name="retire_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y ngh??? vi???c"
                              name="quit_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y chuy???n c??ng t??c"
                              name="transfer_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              placeholder="Ch???n ng??y"
                              label="Ng??y t??? tr???n"
                              name="death_date"
                              control={control}
                              defaultValue={null}
                            />
                          </Col>

                          <Col span={12}>
                            <TextArea
                              label="L???ch s??? b???n th??n"
                              name={register("self_history")}
                              control={control}
                            />
                          </Col>
                          <Col span={12}>
                            <TextArea
                              label="Nh???n x??t ????nh gi?? ????n v???"
                              name={register("comment")}
                              control={control}
                            />
                          </Col>
                        </Row>
                      </form>
                    </TabPane>

                    <TabPane tab={t("TtLuong")} key="2">
                      <ThongTinLuong
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("phucap")} key="3">
                      <PhuCap
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("ChucVuDangDoanChinhQuyen")} key="4">
                      <ChucVuDang
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("QuaTrinhNhanVienCongTac")} key="5">
                      <QuaTrinhNVCongTac
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("daotaochuyemon")} key="6">
                      <DaoTaoChuyenMon
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                      <Divider />
                      <ChungChiHanhNghe
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("THhiDuaKhenThuong")} key="7">
                      <ThiDuaKhenThuong
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("TTKL")} key="8">
                      <ThongTinKyLuat
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("NNTH")} key="9">
                      <NgoaiNgu
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                      <TinHoc
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("LLCT")} key="10">
                      <ChinhTri
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                      <Divider />

                      <QuanLyNhaNuoc
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                      <Divider />

                      <AnNinhQuocPhong
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("CDKH")} key="11">
                      <ChucDanh
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                      <Divider />
                      <DanToc
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                      <Divider />
                      <DanhGiaCanBoHangNam
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("TTHD")} key="12">
                      <ThongTinHopDong
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("QHGD")} key="13">
                      <QuanHeGiaDinh
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("KKTS")} key="14">
                      {/* <KeKhaiTaiSan /> */}
                      <NhaOCongTrinh
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                      <Divider />
                      <QuyenSuDungDat
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                      <Divider />
                      <TaiSanKhac
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("QHCB")} key="15">
                      <QuyHoachCanBo
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                    <TabPane tab={t("DTBD")} key="16">
                      <DaoTaoBoiDuong
                        staffId={staffId}
                        isParentStatus={isStatus}
                        objParent={objEdit}
                      />
                    </TabPane>
                  </Tabs>
                </>
              )
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
