import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import YearPickerField from "../../../../../../common/control/componentsForm/YearPicker";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddAllowances,
  AddFamilyRelationships,
  AddStaffPlannings,
  AddWorkingProcesss,
  EditWorkingProcesss,
} from "../../../../../../redux/actions/Users";
import {
  FormatDate,
  setValueReactFormHook,
} from "../../../../../controller/Format";
import {
  useLocalStorage,
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  Notification,
  callApi,
  ToolBar,
  DataGrid,
} from "../../../../index";
const ModalCreateAndEdit = (props) => {
  const {
    isVisible,
    setVisible,
    objEdit,
    isStatus,
    staffId,
    setObjEdit,
    isParentStatus,
    objParent,
  } = props;
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
  const handleCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    //edit phải format date time trước
    if (isStatus === 1) {
      objEdit.signing_date = _.isNull(objEdit.signing_date)
        ? null
        : moment(objEdit.signing_date);
      objEdit.from = _.isNull(objEdit.from) ? null : moment(objEdit.from);
      objEdit.to = _.isNull(objEdit.to) ? null : moment(objEdit.to);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddWorkingProcesss({
            staff_id: staffId,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm quá trình công tác của nhân viên thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        //edit
        const result = await dispatch(
          EditWorkingProcesss({
            staff_id: objEdit.staff_id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa quá trình công tác của nhân viên thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddWorkingProcesss({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm quá trình công tác của nhân viên thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        //edit
        const result = await dispatch(
          EditWorkingProcesss({
            staff_id: objParent.id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa quá trình công tác của nhân viên thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    }
  };
  return (
    <div>
      <Modal
        title={
          isStatus === 0
            ? t("Thêm quá trình công tác của nhân viên ")
            : t("Sửa quá trình công tác của nhân viên")
        }
        visible={isVisible}
        centered={true}
        width={"70vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 10, bottom: 10 }}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="formNVCongTac"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formNVCongTac"
          id="formNVCongTac"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Thời gian bắt đầu"
                name="from"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Thời gian kết thúc"
                name="to"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <TextArea
                label="Cơ quan/chức vụ/chức danh"
                name={register("content")}
                control={control}
                required={true}
              />
            </Col>

            <Col span={6}>
              <Input
                label="Số quyết định"
                name={register("decision_number")}
                control={control}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Người ký"
                name={register("signer")}
                control={control}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Ngày Ký"
                name="signing_date"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

ModalCreateAndEdit.propTypes = {};

export default ModalCreateAndEdit;
