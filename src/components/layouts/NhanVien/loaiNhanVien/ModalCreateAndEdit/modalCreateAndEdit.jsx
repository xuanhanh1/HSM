import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Modal, Row, Tabs } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import { createRoles, editRoles } from "../../../../../redux/actions/QuanTri";
import { getAllMenus } from "../../../../../redux/actions/Menu";
import TreeView from "devextreme-react/tree-view";
import { _, Input, Notification, TextArea } from "../../../index";
import {
  AddStaffTypes,
  EditStaffTypes,
} from "../../../../../redux/actions/Users";
import openNotificationWithIcon from "../../../../../common/notification/notification";
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
    //edit phải format date time trước
    if (isStatus === 1) {
      console.log(objEdit);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
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
  const onSubmit = async (data) => {
    if (isStatus === 0) {
      const result = await dispatch(AddStaffTypes(data));
      if (result) {
        openNotificationWithIcon("success", "Thêm loại cán bộ thành công");
        setVisible(false);
        setObjEdit({});
      }
    } else {
      //edit
      const result = await dispatch(
        EditStaffTypes({ idEdit: objEdit.id, ...data })
      );
      if (result) {
        openNotificationWithIcon("success", "Sửa loại cán bộ thành công");
        setVisible(false);
        setObjEdit({});
      }
    }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("ThemLoaiNV") : t("SuaLoaiNV")}
        visible={isVisible}
        width={"40vw"}
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
            <Col span={24}>
              <Input
                control={control}
                label={"Mã loại cán bộ"}
                name={register("code", { required: true })}
                required
                errors={errors}
              />
            </Col>
            <Col span={24}>
              <Input
                control={control}
                label={"Tên loại cán bộ"}
                name={register("name", { required: true })}
                required
                errors={errors}
              />
            </Col>
            <Col span={4}>
              <Input
                control={control}
                label={"Sử dụng"}
                name={register("is_using")}
                type="checkbox"
              />
            </Col>
            <Col span={20}>
              <TextArea
                label={"Ghi chú"}
                name={register("note")}
                control={control}
              />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
}

export default ModalCreateAndEdit;
