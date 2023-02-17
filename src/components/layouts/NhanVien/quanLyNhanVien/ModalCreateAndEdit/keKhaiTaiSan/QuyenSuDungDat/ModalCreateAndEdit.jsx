import { Col, Modal, Row } from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import YearPickerField from "../../../../../../../common/control/componentsForm/YearPicker";
import openNotificationWithIcon from "../../../../../../../common/notification/notification";
import {
  AddImmovables,
  EditImmovables,
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
      objEdit.year = _.isNull(objEdit.year) ? null : moment(objEdit.year);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddImmovables({
            staff_id: staffId,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin quyền sử dụng đất thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditImmovables({
            staff_id: objEdit.staff_id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin quyền sử dụng đất thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddImmovables({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin quyền sử dụng đất thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditImmovables({
            staff_id: objParent.id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin quyền sử dụng đất thành công"
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
            ? t("Thêm thông tin quyền sử dụng đất ")
            : t("Sửa thông tin quyền sử dụng đất")
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
            form="formQuyenSuDungDat"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formQuyenSuDungDat"
          id="formQuyenSuDungDat"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[8, 0]}>
            <Col span={6}>
              <Select
                control={control}
                label="Loại tài sản"
                name={"immovables_type_id"}
                arrayItem={"odata/AvailableCatalogs/ImmovablesTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Tên mảnh đất"
                name={register("name")}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Địa chỉ"
                name={register("address")}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Diện tích"
                name={register("area")}
                type="number"
                min={0}
                defaultValue={0}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Giá trị"
                name={register("value")}
                type="number"
                min={0}
                defaultValue={0}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Giấy chứng nhận"
                name={register("title_deed")}
              />
            </Col>
            <Col span={6}>
              <YearPickerField
                placeholder="Chọn năm"
                label="Năm"
                name="year"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <TextArea
                label="Thông tin khác"
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
