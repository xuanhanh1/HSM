import React, { useEffect, useState } from "react";

import { Row, Col, Tabs, Button } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import {
  Notification,
  _,
  UploadFile,
  DataGrid,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  callApi,
} from "../../../index";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import { uploadTaiLieu } from "../../../../../redux/actions/TaiLieu";
import ThemCauHoi from "./ThemCauHoi";
import { setValueReactFormHook } from "../../../../controller/Format";

const { TabPane } = Tabs;

function ThemTaiLieu(props) {
  const { dataTL, setDataTL, inforHocVien, columns } = props;
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const [isStatusQuestions, setIsStatusQuestions] = useState({
    isVisible: false,
    status: 0,
  });
  const [lstFile, setListFile] = useState([]);
  const [dataCH, setDataCh] = useState([]);
  const dispatch = useDispatch();
  const [document, setDocument] = useState([]);
  const [lstPickDocument, setLstPickDocument] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(watch().training_id)) {
      setDocument([]);
      callApi(`odata/Trainings/GetById?key=${watch().training_id}`, "GET").then(
        (res) => {
          setDocument(res.data[0].documents);
        }
      );
    }
  }, [watch().training_id]);

  useEffect(() => {
    if (!_.isEmpty(watch().document)) {
      let isExists = _.some(lstPickDocument, (x) => x === watch().document);
      if (isExists) {
        Notification("warning", "Tài liệu đã được chọn !");
      } else {
        let pickDocument = _.filter(document, (x) => x.id === watch().document);
        setLstPickDocument([...lstPickDocument, { ...pickDocument[0] }]);
      }
    }
  }, [watch().document]);

  useEffect(() => {
    let arr = [];
    if (lstPickDocument.length > 0) {
      lstPickDocument.forEach((item) => {
        arr.push({ document_id: item.id });
      });
      setDataTL(arr);
    }
  }, [lstPickDocument]);

  const listFileUpload = (e) => {
    let arr = [];
    _.map(e, (item, index) => {
      arr.push(item.originFileObj);
    });

    setListFile(arr);
  };

  const handleOpenModalQuestions = (status) => {
    setIsStatusQuestions({
      isVisible: true,
      status,
    });
  };

  const UploadDocuments = async () => {
    let obj_empty = {
      ten_tl: "",
      level: "",
      content: "",
    };
    let data_document = {
      ten_tl: watch().ten_tl,
      CreateDate: watch().CreateDate,
      level: watch().level,
      content: watch().content,
    };
    if (lstFile.length > 0) {
      let formData = new FormData();
      _.map(lstFile, (item) => {
        formData.append("files", item);
      });
      let result = await dispatch(
        uploadTaiLieu(
          {
            ...data_document,
            fd: formData,
            creator_id: inforHocVien.id,
            dataCH: dataCH,
          }
          // setVisible
        )
      );
      if (result) {
        setLstPickDocument([...lstPickDocument, { ...result }]);
        setValueReactFormHook(obj_empty, setValue);
        setListFile();
      }
    } else {
      openNotificationWithIcon("warning", "Vui lòng thêm tài liệu");
    }
  };
  return (
    <div className="them-tai-lieu">
      <Tabs defaultActiveKey="1" tabPosition={"left"}>
        <TabPane tab={"Thêm mới tài liệu"} key="1">
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Input
                label="Tên tài liệu"
                control={control}
                errors={errors}
                name={register("ten_tl", { required: true })}
                required
              />
            </Col>
            <Col span={12}>
              <DatePicker
                label="Ngày tạo"
                name="CreateDate"
                control={control}
                defaultValue={moment()}
                disabled
              />
            </Col>
            <Col span={12}>
              <Select
                control={control}
                label="Cấp độ tài liệu"
                name={"level"}
                arrayItem={"odata/DocumentLevels"}
                valueOpt="id"
                nameOpt="name"
                errors={errors}
              />
            </Col>
            <Col span={24}>
              <TextArea
                name={register("content")}
                label={"Nội dung tài liệu"}
              />
            </Col>
            <Col span={8}>
              <UploadFile
                label="File tài liệu (file <Col 10MB)"
                listFile={listFileUpload}
                fileType={[".docx", ".pdf", ".jpg", ".png", ".mp4"]}
              />
            </Col>
            <Col span={8}>
              <label>Thêm câu hỏi</label>
              <br></br>
              <Button style={{}} onClick={() => handleOpenModalQuestions(0)}>
                Add Questions
              </Button>
            </Col>
            <Col span={8}>
              <label></label> <br></br>
              <Button type="primary" onClick={() => UploadDocuments(0)}>
                Cập nhật tài liệu
              </Button>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={"Tài liệu đã có "} key={2}>
          <Col span={12}>
            <Select
              control={control}
              label="Khóa học"
              name="training_id"
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
              label="Tên tài liệu"
              name="document"
              arrayItem={document}
              valueOpt="id"
              nameOpt="name"
              required
              errors={errors}
            />
          </Col>
        </TabPane>
      </Tabs>

      {lstPickDocument && lstPickDocument.length > 0 ? (
        <>
          <p>Danh sách tài liệu khóa học </p>
          <div className="gridView" style={{ height: "calc(100vh - 475px)" }}>
            <DataGrid column={columns} data={lstPickDocument} />
          </div>
        </>
      ) : null}

      {isStatusQuestions.isVisible ? (
        <ThemCauHoi
          isVisible={isStatusQuestions.isVisible}
          setVisibleQuestions={setIsStatusQuestions}
          isStatus={isStatusQuestions.status}
          dataCH={dataCH}
          setDataCH={setDataCh}
          // objEdit={isObjEdit}
          // setObjEdit={setObjEdit}
        />
      ) : null}
    </div>
  );
}

ThemTaiLieu.propTypes = {};

ThemTaiLieu.defaultProps = {
  columns: [
    {
      caption: "Tên tài liệu",
      dataField: "name",
    },
    {
      caption: "Nội dung tài liệu",
      dataField: "content",
    },
    {
      caption: "Cấp độ tài liệu",
      dataField: "level_name",
    },
    {
      caption: "Ngày tạo",
      dataField: "create_date",
      format: "date",
    },
  ],
};

export default ThemTaiLieu;
