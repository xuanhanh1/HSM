import { Col, Modal, Row } from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddAllowances,
  EditAllowances,
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
      objEdit.create_date = _.isNull(objEdit.create_date)
        ? null
        : moment(objEdit.create_date);
      objEdit.from = _.isNull(objEdit.from) ? null : moment(objEdit.from);
      objEdit.to = _.isNull(objEdit.to) ? null : moment(objEdit.to);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  const onSubmitPC = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddAllowances({
            staff_id: staffId,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon("success", "Thêm phụ cấp thành công");
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditAllowances({
            staff_id: objEdit.staff_id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon("success", "Sửa phụ cấp thành công");
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddAllowances({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon("success", "Thêm phụ cấp thành công");
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditAllowances({
            staff_id: objParent.id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon("success", "Sửa phụ cấp thành công");
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
            ? t("Thêm thông tin phụ cấp ")
            : t("Sửa thông tin phụ cấp")
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
            form="formPC"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formPC"
          id="formPC"
          onSubmit={handleSubmit(onSubmitPC)}
        >
          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Select
                control={control}
                label="Loại phụ cấp"
                name={"type_id"}
                arrayItem={"odata/AvailableCatalogs/AllowanceTypes"}
                valueOpt="id"
                nameOpt="name"
                optNull={false}
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Phần trăm hưởng"
                name={register("percent")}
                type="number"
                min={0}
                step={0.01}
                defaultValue={0}
              />
            </Col>

            <Col span={6}>
              <Input
                control={control}
                label="Hệ số hưởng"
                name={register("coef")}
                type="number"
                min={0}
                step={0.01}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                control={control}
                placeholder="Chọn ngày"
                label="Ngày bắt đầu"
                name="from"
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                control={control}
                placeholder="Chọn ngày"
                label="Ngày kết thúc"
                name="to"
                defaultValue={null}
                required={true}
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
