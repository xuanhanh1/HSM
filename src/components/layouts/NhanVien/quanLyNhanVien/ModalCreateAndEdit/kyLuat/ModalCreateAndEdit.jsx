import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddAllowances,
  AddDiscipline,
  EditDiscipline,
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
  const [high, setHigh] = useState(true);
  const onChange = (e) => {
    setHigh(e.target.value);
  };
  useEffect(() => {
    //edit phải format date time trước
    if (isStatus === 1) {
      objEdit.signing_date = _.isNull(objEdit.signing_date)
        ? null
        : moment(objEdit.signing_date);
      setValueReactFormHook(objEdit, setValue);
      setHigh(objEdit.is_highest);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddDiscipline({
            staff_id: staffId,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin kỷ luật thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditDiscipline({
            id: objEdit.id,
            staff_id: objEdit.staff_id,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin kỷ luật thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddDiscipline({
            staff_id: objParent.id,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin kỷ luật thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditDiscipline({
            id: objEdit.id,
            staff_id: objParent.id,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin kỷ luật thành công"
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
            ? t("Thêm thông tin kỷ luật ")
            : t("Sửa thông tin kỷ luật")
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
            form="formKyLuat"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formKyLuat"
          id="formKyLuat"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[8, 0]}>
            <Col span={6}>
              <Select
                label="Hình thức kỷ luật"
                name={"form_id"}
                arrayItem={"odata/AvailableCatalogs/DisciplineForms"}
                valueOpt="id"
                nameOpt="name"
                control={control}
                required
                errors={errors}
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
                label="Số quyết định"
                control={control}
                name={register("decision_number")}
              />
            </Col>

            <Col span={6}>
              <Input
                label="Thời hạn hiệu lực(tháng)"
                name={register("duration")}
                type="number"
                min={0}
                control={control}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Thời gian kéo dài nâng lương (số tháng)"
                name={register("delay_salary_increase")}
                type="number"
                min={0}
                control={control}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <label htmlFor="">Mức kỷ luật</label>
              <Radio.Group
                name={"is_highest"}
                onChange={onChange}
                control={control}
                value={high}
              >
                <Radio value={true}>Cao nhất</Radio>
                <Radio value={false}>Không cao nhất</Radio>
              </Radio.Group>
            </Col>
            <Col span={6}>
              <TextArea
                label="Nội dung"
                name={register("content")}
                control={control}
                required={true}
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
