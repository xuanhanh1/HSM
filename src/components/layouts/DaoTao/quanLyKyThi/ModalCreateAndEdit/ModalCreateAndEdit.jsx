import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col, Tabs, Checkbox, Divider, Button } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import TreeView from "devextreme-react/tree-view";
import {
  useLocalStorage,
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  DataGrid,
  DataGridOdata,
} from "../../../index";
import { dapAn, mucDo } from "../../../../controller/DataSample";
import {
  getAllRoles,
  updUserRoles,
} from "../../../../../redux/actions/QuanTri";
import { editNhanViens } from "../../../../../redux/actions/DanhMuc";
import SelectFieldMultiple from "../../../../../common/control/componentsForm/SelectMultiple";
import {
  getAllQuestions,
  createTest,
  getAllTest,
} from "../../../../../redux/actions/TaiLieu";
import openNotificationWithIcon from "../../../../../common/notification/notification";

function renderTreeViewItem(item) {
  return (
    <p style={{ color: "black" }}>
      {item.name}
      <p style={{ color: "green" }}>{item.correct_answer}</p>
      <p style={{ color: "green" }}>{item.answerA}</p>
      <p style={{ color: "green" }}>{item.answerB}</p>
      <p style={{ color: "green" }}>{item.answerC}</p>
    </p>
  );
}

const { TabPane } = Tabs;
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, columns, isStatus, nhanVienInfor } = props;
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
  const lstQuestions = useSelector(
    (state) => state.TaiLieuReducer.lstQuestions
  );

  const [pickQuestions, setPickQuestions] = useState([]);
  const [lstPickQuestion, setLisPickQuestion] = useState([]);
  const [urlQuestion, setUrlQuestion] = useState("/odata/Questions");
  const [optionsOdata, setOptionsOdata] = useState({
    filter: [],
    sort: [{ selector: "execution_time", desc: true }],
  });
  useEffect(() => {
    dispatch(getAllQuestions());
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };
  //Submit form
  const onSubmit = async (data) => {
    console.log(data);
    if (isStatus === 0) {
      const result = await dispatch(createTest(data));

      if (result) {
        openNotificationWithIcon("success", "Th??m m???i b??i test th??nh c??ng !");
        setVisible(false);
      } else {
        openNotificationWithIcon("error ", "Th??m b??i test th???t b???i !");
      }
    }
  };

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
  };
  const selectionMultipleRow = (e) => {
    console.log("???? ~ selectionMultipleRow ~ e", e[0]);
    let question_id = e[0];
    setLisPickQuestion(...lstPickQuestion, question_id);
  };
  return (
    <div>
      <Modal
        title={isStatus === 0 ? "Th??m m???i b??i test" : "S???a b??i test"}
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
          <Tabs defaultActiveKey="1">
            <TabPane tab={"Th??ng tin b??i test"} key="1">
              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <Input
                    label="T??n b??i test"
                    name={register("name", { required: true })}
                    control={control}
                    errors={errors}
                    required
                  />
                </Col>
                <Col span={24}>
                  <Input
                    label="N???i dung b??i test"
                    name={register("content", { required: true })}
                    control={control}
                    errors={errors}
                    required
                  />
                </Col>
                <Col span={8}>
                  <Input
                    label="Th???i gian l??m b??i test"
                    name={register("test_time", { required: true })}
                    control={control}
                    errors={errors}
                    required
                    type="number"
                    min={0}
                  />
                </Col>
                <Col span={8}>
                  <Input
                    label="??i???m cao nh???t"
                    name={register("max_score", { required: true })}
                    control={control}
                    errors={errors}
                    required
                  />
                </Col>
                <Col span={8}>
                  <Input
                    label="??i???m th???p nh???t"
                    name={register("min_score", { required: true })}
                    control={control}
                    errors={errors}
                    required
                  />
                </Col>

                <Col span={12}>
                  <Select
                    control={control}
                    label="Kh??a h???c"
                    name={"traning"}
                    arrayItem={"odata/Trainings"}
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
                    name={"creator"}
                    arrayItem={"odata/Students"}
                    valueOpt="id"
                    nameOpt="staff_name"
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <DatePicker
                    label="Ng??y t???o"
                    name="creating_date"
                    control={control}
                    defaultValue={moment()}
                    // required
                    // disabled
                  />
                </Col>
                <Col span={12}>
                  <TextArea label="Ghi ch??" name={register("note")} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={"C??u h???i"} key="2">
              <DataGridOdata
                column={columns}
                urlApi={urlQuestion}
                dataKey={"id"}
                pageSize={20}
                showFilterRow={true}
                // allowView={true}
                selectionChanged={selectionMultipleRow}
                viewObj={handleOpenDrawer}
                options={{ ...optionsOdata }}
              />
            </TabPane>
          </Tabs>
        </form>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {
  columns: PropTypes.array,
};
ModalCreateAndEdit.defaultProps = {
  columns: [
    {
      caption: "T??n kh??a h???c",
      dataField: "name",
      type: 0,
      width: "",
    },
    {
      caption: "M?? h???c vi??n",
      dataField: "content",
      type: 0,
    },
  ],
};

export default ModalCreateAndEdit;
