import React, { useEffect, useState, useRef } from "react";
import { Row, Col, } from "antd";
import { useForm } from "react-hook-form";
import {
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
} from "../../../index";

function ThemKhoaHoc(props) {
  const { dataKH, setDataKH, lstStudents } = props;
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const arrWatch = [
    watch().content,
    watch().name,
    watch().training_type_id,
    watch().trainer_id,
    watch().from,
    watch().to,
    watch().creating_date,
    watch().note,
  ];
  useEffect(() => {
    const objNNTH = {
      content: watch().content,
      name: watch().name,
      training_type_id: watch().training_type_id,
      trainer_id: watch().trainer_id,
      from: watch().from,
      to: watch().to,
      creating_date: watch().creating_date,
      note: watch().note,
    };
    setDataKH(objNNTH);
  }, [...arrWatch]);

  return (
    <div className="them-khoa-hoc">
      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Input
            label="Tên khóa học"
            name={register("name", { required: true })}
            control={control}
            errors={errors}
            required
          />
        </Col>
        <Col span={24}>
          <Input
            label="Nội dung khóa học "
            name={register("content", { required: true })}
            control={control}
            errors={errors}
            required
          />
        </Col>
        <Col span={12}>
          <Select
            control={control}
            label="Loại khóa học"
            name={"training_type_id"}
            arrayItem={"odata/TrainingTypes"}
            valueOpt="id"
            nameOpt="name"
            required
            errors={errors}
          />
        </Col>
        <Col span={12}>
          <Select
            control={control}
            label="Người hướng dẫn"
            name={"trainer_id"}
            arrayItem={lstStudents}
            valueOpt="id"
            nameOpt="staff_name"
            required
            errors={errors}
          />
        </Col>
        <Col span={12}>
          <DatePicker
            label="Thời gian bắt đầu"
            name="from"
            control={control}
            defaultValue={moment()}
          />
        </Col>
        <Col span={12}>
          <DatePicker
            label="Thời gian kết thúc"
            name="to"
            control={control}
            defaultValue={moment()}
          />
        </Col>
        <Col span={12}>
          <DatePicker
            label="Ngày tạo"
            name="creating_date"
            control={control}
            defaultValue={moment()}
          />
        </Col>
        <Col span={12}>
          <TextArea label="Ghi chú" name={register("note")} />
        </Col>
      </Row>
    </div>
  );
}

ThemKhoaHoc.propTypes = {};

export default ThemKhoaHoc;
