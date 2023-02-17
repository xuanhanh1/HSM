import { Col, Modal, Row } from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddSalaryInfors,
  EditSalaryInfors,
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
      objEdit.benefit_date = _.isNull(objEdit.benefit_date)
        ? null
        : moment(objEdit.benefit_date);
      objEdit.career_start_date = _.isNull(objEdit.career_start_date)
        ? null
        : moment(objEdit.career_start_date);
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
          AddSalaryInfors({
            staff_id: staffId,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin lương thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        //edit
        const result = await dispatch(
          EditSalaryInfors({
            staff_id: objEdit.staff_id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon("success", "Sửa thông tin lương thành công");
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddSalaryInfors({
            staff_id: objParent.id,
            ...data,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin lương thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        //edit
        const result = await dispatch(
          EditSalaryInfors({
            staff_id: objParent.id,
            ...data,
            id: objEdit.id,
          })
        );
        if (result) {
          openNotificationWithIcon("success", "Sửa thông tin lương thành công");
          setVisible(false);
          setObjEdit({});
        }
      }
    }
  };
  console.log(watch().is_probationary);

  return (
    <div>
      <Modal
        title={
          isStatus === 0 ? t("Thêm thông tin lương ") : t("Sửa thông tin lương")
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
            form="formThongTinLuong"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formThongTinLuong"
          id="formThongTinLuong"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[8, 0]}>
            <Col span={6}>
              <Select
                control={control}
                label="Kiểu nâng lương"
                name={"salary_increase_type_id"}
                arrayItem={"odata/AvailableCatalogs/SalaryIncreaseTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Kiểu bảng lương"
                name={"salary_sheet_type_id"}
                arrayItem={"odata/AvailableCatalogs/SalarySheetTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input label="Số quyết định" name={register("decision_number")} />
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
              <Input label="Người ký" name={register("signer")} />
            </Col>
            <Col span={6}>
              <DatePicker
                control={control}
                placeholder="Chọn ngày"
                label="Ngày hưởng"
                name="benefit_date"
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>

            <Col span={6}>
              <Input
                control={control}
                label="Tập sự"
                name={register("is_probationary")}
                type="checkbox"
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Nghạch/Chức danh nghê nghiệp"
                name={"career_title_id"}
                arrayItem={"odata/AvailableCatalogs/CareerTitles"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>

            <Col span={6}>
              <DatePicker
                control={control}
                placeholder="Chọn ngày"
                label="Ngày giữ nghạch"
                name="career_start_date"
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            {/*  */}
            <Col span={6}>
              <Input
                control={control}
                required
                errors={errors}
                label="Bậc lương"
                name={register("salary_level")}
                type="number"
                min={0}
                defaultValue={0}
                step={1}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                required
                errors={errors}
                label="Hệ số lương"
                name={register("salary_coef")}
                type="number"
                min={0}
                defaultValue={0}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Vượt khung"
                name={register("is_seniority")}
                type="checkbox"
              />
            </Col>
            <Col span={6}>
              <Input
                label="Hệ số thâm niêm vượt khung"
                name={register("seniority_coef")}
                type="number"
                min={0}
                defaultValue={0}
                control={control}
                // required
                errors={errors}
                step={1}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                required
                errors={errors}
                label="Hệ số chức vụ"
                name={register("position_coef")}
                type="number"
                min={0}
                defaultValue={0}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Hệ số trách nhiệm công việc"
                name={register("responsibility_coef")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={0.01}
              />
            </Col>

            <Col span={6}>
              <Input
                control={control}
                label="Hệ số ưu đãi"
                name={register("favour_coef")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Hệ số độc hại"
                name={register("toxic_coef")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Hệ số đặc thù"
                name={register("special_coef")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Điểm chức vụ"
                name={register("position_mark")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Điểm trình độ"
                name={register("degree_mark")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Điểm phân loại"
                name={register("classify_mark")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={0.01}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Tiền công đoàn"
                name={register("labor_union_fee")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={1}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Thời gian nâng (năm)"
                name={register("salary_increase_time")}
                type="number"
                min={0}
                defaultValue={0}
                required
                errors={errors}
                step={1}
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
