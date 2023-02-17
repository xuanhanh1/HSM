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
  createSurgeryBenefits,
  EditSurgeryBenefits,
  EditTimesheetsCoeffs,
} from "../../../../../redux/actions/DanhMuc";
import openNotificationWithIcon from "../../../../../common/notification/notification";
const { TabPane } = Tabs;

function renderTreeViewItem(item) {
  return `${item.TEN_MENU}`;
}
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
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

  //Submit form
  const onSubmit = async (data) => {
    console.log(data);
    if (isStatus === 0) {
      const result = await dispatch(createSurgeryBenefits(data));
      if (result) {
        openNotificationWithIcon("success", "Thêm đặc thù thành công");
        setVisible(false);
      }
    } else {
      const result = await dispatch(
        EditSurgeryBenefits({ idEdit: objEdit.id, ...data })
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
        title={isStatus === 0 ? t("Thêm đặc thù") : t("Sửa đặc thù")}
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
              <Select
                control={control}
                label="Loại đặc thù"
                name={"surgery_type_id"}
                arrayItem={"odata/AvailableCatalogs/SurgeryTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
                disabled={isStatus === 1 ? true : false}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label={"Mã đặc thù"}
                name={register("code", { required: true })}
                required
                errors={errors}
                disabled={isStatus === 1 ? true : false}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label={"Loại"}
                name={register("type", { required: true })}
                required
                errors={errors}
                disabled={isStatus === 1 ? true : false}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label={"Tên đặc thù"}
                name={register("name", { required: true })}
                required
                errors={errors}
                disabled={isStatus === 1 ? true : false}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label={"Tiền"}
                name={register("money", { required: true })}
                required
                errors={errors}
                type="number"
                min={0}
                defaultValue={0}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label={"Sử dụng"}
                name={register("is_using")}
                // required
                errors={errors}
                type="checkbox"
                disabled={isStatus === 1 ? true : false}
              />
            </Col>
            <Col span={24}>
              <TextArea
                control={control}
                label={"Ghi chú"}
                name={register("note")}
                errors={errors}
                disabled={isStatus === 1 ? true : false}
              />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
}

export default ModalCreateAndEdit;
