import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col, Tabs } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  useLocalStorage,
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  callApi,
} from "../../../index";
import { createTrainning, editTrainning } from "../../../../../redux/actions/TaiLieu";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import ThemHocVien from "./ThemHocVien";
import ThemTaiLieu from "./ThemTaiLieu";

const { TabPane } = Tabs;
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus } = props;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },

  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [lstStudents, setLstStudents] = useState([])
  const [inforHocVien, setInforHocVien] = useLocalStorage("inforStudent", {});
  const [lstAll, setLstAll] = useState([]);
  const [dataHV, setDataHV] = useState({})
  const [dataTL, setDataTL] = useState({});

  useEffect(() => {
    callApi("odata/Students", "GET").then((res) => {
      setLstStudents(res.data)
      setLstAll(res.data)
    });
  }, []);

  useEffect(() => {
    let obj = {
      name: objEdit.name,
      content: objEdit.content,
      training_type_id: objEdit.training_type_id,
      trainer_id: objEdit.trainer_id,
      note: objEdit.note,
      from: moment(objEdit.from),
      to: moment(objEdit.to),
      creating_date: moment(objEdit.create_date),
    }
    if (isStatus === 1) {
      setValueReactFormHook(obj, setValue);
    }
  }, [])

  const handleCancel = () => {
    setVisible(false);
  };

  //Submit form
  const onSubmit = async (data) => {
    let formData = new FormData();
    _.map(dataTL, (item) => {
      formData.append("files", item);
    });
    let dataSend = {
      ...objEdit,
      ...data,
      documents: dataTL,
      creator_id: inforHocVien.id,
      students: dataHV,
      fd: formData,
    }
    if (isStatus === 0) {
      //them moi
      const result = await dispatch(createTrainning(dataSend));
      if (result) {
        openNotificationWithIcon("success", "Thêm mới khóa học thành công ");
      } else {
        openNotificationWithIcon("error", "Thêm mới khóa học không thành công");
      }
      setVisible(false);
    } else {
      //edit
      const result = await dispatch(editTrainning(dataSend));
      if (result) {
        openNotificationWithIcon("success", "Sửa khóa học thành công");
        setVisible(false)
      } else {
        openNotificationWithIcon("error", "Sửa khóa học không thành công ")
      }
    }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? "Thêm mới khóa học" : "Sửa khóa học"}
        visible={isVisible}
        width={"70vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: "20 % " }}
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
          <Tabs defaultActiveKey="1">
            <TabPane tab={"Nội dung khóa học"} key="1">
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
            </TabPane>
            <TabPane tab={"Học viên"} key="2">
              <ThemHocVien dataHV={dataHV} setDataHV={setDataHV} lstStudents={lstStudents}></ThemHocVien>
            </TabPane>
            <TabPane tab={"Tài liệu"} key="3">
              <ThemTaiLieu dataTL={dataTL} setDataTL={setDataTL} inforHocVien={inforHocVien} ></ThemTaiLieu>
            </TabPane>
          </Tabs>
        </form>
      </Modal>
    </div >
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
