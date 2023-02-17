import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Modal, Row, Tabs } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import { createRoles, editRoles } from "../../../../../redux/actions/QuanTri";
import { getAllMenus } from "../../../../../redux/actions/Menu";
import TreeView from "devextreme-react/tree-view";
import {
  _,
  Input,
  Notification,
  TextArea,
  Select,
  callApi,
} from "../../../index";
import {
  AddTimesheetsCoeffs,
  EditTimesheetsCoeffs,
} from "../../../../../redux/actions/DanhMuc";
import openNotificationWithIcon from "../../../../../common/notification/notification";
const { TabPane } = Tabs;

function renderTreeViewItem(item) {
  return `${item.TEN_MENU}`;
}
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
  const [isResult, setResult] = useState(null);
  const [arrSelect, setArrSelect] = useState([]);
  //Các danh sách select option
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getAllMenus());
    if (isStatus === 1) {
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
          setObjEdit({});
          setVisible(false);
        } else {
          Notification("error", "Cập nhật không thành công !");
        }
      });
    }
  }, [isResult]);
  useEffect(() => {
    callApi("odata/DateTypes", "GET").then((res) =>
      setArrSelect(res.data.value)
    );
  }, []);
  //Submit form
  const onSubmit = async (data) => {
    if (isStatus === 0) {
      const result = await dispatch(AddTimesheetsCoeffs(data));
      if (result) {
        openNotificationWithIcon(
          "success",
          "Thêm danh mục chấm công thành công"
        );
        setVisible(false);
      }
    } else {
      const result = await dispatch(
        EditTimesheetsCoeffs({ id: objEdit.id, ...data })
      );
      if (result) {
        openNotificationWithIcon(
          "success",
          "Sửa danh mục chấm công thành công"
        );
        setVisible(false);
      }
    }
  };

  return (
    <div>
      <Modal
        title={
          isStatus === 0
            ? t("Thêm danh mục chấm công")
            : t("Sửa danh mục chấm công")
        }
        visible={isVisible}
        width={"40vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 20 }}
        footer={[
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
        ]}
      >
        <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Input
                label={"Kí hiệu"}
                name={register("code", { required: true })}
                required
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label={"Chú thích"}
                name={register("name", { required: true })}
                required
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label={"Ngày công quy đổi"}
                name={register("exchange_day", { required: true })}
                required
                errors={errors}
                type="number"
                min={0}
                defaultValue={0}
              />
            </Col>
            <Col span={12}>
              <Input
                label={"BHXH chi trả"}
                name={register("is_insurance_paid")}
                errors={errors}
                type="checkbox"
              />
            </Col>
            <Col span={12}>
              <Select
                control={control}
                label="Loại ngày"
                name={"date_type_id"}
                arrayItem={arrSelect}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label={"Hệ số"}
                name={register("date_type_coef")}
                required
                errors={errors}
                type="number"
                min={0}
                defaultValue={0}
                step={0.01}
              />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
}

export default ModalCreateAndEdit;
