import { Col, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import { uploadTaiLieu } from "../../../../../redux/actions/TaiLieu";
import { editTaiLieu } from "../../../../../redux/actions/TaiLieu";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  callApi,
  DatePicker,
  Input,
  moment,
  UploadFile,
  TextArea,
  Select,
  _,
} from "../../../index";

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, inforHocVien } = props;
  const [lstFile, setListFile] = useState([]);
  const {
    handleSubmit,
    setValue,
    control,
    register,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    callApi("odata/Trainings", "GET").then((res) => {
      setValue("KHOAHOCID", res.data[0]?.id);
    });
  }, []);
  useEffect(() => {
    let dataEdit = {
      ten_tl: objEdit.nameTL,
      CreateDate: moment(objEdit.create_date),
      content: objEdit.content,
      creator_id: objEdit.creator_id ? objEdit.creator_id : inforHocVien,
      ...objEdit,
    };
    if (isStatus === 1) {
      setValue("level", objEdit.level_id);
      setValueReactFormHook(dataEdit, setValue);
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };
  //Submit form
  const onSubmit = async (data) => {
    console.log("🚀 ~ onSubmit ~ data", data);
    let dataEdit = {
      ...data,
      creator_id: data.creator_id ? data.creator_id : inforHocVien.id,
      document_level_id: data.level,
      document_type_id: "f6242438-843a-49b8-a114-adba007ae42f",
    };
    if (isStatus === 0) {
      if (lstFile.length > 0) {
        let formData = new FormData();
        _.map(lstFile, (item) => {
          formData.append("files", item);
        });
        let result = await dispatch(uploadTaiLieu({ ...data, fd: formData }));
        if (result) {
          openNotificationWithIcon("success", "Thêm tài liệu thành công ");
          setVisible(false);
        }
      } else {
        openNotificationWithIcon("warning", "Vui lòng thêm tài liệu");
      }
    } else {
      //sửa
      let result = await dispatch(
        editTaiLieu({
          ...dataEdit,
          id: objEdit.id,
          creator_id: inforHocVien.id,
        })
      );
      if (result) {
        openNotificationWithIcon("success", "Sửa tài liệu thành công ");
        setVisible(false);
      } else {
        openNotificationWithIcon("error", "Sửa tài liệu thất bại");
      }
    }
  };
  const listFileUpload = (e) => {
    let arr = [];
    _.map(e, (item, index) => {
      arr.push(item.originFileObj);
    });
    setListFile(arr);
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("ThemTL") : t("SuaTL")}
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
            <Col span={12}>
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
                label="Khóa học"
                name={"KHOAHOCID"}
                arrayItem={"odata/Trainings"}
                valueOpt="id"
                nameOpt="name"
                errors={errors}
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
            <Col span={12}>
              <UploadFile
                label="File tài liệu (file <Col 10MB)"
                listFile={listFileUpload}
                fileType={[".docx", ".pdf", ".jpg", ".png", ".mp4"]}
              />
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
