import React, { useState, } from "react";
import { Modal, Row, Col, } from "antd";
import { useForm } from "react-hook-form";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  _,
  DataGrid,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
} from "../../../index";

function ThemCauHoi(props) {
  const { dataCh, setDataCH, isVisible, setVisibleQuestions, columns } = props
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },

  } = useForm();
  const [allQuestions, setAllQuestions] = useState([])
  const handleCancel = () => {
    setVisibleQuestions(false);
    setDataCH(allQuestions)
  };

  const onSubmit = (data) => {
    let dataQuestions = {
      name: "",
      answerA: "",
      answerC: "",
      answerB: "",
      correct_answer: "",
      question_level_id: "",
      question_type_id: "",
      note: "",
    }
    if (data) {
      setAllQuestions(state => [...state, data])
      setValueReactFormHook(dataQuestions, setValue)
    }
  }

  return (
    <div className="them-cau-hoi">
      <Modal
        title={"Thêm mới câu hỏi"}
        visible={isVisible}
        width={"70vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: "20 % " }}
        footer={[
          <button onClick={handleCancel} className="btnSubmit">
            Xác nhận
          </button>,
          <button
            form="form1"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            Thêm mới câu hỏi
          </button>,
        ]}
      >
        <form className="form1" id="form1" onSubmit={handleSubmit(onSubmit)}>
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
              <TextArea label="Ghi chú" name={register("note")} />
            </Col>
          </Row>

        </form>
        {
          allQuestions && allQuestions.length > 0 ? (
            <>
              <p>Danh sách câu hỏi</p>
              <div className="gridView" style={{ height: "calc(100vh - 375px)" }}>
                <DataGrid
                  column={columns}
                  data={allQuestions}
                />
              </div>
            </>
          ) : null
        }
      </Modal>
    </div>
  );
}

ThemCauHoi.propTypes = {};
ThemCauHoi.defaultProps = {
  columns: [
    {
      caption: "Tên câu hỏi",
      dataField: "name",
    },
    {
      caption: "Đáp án đúng",
      dataField: "correct_answer",
    },
    {
      caption: "Đáp án A",
      dataField: "answerA",
    },
    {
      caption: "Đáp án B",
      dataField: "answerB",
    },
    {
      caption: "Đáp án C",
      dataField: "answerC",
    },
  ],
};
export default ThemCauHoi;
