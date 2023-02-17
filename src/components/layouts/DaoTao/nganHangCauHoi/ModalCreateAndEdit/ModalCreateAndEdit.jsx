import React, { useEffect, } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col, } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
} from "../../../index";
import { dapAn, mucDo } from "../../../../controller/DataSample";
import {
  getAllRoles,
  updUserRoles,
} from "../../../../../redux/actions/QuanTri";
import { editNhanViens } from "../../../../../redux/actions/DanhMuc";
import SelectFieldMultiple from "../../../../../common/control/componentsForm/SelectMultiple";
import {
  uploadQuestion,
  editQuestion,
} from "../../../../../redux/actions/TaiLieu";
import openNotificationWithIcon from "../../../../../common/notification/notification";

// const { TabPane } = Tabs;
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // useEffect(() => {
  //   callApi(`odata/QuestionLevels`, "GET").then((res) => {
  //     setValue("question_level_id", res.data[0].id);
  //   });
  // }, []);
  // useEffect(() => {
  //   callApi(`odata/QuestionTypes`, "GET").then((res) => {
  //     setValue("question_type_id", res.data[0].id);
  //   });
  // }, []);

  useEffect(() => {
    if (isStatus === 1) {
      objEdit.create_date = moment(objEdit.create_date);
      setValue("question_level_id", objEdit.level_id);
      setValue("question_type_id", objEdit.type_id);
      setValue("CREATE_DATE", objEdit.create_date);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };
  //Submit form
  const onSubmit = async (data) => {
  console.log("🚀 ~ onSubmit ~ data", data)
    if (isStatus === 0) {
      //them moi
      const result = await dispatch(uploadQuestion(data));
      if (result) {
        openNotificationWithIcon("success", "Thêm mới câu hỏi thành công");
        setVisible(false);
      } else {
        openNotificationWithIcon("error", "Thêm mới câu hỏi không thành công");
      }
    } else {
      //edit
      const result = await dispatch(editQuestion(data));
      if (result) {
        setObjEdit(data)
        openNotificationWithIcon("success", "Sửa câu hỏi thành công");
        setVisible(false);
      }
    }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("ThemCauHoi") : "Sửa câu hỏi"}
        visible={isVisible}
        width={"70vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: "50 % " }}
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
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Input
                label="Câu hỏi "
                name={register("name", { required: true })}
                control={control}
                errors={errors}
                required
              />
            </Col>
            <Col span={12}>
              <Input
                label="Đáp án "
                name={register("answerA", { required: true })}
                control={control}
                errors={errors}
                required
              />
            </Col>
            <Col span={12}>
              <Input
                label="Đáp án"
                name={register("answerB", { required: true })}
                control={control}
                errors={errors}
                required
              />
            </Col>
            <Col span={12}>
              <Input
                label="Đáp án"
                name={register("answerC", { required: true })}
                control={control}
                errors={errors}
                required
              />
            </Col>
            <Col span={12}>
              <Input
                label="Đáp án đúng"
                name={register("correct_answer", { required: true })}
                control={control}
                errors={errors}
                required
              />
            </Col>

            <Col span={12}>
              <DatePicker
                label="Ngày tạo"
                name="CREATE_DATE"
                control={control}
                defaultValue={moment()}
                // required
                disabled
              />
            </Col>

            <Col span={12}>
              <Select
                control={control}
                label="Mức độ câu hỏi"
                name={"question_level_id"}
                arrayItem={"odata/QuestionLevels"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Select
                control={control}
                label="Loại câu hỏi"
                name={"question_type_id"}
                arrayItem={"odata/QuestionTypes"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Select
                control={control}
                label="Tài liệu"
                name={"document_id"}
                arrayItem={"odata/Documents"}
                valueOpt="id"
                nameOpt="name"
                required
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <TextArea label="Ghi chú" name={register("note")} />
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
