import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddAllowances,
  AddDiscipline,
  AddLaborContracts,
  EditDiscipline,
  EditLaborContracts,
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
  const [high, setHigh] = useState(null);
  const onChange = (e) => {
    setHigh(e.target.value);
  };
  useEffect(() => {
    //edit phải format date time trước
    if (isStatus === 1) {
      objEdit.from = _.isNull(objEdit.from) ? null : moment(objEdit.from);
      objEdit.to = _.isNull(objEdit.to) ? null : moment(objEdit.to);
      objEdit.signing_date = _.isNull(objEdit.signing_date)
        ? null
        : moment(objEdit.signing_date);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddLaborContracts({
            staff_id: staffId,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin hợp đồng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditLaborContracts({
            staff_id: objEdit.staff_id,
            ...data,
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
          AddLaborContracts({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin hợp đồng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditLaborContracts({
            staff_id: objParent.id,
            ...data,
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
            ? t("Thêm thông tin hợp đồng ")
            : t("Sửa thông tin hợp đồng")
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
            form="formHopDong"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formHopDong"
          id="formHopDong"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[8, 0]}>
            <Col span={6}>
              <Input
                label="Số hợp đồng"
                name={register("number", { required: true })}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Người ký"
                name={register("signer", { required: true })}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                control={control}
                placeholder="Chọn ngày"
                label="Ngày ký"
                name="signing_date"
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>

            <Col span={6}>
              <DatePicker
                control={control}
                placeholder="Chọn ngày"
                label="Ngày hiệu lực"
                name="from"
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Ngày kết thúc"
                name="to"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Mức lương"
                name={register("salary_level")}
                control={control}
                type="number"
                min={0}
                step={0.01}
                defaultValue={0}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Chức danh nghề nghiệp"
                name={register("career_titles", { required: true })}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Bậc"
                name={register("level")}
                control={control}
                type="number"
                min={0}
                step={0.01}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Hệ số"
                name={register("coeff")}
                control={control}
                type="number"
                min={0}
                step={0.01}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Loại hợp đồng"
                name={"type_id"}
                arrayItem={"odata/AvailableCatalogs/LaborContractTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Hiệu lực"
                name={register("is_valid")}
                type="checkbox"
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
