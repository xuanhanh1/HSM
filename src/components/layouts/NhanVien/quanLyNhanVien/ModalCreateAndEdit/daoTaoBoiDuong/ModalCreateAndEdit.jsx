import { Col, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddAllowances,
  AddCultivates,
  AddDiscipline,
  EditCultivates,
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
  const [boiduong, setBoiduong] = useState(true);
  const onChangeBoiDuong = (e) => {
    setBoiduong(e.target.value);
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
      setBoiduong(objEdit.type);
    }
  }, []);
  const onSubmit = async (data) => {
    if (isParentStatus === 0) {
      if (isStatus === 0) {
        const result = await dispatch(
          AddCultivates({
            staff_id: staffId,
            ...data,
            type: boiduong,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin đào tạo bồi dưỡng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditCultivates({
            staff_id: objEdit.staff_id,
            ...data,
            id: objEdit.id,
            type: boiduong,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin đào tạo bồi dưỡng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      }
    } else {
      if (isStatus === 0) {
        const result = await dispatch(
          AddCultivates({
            staff_id: objParent.id,
            ...data,
            type: boiduong,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Thêm thông tin đào tạo bồi dưỡng thành công"
          );
          setVisible(false);
          setObjEdit({});
        }
      } else {
        const result = await dispatch(
          EditCultivates({
            staff_id: objParent.id,
            ...data,
            id: objEdit.id,
            type: boiduong,
          })
        );
        if (result) {
          openNotificationWithIcon(
            "success",
            "Sửa thông tin đào tạo bồi dưỡng thành công"
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
            ? t("Thêm thông tin đào tạo bồi dưỡng ")
            : t("Sửa thông tin đào tạo bồi dưỡng")
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
            form="formDaoTaoBoiDuong"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form
          className="formDaoTaoBoiDuong"
          id="formDaoTaoBoiDuong"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={[8, 0]}>
            <Col span={6}>
              <label htmlFor="">Kiểu bồi dưỡng</label>
              <Radio.Group
                name={"type"}
                onChange={onChangeBoiDuong}
                value={boiduong}
              >
                <Radio value={true}>Đào tạo iên tục</Radio>
                <Radio value={false}>Thông thường</Radio>
              </Radio.Group>
            </Col>
            <Col span={6}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Từ ngày"
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
                label="Đến ngày"
                name="to"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Số tiết học"
                name={register("lesson")}
                type="number"
                min={0}
                step={0.01}
                defaultValue={0}
              />
            </Col>
            <Col span={6}>
              <Input
                label="Số văn bằng chứng chỉ"
                name={register("degree_number")}
              />
            </Col>
            <Col span={6}>
              <Input label="Tên chứng chỉ" name={register("degree_name")} />
            </Col>
            <Col span={12}>
              <Select
                control={control}
                label="Cơ sở đào tạo"
                name={"place_id"}
                arrayItem={"odata/AvailableCatalogs/EducatePlaces"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input label="Người ký" name={register("signer")} />
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

            <Col span={12}>
              <Select
                control={control}
                label="Nguồn kinh phí"
                name={"fund_id"}
                arrayItem={"odata/AvailableCatalogs/EducateFunds"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <TextArea label="Nội dung" name={register("content")} />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

ModalCreateAndEdit.propTypes = {};

export default ModalCreateAndEdit;
