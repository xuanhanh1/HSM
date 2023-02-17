import { Col, Modal, Row } from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import YearPickerField from "../../../../../../../common/control/componentsForm/YearPicker";
import openNotificationWithIcon from "../../../../../../../common/notification/notification";
import {
  AddBuildings,
  EditBuildings,
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
          AddBuildings({
            staff_id: staffId,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin nhà ở thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditBuildings({
            staff_id: objEdit.staff_id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon("success", "Sửa thông tin nhà ở thành công");
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddBuildings({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin nhà ở thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditBuildings({
            staff_id: objParent.id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon("success", "Sửa thông tin nhà ở thành công");
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
          isStatus === 0 ? t("Thêm thông tin nhà ở ") : t("Sửa thông tin nhà ở")
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
            form="formNhaOCongTrinh"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formNhaOCongTrinh"
          id="formNhaOCongTrinh"
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
              <Input label="Tên nhà và công trình" name={register("name")} />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Loại nhà"
                name={"building_type_id"}
                arrayItem={"odata/AvailableCatalogs/BuildingTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Cấp công trình"
                name={register("level")}
                type="number"
                min={0}
                control={control}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <Input
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
                label="Giá trị(đơn vị tỷ đồng)"
                name={register("value")}
                type="number"
                min={0}
                control={control}
                defaultValue={0}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Giấy chứng nhận"
                name={register("title_deed")}
                type="number"
                min={0}
                control={control}
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
            <Col span={12}>
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
