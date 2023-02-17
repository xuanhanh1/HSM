import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col, Tabs, Checkbox } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  createDepartments,
  getALLDepartments,
  editDepartments,
  createTypesDepartment,
  createStandardTimes,
  EditStandardTimes,
} from "../../../../../redux/actions/DanhMuc";
import {
  useLocalStorage,
  _,
  Select,
  Input,
  TextArea,
  callApi,
  Notification,
  moment,
} from "../../../index";
import MonthPickerField from "../../../../../common/control/componentsForm/MonthPicker";
import openNotificationWithIcon from "../../../../../common/notification/notification";
const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit, urlApi } =
    props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  const [isResult, setResult] = useState(null);
  useEffect(() => {
    //edit phải format date time trước
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isStatus === 1) {
      setValue(
        "time",
        moment()
          .month(objEdit.month - 1)
          .year(objEdit.year)
      );
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  //Submit form
  const onSubmit = (data) => {
    const month = data.time.month() + 1;
    const year = data.time.year();
    if (isStatus === 0) {
      const result = dispatch(
        createStandardTimes({ month: month, year: year, ...data })
      );
      if (result) {
        openNotificationWithIcon("success", "Thêm mới ngày công thành công");
        setVisible(false);
        setObjEdit({});
      }
    } else {
      const result = dispatch(
        EditStandardTimes({
          ...data,
          idEdit: objEdit.id,
          month: month,
          year: year,
        })
      );
      if (result) {
        openNotificationWithIcon("success", "Sửa ngày công thành công");
        setVisible(false);
        setObjEdit({});
      }
    }
  };

  return (
    <div>
      <Modal
        title={
          isStatus === 0 ? t("Thêm ngày tính công") : t("Sửa ngày tính công")
        }
        visible={isVisible}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="form"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("Lưu thông tin")}
          </button>,
        ]}
      >
        <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 4]}>
            <Col span={12}>
              <MonthPickerField
                label="Thời gian"
                name="time"
                defaultValue={null}
                control={control}
                placeholder="Chọn tháng/năm"
                required={true}
                errors={errors}
                disabled={isStatus ? true : false}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Số ngày trong tháng"
                control={control}
                name={register("quantity_day")}
                defaultValue={0}
                type="number"
              />
            </Col>
            <Col span={12}>
              <Input
                label="Số ngày làm việc trong tháng"
                control={control}
                name={register("weekday")}
                defaultValue={0}
                type="number"
              />
            </Col>
            <Col span={12}>
              <Input
                label="Số ngày cuối tuần trong tháng(T7,CN)"
                control={control}
                name={register("weekend")}
                defaultValue={0}
                type="number"
              />
            </Col>
            <Col span={12}>
              <Input
                label="Số ngày lễ tết trong tháng"
                control={control}
                name={register("holiday")}
                defaultValue={0}
                type="number"
              />
            </Col>
            <Col span={12}>
              <TextArea
                label="GHICHU"
                control={control}
                name={register("note")}
              />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
