import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  createPositions,
  editPositions,
} from "../../../../../redux/actions/DanhMuc";
import {
  useLocalStorage,
  _,
  Input,
  TextArea,
  Notification,
} from "../../../index";
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  const [isResult, setResult] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (!_.isNull(isResult)) {
      isResult.then((result) => {
        if (result) {
          setVisible(false);
        } else {
          Notification("error", "Cập nhật không thành công");
        }
      });
    }
  }, [isResult]);
  //Submit form
  const onSubmit = (data) => {
    if (isStatus === 0) {
      //Thêm mới
      setResult(
        dispatch(createPositions({ ...data, hostpital_id: isBenhVienId }))
      );
    } else {
      //Sửa
      setResult(dispatch(editPositions(data)));
      setObjEdit({});
    }
    setVisible(false);
  };
  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("ThemCV") : t("SuaCV")}
        visible={isVisible}
        width={"40vw"}
        onCancel={handleCancel}
        maskClosable={false}
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
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="ChucVu"
                name={register("name", { required: true })}
                required={true}
                errors={errors}
              />
              <Input
                label="Mã chức vụ"
                name={register("code", { required: true })}
                required={true}
                errors={errors}
              />
              <TextArea label="GHICHU" name={register("note")} />
            </form>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
