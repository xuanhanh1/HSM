import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddAllowances,
  AddDiscipline,
  AddEducates,
  EditEducates,
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
          AddEducates({
            staff_id: staffId,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin đào tạo chuyên môn thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditEducates({
            staff_id: objEdit.staff_id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin đào tạo chuyên môn thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddEducates({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin đào tạo chuyên môn thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditEducates({
            staff_id: objParent.id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin đào tạo chuyên môn thành công"
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
            ? t("Thêm thông tin đào tạo chuyên môn ")
            : t("Sửa thông tin đào tạo chuyên môn")
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
            form="formDaoTaoChuyenMon"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formDaoTaoChuyenMon"
          id="formDaoTaoChuyenMon"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[8, 0]}>
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
            <Col span={6}>
              <Select
                control={control}
                label="Cơ sở đào tạo"
                name={"educate_place_id"}
                arrayItem={"odata/AvailableCatalogs/EducatePlaces"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Chuyên nghành"
                name={"educate_major_id"}
                arrayItem={"odata/AvailableCatalogs/EducateMajors"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Hình thức đào tạo"
                name={"educate_form_id"}
                arrayItem={"odata/AvailableCatalogs/EducateForms"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Đào tạo cao nhất"
                name={register("is_highest")}
                type="checkbox"
                control={control}
              />
            </Col>
            <Col span={12}>
              <TextArea
                label="Nội dung"
                name={register("content")}
                control={control}
              />
            </Col>
            <Col span={6}>
              <Input
                // control={control}
                label="Số VB/CC"
                name={register("degree_number", { required: true })}
                required={true}
                errors={errors}
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
                label="Ngày ký"
                name="signing_date"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Nguồn kinh phí"
                name={"educate_fund_id"}
                arrayItem={"odata/AvailableCatalogs/EducateFunds"}
                valueOpt="id"
                nameOpt="name"
                required
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
