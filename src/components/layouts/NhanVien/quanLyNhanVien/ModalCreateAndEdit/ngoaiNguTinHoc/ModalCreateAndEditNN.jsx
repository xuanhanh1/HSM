import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  addForeignLanguage,
  EditForeignLanguage,
} from "../../../../../../redux/actions/Users";
import { setValueReactFormHook } from "../../../../../controller/Format";
import { Input, Select, TextArea } from "../../../../index";
const ModalCreateAndEditNN = (props) => {
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
          addForeignLanguage({
            staff_id: staffId,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin ngoại ngữ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditForeignLanguage({
            staff_id: objEdit.staff_id,
            ...data,
            id: objEdit.id,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin ngoại ngữ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          addForeignLanguage({
            staff_id: objParent.id,
            ...data,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin ngoại ngữ thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditForeignLanguage({
            staff_id: objParent.id,
            ...data,
            id: objEdit.id,
            is_highest: high,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin ngoại ngữ thành công"
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
            ? t("Thêm thông tin ngoại ngữ ")
            : t("Sửa thông tin ngoại ngữ")
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
            form="formNN"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form className="formNN" id="formNN" onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[8, 0]}>
            <Col span={6}>
              <Select
                control={control}
                label="Loại ngôn ngữ"
                name={"language_type_id"}
                arrayItem={"odata/AvailableCatalogs/ForeignLanguageTypes"}
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
              <Select
                control={control}
                label="Cấp độ"
                name={"level_id"}
                arrayItem={"odata/AvailableCatalogs/ForeignLanguageLevels"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Điểm"
                name={register("mark")}
                type="number"
                min={0}
                control={control}
                defaultValue={0}
                step={0.01}
              />
            </Col>
            <Col span={6}>
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

ModalCreateAndEditNN.propTypes = {};

export default ModalCreateAndEditNN;
