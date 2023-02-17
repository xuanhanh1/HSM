import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import openNotificationWithIcon from "../../../../../../../common/notification/notification";
import {
  AddAllowances,
  AddDiscipline,
  AddNationalSecuritys,
  EditNationalSecuritys,
} from "../../../../../../../redux/actions/Users";
import { setValueReactFormHook } from "../../../../../../controller/Format";
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
} from "../../../../../index";
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
      objEdit.issue_date = _.isNull(objEdit.issue_date)
        ? null
        : moment(objEdit.issue_date);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddNationalSecuritys({
            staff_id: staffId,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin an ninh quốc phòng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditNationalSecuritys({
            staff_id: objEdit.staff_id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin an ninh quốc phòng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddNationalSecuritys({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin an ninh quốc phòng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditNationalSecuritys({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin an ninh quốc phòng thành công"
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
            ? t("Thêm thông tin an ninh quốc phòng ")
            : t("Sửa thông tin an ninh quốc phòng")
        }
        visible={isVisible}
        centered={true}
        width={"40vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 10, bottom: 10 }}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="formAnNinhQuocPhong"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formAnNinhQuocPhong"
          id="formAnNinhQuocPhong"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[8, 0]}>
            <Col span={24}>
              <TextArea label="Nội dung" name={register("content")} />
            </Col>
            <Col span={24}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Ngày cấp"
                name="issue_date"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={24}>
              <Input label="Nơi cấp" name={register("issue_place")} />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

ModalCreateAndEdit.propTypes = {};

export default ModalCreateAndEdit;
