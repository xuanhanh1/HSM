import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import YearPickerField from "../../../../../../common/control/componentsForm/YearPicker";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddEmulationRewards,
  EditEmulationRewards,
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
  const [valueType, setValueType] = useState(true);
  const onChange = (e) => {
    setValueType(e.target.value);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    //edit phải format date time trước
    if (isStatus === 1) {
      objEdit.year = _.isNull(objEdit.year) ? null : moment(objEdit.year);
      objEdit.signing_date = _.isNull(objEdit.signing_date)
        ? null
        : moment(objEdit.signing_date);
      setValueReactFormHook(objEdit, setValue);
      setValueType(objEdit.type);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddEmulationRewards({
            staff_id: staffId,
            ...data,
            type: valueType,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin thi đua khen thưởng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditEmulationRewards({
            staff_id: objEdit.staff_id,
            ...data,
            type: valueType,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin thi đua khen thưởng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddEmulationRewards({
            staff_id: objParent.id,
            ...data,
            type: valueType,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin thi đua khen thưởng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditEmulationRewards({
            staff_id: objParent.id,
            ...data,
            type: valueType,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin thi đua khen thưởng thành công"
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
            ? t("Thêm thông tin thi đua khen thưởng")
            : t("Sửa thông tin thi đua khen thưởng")
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
            form="formThiDua"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formThiDua"
          id="formThiDua"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <label htmlFor="">Kiểu thi đua/khen thưởng</label>
              <Radio.Group name={"type"} onChange={onChange} value={valueType}>
                <Radio value={true}>Khen thưởng</Radio>
                <Radio value={false}>Thi đua</Radio>
              </Radio.Group>
            </Col>
            <Col span={6}>
              <YearPickerField
                placeholder="Chọn ngày"
                label="Năm"
                name="year"
                control={control}
                errors={errors}
                defaultValue={null}
                required={true}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Cơ quan ban hành"
                name={register("agency_issued")}
                control={control}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Danh hiệu"
                name={"award_id"}
                arrayItem={"odata/AvailableCatalogs/Awards"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Ngày Ký"
                name="signing_date"
                control={control}
                defaultValue={null}
                errors={errors}
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
            <Col span={12}>
              <TextArea
                label="Nội dung"
                name={register("content")}
                control={control}
                required={true}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Mức khen thưởng"
                name={register("reward_level")}
                type="number"
                min={0}
                control={control}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Cao nhất"
                name={register("is_highest")}
                type="checkbox"
                control={control}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Thời gian hiệu lực(tháng)"
                name={register("duration")}
                type="number"
                min={0}
                control={control}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Thời gian áp dụng nâng lương trước hạn(tháng)"
                name={register("early_salary_increase")}
                type="number"
                min={0}
                control={control}
                required
                errors={errors}
                defaultValue={0}
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
