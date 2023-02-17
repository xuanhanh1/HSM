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
  EditFamilyRelationships,
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
  const [belong, setBelong] = useState(true);
  const onChange = (e) => {
    console.log("value: " + e.target.value);
    setBelong(e.target.value);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    //edit phải format date time trước
    if (isStatus === 1) {
      objEdit.date_of_birth = _.isNull(objEdit.date_of_birth)
        ? null
        : moment(objEdit.date_of_birth);
      setValueReactFormHook(objEdit, setValue);
      setBelong(objEdit.belong_to);
    }
  }, []);
  const onSubmitPC = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddFamilyRelationships({
            staff_id: staffId,
            ...data,
            belong_to: belong,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm quan hệ gia đình thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        //edit
        const result = await dispatch(
          EditFamilyRelationships({
            staff_id: objEdit.staff_id,
            ...data,
            belong_to: belong,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin hợp đồng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddFamilyRelationships({
            staff_id: objParent.id,
            ...data,
            belong_to: belong,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm quan hệ gia đình thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        //edit
        const result = await dispatch(
          EditFamilyRelationships({
            staff_id: objParent.id,
            ...data,
            belong_to: belong,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin hợp đồng thành công"
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
            ? t("Thêm quan hệ gia đình ")
            : t("Sửa quan hệ gia đình")
        }
        visible={isVisible}
        centered={true}
        width={"60vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 10, bottom: 10 }}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="formQHGD"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formQHGD"
          id="formQHGD"
          onSubmit={handleSubmit(onSubmitPC)}
        >
          <Row gutter={[8, 0]}>
            <Col span={8}>
              <label htmlFor="">Kiểu quan hệ gia đình</label>
              <Radio.Group
                name={"belong_to"}
                onChange={onChange}
                value={belong}
                control={control}
              >
                <Radio value={false}>Bản thân</Radio>
                <Radio value={true}>Vợ hoặc chồng</Radio>
              </Radio.Group>
            </Col>
            <Col span={8}>
              <Select
                control={control}
                label="Mối quan hệ"
                name={"type_id"}
                arrayItem={"odata/AvailableCatalogs/FamilyRelationshipTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>

            <Col span={8}>
              <YearPickerField
                placeholder="Chọn năm"
                label="Năm sinh"
                name="date_of_birth"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={24}>
              <TextArea
                label="Thông tin tổng hợp (quê quản, nghề nghiệp, hộ khẩu, đơn vị công tác, nghề nghiệp, chức vụ)"
                name={register("infor")}
                control={control}
                required={true}
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
