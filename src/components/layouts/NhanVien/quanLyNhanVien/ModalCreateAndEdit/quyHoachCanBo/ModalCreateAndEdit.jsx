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
  EditStaffPlannings,
} from "../../../../../../redux/actions/Users";
import { setValueReactFormHook } from "../../../../../controller/Format";
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
      objEdit.year = _.isNull(objEdit.year) ? null : moment(objEdit.year);
      objEdit.from = _.isNull(objEdit.from) ? null : moment(objEdit.from);
      objEdit.to = _.isNull(objEdit.to) ? null : moment(objEdit.to);

      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddStaffPlannings({
            staff_id: staffId,
            ...data,
            year: data.year.year() + "",
            from: data.from.year() + "",
            to: data.to.year() + "",
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm quy hoạch cán bộ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditStaffPlannings({
            staff_id: objEdit.staff_id,
            ...data,
            year: data.year.year() + "",
            from: data.from.year() + "",
            to: data.to.year() + "",
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa quy hoạch cán bộ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddStaffPlannings({
            staff_id: objParent.id,
            ...data,
            year: data.year.year() + "",
            from: data.from.year() + "",
            to: data.to.year() + "",
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm quy hoạch cán bộ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditStaffPlannings({
            staff_id: objParent.id,
            ...data,
            year: data.year.year() + "",
            from: data.from.year() + "",
            to: data.to.year() + "",
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa quy hoạch cán bộ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    }
  };
  console.log("staff_id truyen xuong", staffId);
  return (
    <div>
      <Modal
        title={
          isStatus === 0
            ? t("Thêm quy hoạch cán bộ ")
            : t("Sửa quy hoạch cán bộ")
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
            form="formQHCB"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formQHCB"
          id="formQHCB"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[8, 0]}>
            <Col span={4}>
              <YearPickerField
                placeholder="Chọn năm"
                label="Năm quy hoạch"
                name="year"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={4}>
              <YearPickerField
                placeholder="Chọn năm"
                label="Năm bắt đầu"
                name="from"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>

            <Col span={4}>
              <YearPickerField
                placeholder="Chọn năm"
                label="Năm kết thúc"
                name="to"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Chức danh quy hoạch 1"
                name={"title1_id"}
                arrayItem={"odata/AvailableCatalogs/PlanningTitles"}
                valueOpt="id"
                nameOpt="name"
                // required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Đơn vị quy hoạch 1"
                name={"agency1_id"}
                arrayItem={"odata/AvailableCatalogs/PlanningAgencys"}
                valueOpt="id"
                nameOpt="name"
                // required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Chức danh quy hoạch 2"
                name={"title2_id"}
                arrayItem={"odata/AvailableCatalogs/PlanningTitles"}
                valueOpt="id"
                nameOpt="name"
                // required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Đơn vị quy hoạch 2"
                name={"agency2_id"}
                arrayItem={"odata/AvailableCatalogs/PlanningAgencys"}
                valueOpt="id"
                nameOpt="name"
                // required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Chức danh quy hoạch 3"
                name={"title3_id"}
                arrayItem={"odata/AvailableCatalogs/PlanningTitles"}
                valueOpt="id"
                nameOpt="name"
                // required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Đơn vị quy hoạch 3"
                name={"agency3_id"}
                arrayItem={"odata/AvailableCatalogs/PlanningAgencys"}
                valueOpt="id"
                nameOpt="name"
                // required
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <TextArea
                label="Ghi chú"
                name={register("note")}
                control={control}
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
