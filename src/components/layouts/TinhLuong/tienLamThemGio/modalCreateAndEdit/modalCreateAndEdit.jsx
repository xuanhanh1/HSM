import { Col, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getAllMenus } from "../../../../../redux/actions/Menu";
import { setValueReactFormHook } from "../../../../controller/Format";
import { Input, Notification, _ } from "../../../index";
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
        title={
          isStatus === 0
            ? t("Thêm tiền làm thêm giờ")
            : t("Sửa tiền làm thêm giờ")
        }
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
                control={control}
                label="Mã nhân viên"
                name={register("phone")}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label="Tên nhân viên"
                name={register("phone")}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label="Chức vụ"
                name={register("phone")}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label="Khoa/phòng"
                name={register("phone")}
              />
            </Col>
            <Col span={12}>
              <Input
                control={control}
                label="Hệ số lương"
                name={register("phone")}
              />
            </Col>
            <Col span={12}>
              <Input label="Số giờ làm ngày thường" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input label="Tiền ngày thường" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input
                label="Số giờ làm thứ bảy chủ nhật"
                name={register("phone")}
              />
            </Col>
            <Col span={12}>
              <Input label="Tiền thứ 7_cn" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input label="Số giờ làm ngày lễ" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input label="Tiền ngày lễ" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input label="Số giờ làm đêm" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input label="Tiền làm đêm" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input label="Số giờ nghỉ bù" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input label="Tiền nghỉ" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input
                label="Tổng tiền"
                name={register("phone")}
                readOnly={true}
                disabled
              />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
}

export default ModalCreateAndEdit;
