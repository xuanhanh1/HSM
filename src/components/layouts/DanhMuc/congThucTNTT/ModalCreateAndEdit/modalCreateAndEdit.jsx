import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  AddExtraSalaryFormulas,
  createPositions,
  editPositions,
} from "../../../../../redux/actions/DanhMuc";
import {
  useLocalStorage,
  _,
  Input,
  TextArea,
  Notification,
  Select,
  callApi,
} from "../../../index";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import SelectMultiple from "../../../../../common/control/componentsForm/SelectMultiple";
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [multiOptions, setMultiOption] = useState([]);
  useEffect(() => {
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  useEffect(() => {
    callApi("odata/Positions").then((res) => {
      setMultiOption(res.data.value);
    });
  }, []);
  const handleCancel = () => {
    setVisible(false);
  };

  //Submit form
  const onSubmit = async (data) => {
    const dataSend = {
      name: data.name,
      is_using: true,
      list_rate_positions: data.position_id.map((item) => {
        return {
          extra_salary_formula_id: data.extra_salary_formula_id,
          rate: data.rate,
          position_id: item,
        };
      }),
    };
    if (isStatus === 0) {
      const result = await dispatch(AddExtraSalaryFormulas(dataSend));
      if (result) {
        openNotificationWithIcon(
          "success",
          "Thêm mới công thức tính thu nhập tăng thêm thành công"
        );
        setVisible(false);
      }
    } else {
    }
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
              <Row gutter={[8, 0]}>
                <Col span={12}>
                  <Input
                    label="Tên công thức"
                    name={register("name", { required: true })}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Select
                    control={control}
                    label="Loại công thức"
                    name={"extra_salary_formula_id"}
                    arrayItem={"odata/AvailableCatalogs/ExtraFormulas"}
                    valueOpt="id"
                    nameOpt="name"
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <SelectMultiple
                    control={control}
                    label="ChucVu"
                    name={"position_id"}
                    options={multiOptions}
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    label="Tỉ lệ"
                    name={register("rate")}
                    required={true}
                    errors={errors}
                    type="number"
                    step={0.01}
                    min={0}
                    defaultValue={0}
                  />
                </Col>
              </Row>
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
