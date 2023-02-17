import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col, Tabs, Checkbox } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  createDepartments,
  getALLDepartments,
  editDepartments,
  createTypesDepartment,
} from "../../../../../redux/actions/DanhMuc";
import {
  useLocalStorage,
  _,
  Select,
  Input,
  TextArea,
  callApi,
  Notification,
} from "../../../index";
const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit, urlApi } =
    props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  const [isResult, setResult] = useState(null);
  const [lstTypes, setListTypes] = useState([]);
  const [isLstPickTypes, setLstPickTypes] = useState([]);
  // const lstDepartments = useSelector(state => {
  //   // if(_.isEmpty(state.DanhMucReducers.lstDepartments)){
  //   //   dispatch(getALLDepartments());
  //   // }
  //   return state.DanhMucReducers.lstDepartments
  // });
  useEffect(() => {
    //edit phải format date time trước
    if (isStatus === 1) {
      // objEdit.signing_date = moment(objEdit.signing_date);
      // objEdit.from = moment(objEdit.from);
      // objEdit.to = moment(objEdit.to);
      console.log(objEdit);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  const [lstDepartments, setLstDepartments] = useState([]);
  useEffect(() => {
    callApi(`odata/Departments`, "GET")
      .then((res) => {
        console.log(res);
        setLstDepartments(res.data.value);
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
      });
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isStatus === 1) {
      console.log(objEdit);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!_.isNull(isResult)) {
      isResult.then((result) => {
        if (result) {
          if (urlApi == "/odata/Departments") {
            props.setUrlKhoaPhong("/odata/departments");
          } else {
            props.setUrlKhoaPhong("/odata/Departments");
          }
          dispatch(getALLDepartments(true));
          setVisible(false);
        } else {
          Notification("error", "Cập nhật không thành công");
        }
      });
    }
  }, [isResult]);

  //Submit form
  const onSubmit = (data) => {
    if (isStatus === 0) {
      //Thêm mới
      setResult(
        dispatch(createDepartments({ hospital_id: isBenhVienId, ...data }))
      );
    } else {
      //Sửa
      let result = callApi(`odata/Departments?key=${data.id}`, "PUT", data)
        .then((res) => {
          Notification("success", "Sửa khoa phòng thành công.");
          setObjEdit({});
          return true;
        })
        .catch((err) => {
          Notification("error", err.response.data.Errors[0]);
          return false;
        });
      setResult(result);
    }
  };
  const onRolesChange = (data) => {
    setLstPickTypes(data);
  };
  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("ThemKhoaPhong") : t("SuaKhoaPhong")}
        visible={isVisible}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="formKP"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("Lưu thông tin")}
          </button>,
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab={t("Thông tin khoa phòng")} key="1">
            <form
              className="form"
              id="formKP"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Row gutter={[16, 4]}>
                <Col span={12}>
                  <Input
                    label="MaKhoaPhong"
                    name={register("code", { required: true })}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    label="TenKhoaPhong"
                    name={register("name", { required: true })}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Input label="DienThoai" name={register("phone")} />
                </Col>
                <Col span={12}>
                  <Input label="LanhDao" name={register("leader")} />
                </Col>
                {/* <Col span={12}>
                  <Select
                    control={control}
                    label="KhoaPhongTrucThuoc"
                    name={"department_parent_id"}
                    arrayItem={lstDepartments}
                    valueOpt="id"
                    nameOpt="name"
                  />
                </Col> */}
                <Col span={12}>
                  <Select
                    control={control}
                    label="KhoaPhongTrucThuoc"
                    name={"department_parent_id"}
                    arrayItem={lstDepartments}
                    valueOpt="id"
                    nameOpt="name"
                  />
                </Col>
                <Col span={24}>
                  <TextArea label="GHICHU" name={register("note")} />
                </Col>
              </Row>
            </form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
