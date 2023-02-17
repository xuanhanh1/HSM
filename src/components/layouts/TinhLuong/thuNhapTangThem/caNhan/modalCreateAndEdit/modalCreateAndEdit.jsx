import { Col, Divider, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import MonthPickerField from "../../../../../../common/control/componentsForm/MonthPicker";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
  AddExtraSalarys,
  createExtraSalaryTypes,
  EditExtraSalaryTypes,
} from "../../../../../../redux/actions/DanhMuc";
import { setValueReactFormHook } from "../../../../../controller/Format";
import {
  Input,
  Notification,
  _,
  Select,
  callApi,
  moment,
  DataGrid,
} from "../../../../index";
import TrucTiep from "./chiTiet/trucTiep";
import GianTiep from "./chiTiet/gianTiep";
const { TabPane } = Tabs;

function renderTreeViewItem(item) {
  return `${item.TEN_MENU}`;
}
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit, columns } =
    props;
  const [isResult, setResult] = useState(null);
  const [dataGianTiep, setDataGianTiep] = useState([]);
  const [lstAllKhoaPhong, setLstAllKhoaPhong] = useState([]);

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
    if (isStatus === 1) {
      objEdit.month = _.isNull(objEdit.month)
        ? null
        : moment().month(objEdit.month - 1);
      objEdit.year = _.isNull(objEdit.year)
        ? null
        : moment().year(objEdit.year);

      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  useEffect(() => {
    callApi("odata/Departments", "GET").then((res) => {
      console.log(res);
      setLstAllKhoaPhong(res.data.value);
    });
  }, []);
  const handleCancel = () => {
    setVisible(false);
    setObjEdit({});
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
  const onSubmit = async (data) => {
    if (isStatus === 0) {
      const result = await dispatch(AddExtraSalarys(dataGianTiep));
      if (result) {
        openNotificationWithIcon(
          "success",
          "Thêm thu nhập tăng thêm cá nhân thành công"
        );
        setVisible(false);
      }
    } else {
      console.log("sửa");
    }
  };

  const GetDataFromGianTiep = (childData) => {
    setDataGianTiep(childData);
  };
  return (
    <div>
      <Modal
        title={
          isStatus === 0
            ? t("Thêm công thức tính tăng thêm")
            : t("Sửa công thức tính tăng thêm")
        }
        visible={isVisible}
        width={"80vw"}
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
          {isStatus === 0 ? (
            <>
              <Row gutter={[8, 0]}>
                <Col span={4}>
                  <MonthPickerField
                    label="Tháng"
                    control={control}
                    errors={errors}
                    name={`month`}
                    defaultValue={moment()}
                    placeholder="Chọn tháng/năm"
                    required
                  />
                </Col>
              </Row>

              <Tabs defaultActiveKey="1">
                <TabPane tab={"Trực tiếp"} key="1">
                  <Row gutter={[8, 0]}>
                    <TrucTiep month={watch().month} />
                  </Row>
                </TabPane>
                <TabPane tab={"Gián tiếp"} key="2">
                  <GianTiep
                    sendDataGT={GetDataFromGianTiep}
                    month={watch().month}
                  />
                </TabPane>
              </Tabs>
            </>
          ) : (
            <Row gutter={[8, 0]}>
              <Col span={4}>
                <MonthPickerField
                  label="Tháng"
                  control={control}
                  errors={errors}
                  name={`month`}
                  defaultValue={null}
                  placeholder="Chọn tháng/năm"
                  // required
                />
              </Col>
              <Col span={4}>
                <Select
                  control={control}
                  label="Khoa/phòng"
                  name={`department_id`}
                  arrayItem={lstAllKhoaPhong}
                  valueOpt="id"
                  nameOpt="name"
                  required
                  errors={errors}
                  disabled
                />
              </Col>

              <Col span={8}>
                <Select
                  control={control}
                  label="Công thức"
                  name={`formula_id`}
                  arrayItem={"odata/AvailableCatalogs/ExtraSalaryFormulas"}
                  valueOpt="id"
                  nameOpt="name"
                  // required
                  errors={errors}
                />
              </Col>
              <Col span={4}>
                <Input
                  label="Điểm thi đua"
                  name={register(`sum_mark`)}
                  control={control}
                  type="number"
                  step={0.01}
                  defaultValue={0}
                  min={0}
                />
              </Col>
              <Col span={4}>
                <Input
                  label="Tiền thu nhập tăng thêm"
                  name={register(`sum_extra_salary`)}
                  control={control}
                  type="number"
                  defaultValue={0}
                  min={0}
                />
              </Col>
            </Row>
          )}
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
      caption: "Tháng",
      dataField: "month",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Năm",
      dataField: "year",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Khoa phòng",
      dataField: "department_name",
      type: 0,
      width: "10vw",
    },
    {
      caption: "Công thức",
      dataField: "formula_name",
      type: 0,
    },
    {
      caption: "Điểm thi đua",
      dataField: "sum_mark",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Tiền TNTT",
      dataField: "sum_extra_salary",
      type: 0,
      width: "10vw",
      format: "Money",
    },
  ],
};
export default ModalCreateAndEdit;
