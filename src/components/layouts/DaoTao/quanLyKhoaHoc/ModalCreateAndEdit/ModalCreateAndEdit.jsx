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
        openNotificationWithIcon("success", "Th??m m???i kh??a h???c th??nh c??ng ");
      } else {
        openNotificationWithIcon("error", "Th??m m???i kh??a h???c kh??ng th??nh c??ng");
      }
      setVisible(false);
    } else {
      //edit
      const result = await dispatch(editTrainning(dataSend));
      if (result) {
        openNotificationWithIcon("success", "S???a kh??a h???c th??nh c??ng");
        setVisible(false)
      } else {
        openNotificationWithIcon("error", "S???a kh??a h???c kh??ng th??nh c??ng ")
      }
    }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? "Th??m m???i kh??a h???c" : "S???a kh??a h???c"}
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
            <TabPane tab={"N???i dung kh??a h???c"} key="1">
              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <Input
                    label="T??n kh??a h???c"
                    name={register("name", { required: true })}
                    control={control}
                    errors={errors}
                    required
                  />
                </Col>
                <Col span={24}>
                  <Input
                    label="N???i dung kh??a h???c "
                    name={register("content", { required: true })}
                    control={control}
                    errors={errors}
                    required
                  />
                </Col>
                <Col span={12}>
                  <Select
                    control={control}
                    label="Lo???i kh??a h???c"
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
                    label="Ng?????i h?????ng d???n"
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
                    label="Th???i gian b???t ?????u"
                    name="from"
                    control={control}
                    defaultValue={moment()}
                  />
                </Col>
                <Col span={12}>
                  <DatePicker
                    label="Th???i gian k???t th??c"
                    name="to"
                    control={control}
                    defaultValue={moment()}
                  />
                </Col>
                <Col span={12}>
                  <DatePicker
                    label="Ng??y t???o"
                    name="creating_date"
                    control={control}
                    defaultValue={moment()}
                  />
                </Col>
                <Col span={12}>
                  <TextArea label="Ghi ch??" name={register("note")} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={"H???c vi??n"} key="2">
              <ThemHocVien dataHV={dataHV} setDataHV={setDataHV} lstStudents={lstStudents}></ThemHocVien>
            </TabPane>
            <TabPane tab={"T??i li???u"} key="3">
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
