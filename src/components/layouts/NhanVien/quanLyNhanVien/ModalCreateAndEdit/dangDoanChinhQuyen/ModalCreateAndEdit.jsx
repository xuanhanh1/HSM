import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import YearPickerField from "../../../../../../common/control/componentsForm/YearPicker";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddEmulationRewards,
  AddPartyGovernments,
  EditPartyGovernments,
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
      objEdit.signing_date = _.isNull(objEdit.signing_date)
        ? null
        : moment(objEdit.signing_date);
      objEdit.from = _.isNull(objEdit.from) ? null : moment(objEdit.from);
      objEdit.to = _.isNull(objEdit.to) ? null : moment(objEdit.to);
      setValueReactFormHook(objEdit, setValue);
      setValueType(objEdit.is_position);
    }
  }, []);
  const onSubmit = async (data) => {
    console.log(data);
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddPartyGovernments({
            staff_id: staffId,
            ...data,
            is_position: valueType,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin chức vụ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditPartyGovernments({
            staff_id: objEdit.staff_id,
            ...data,
            is_position: valueType,
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
          AddPartyGovernments({
            staff_id: objParent.id,
            ...data,
            is_position: valueType,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin chức vụ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditPartyGovernments({
            staff_id: objParent.id,
            ...data,
            is_position: valueType,
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
            ? t("Thêm thông tin chức vụ")
            : t("Sửa thông tin chức vụ")
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
            form="formChucVuDang"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formChucVuDang"
          id="formChucVuDang"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <label htmlFor="">Chức vụ Đảng/Đoàn</label>
              <Radio.Group
                control={control}
                name={"is_position"}
                onChange={onChange}
                value={valueType}
              >
                <Radio value={true}>Đảng/Đoàn</Radio>
                <Radio value={false}>Chính quyền</Radio>
              </Radio.Group>
            </Col>
            <Col span={6}>
              <Input
                label="Số quyết định"
                name={register("decision_mumber")}
                control={control}
                required
                errors={errors}
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
              <Input
                label="Người ký"
                name={register("signer")}
                control={control}
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Ngày bắt đầu"
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
                label="Ngày kết thúc "
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
                label="Chức vụ"
                name={"party_position_id"}
                arrayItem={"odata/AvailableCatalogs/PartyGovernmentPositions"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Phụ cấp"
                name={register("allowance_money")}
                type="number"
                min={0}
                step={0.01}
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
