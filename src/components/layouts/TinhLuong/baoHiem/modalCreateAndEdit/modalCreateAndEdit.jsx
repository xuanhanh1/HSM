import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Modal, Row, Tabs } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import { createRoles, editRoles } from "../../../../../redux/actions/QuanTri";
import { getAllMenus } from "../../../../../redux/actions/Menu";
import TreeView from "devextreme-react/tree-view";
import {
  _,
  Input,
  Notification,
  TextArea,
  DatePicker,
  moment,
} from "../../../index";
const { TabPane } = Tabs;

function renderTreeViewItem(item) {
  return `${item.TEN_MENU}`;
}
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
  const [isResult, setResult] = useState(null);
  //Các danh sách select option
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getAllMenus());
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
          setObjEdit({});
          setVisible(false);
        } else {
          Notification("error", "Cập nhật không thành công !");
        }
      });
    }
  }, [isResult]);
  //Submit form
  const onSubmit = (data) => {
    console.log(data);
    // if (isStatus === 0) {
    //   //Thêm mới
    //   setResult();
    // } else {
    //   //Sửa
    //   setResult();
    // }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("Thêm bảo hiểm") : t("Sửa bảo hiểm")}
        visible={isVisible}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 20 }}
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
          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Input
                label="Mã cán bộ"
                name={register("place_of_issue")}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Tên cán bộ"
                name={register("place_of_issue")}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Số BHYT"
                name={register("place_of_issue")}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Số BHXH"
                name={register("place_of_issue")}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Nơi cấp"
                name={register("place_of_issue")}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Nơi đăng ký khám chữa bệnh"
                name={register("place_of_issue")}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Trạng thái sổ"
                name={register("place_of_issue")}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <TextArea label="Ghi chú" name={register("place_of_issue")} />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
}

export default ModalCreateAndEdit;
