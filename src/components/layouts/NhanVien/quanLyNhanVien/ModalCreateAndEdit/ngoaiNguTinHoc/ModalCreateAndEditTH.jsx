import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddAllowances,
  addComputing,
  AddDiscipline,
  EditComputing,
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
const ModalCreateAndEditTH = (props) => {
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
  const [high, setHigh] = useState(false);
  const onChange = (e) => {
    setHigh(e.target.value);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    //edit phải format date time trước
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
      setHigh(objEdit.is_highest);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          addComputing({
            staff_id: staffId,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin tin học thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        console.log(objEdit);
        const result = await dispatch(
          EditComputing({
            id: objEdit.id,
            staff_id: objEdit.staff_id,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin tin học thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          addComputing({
            staff_id: objParent.id,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin tin học thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        console.log(objEdit);
        const result = await dispatch(
          EditComputing({
            id: objEdit.id,
            staff_id: objParent.id,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin tin học thành công"
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
            ? t("Thêm thông tin tin học ")
            : t("Sửa thông tin tin học")
        }
        visible={isVisible}
        centered={true}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 10, bottom: 10 }}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="formTH"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form className="formTH" id="formTH" onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[8, 0]}>
            <Col span={6}>
              <Select
                control={control}
                label="Cấp độ"
                name={"level_id"}
                arrayItem={"odata/AvailableCatalogs/ComputingLevels"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Select
                control={control}
                label="Loại văn bằng"
                name={"degree_type_id"}
                arrayItem={"odata/AvailableCatalogs/DegreeTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <label htmlFor="">Cao nhất</label>
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

ModalCreateAndEditTH.propTypes = {};

export default ModalCreateAndEditTH;
