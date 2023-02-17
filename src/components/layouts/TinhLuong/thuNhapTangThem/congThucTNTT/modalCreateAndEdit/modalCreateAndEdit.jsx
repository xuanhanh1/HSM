import { Col, Divider, Modal, Row, Space, Spin, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import MonthPickerField from "../../../../../../common/control/componentsForm/MonthPicker";
import openNotificationWithIcon from "../../../../../../common/notification/notification";
import {
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
} from "../../../../index";
const { TabPane } = Tabs;

const disableMonth = (current) => {
  //|| current < moment().subtract(6, "months")
  return current > moment();
};
function renderTreeViewItem(item) {
  return `${item.TEN_MENU}`;
}
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
  const [lstAllKp, setLstAllKp] = useState([]);
  const [lstKPTrucTiep, setLstKPTrucTiep] = useState([]);
  const [lstKPGianTiep, setLstKPGianTiep] = useState([]);
  const [optionGianTiep, setOptionGianTiep] = useState([]);
  const [render, setRender] = useState(false);
  const [option, setOption] = useState([]);
  const [lastMonthData, setLastMonthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    callApi("odata/Departments").then((res) => {
      setLstAllKp(res.data.value);
    });
  }, []);
  //Các danh sách select option
  useEffect(() => {
    callApi("odata/ExtraSalaryFormulas").then((res) => {
      // console.log(res.data.value);
      const newArr = res.data.value.filter(
        (item) => item.id !== "592e01f0-ca07-4161-a1b4-bdf45368bae1"
      );
      const optionGT = res.data.value.filter(
        (item) => item.id === "592e01f0-ca07-4161-a1b4-bdf45368bae1"
      );
      setOptionGianTiep(optionGT);
      setOption(newArr);
    });
  }, []);
  useEffect(() => {
    callApi("odata/ExtraSalaryTypes/LastMonth").then((res) => {
      setLastMonthData(res.data.value);
    });
  }, []);
  useEffect(() => {
    //render lại sau khi set value ở useEffect dưới
    let timer1 = setTimeout(() => setRender(true), 500);
    return () => {
      clearTimeout(timer1);
    };
  }, [render]);
  useEffect(() => {
    if (isStatus === 0) {
      lstKPTrucTiep.forEach((item, idx) =>
        lastMonthData.forEach((val) => {
          if (item.id === val.department_id) {
            setValue(`formula_id-${idx}`, val.formula_id);
            setValue(`sum_extra_salary-${idx}`, val.sum_extra_salary);
          }
        })
      );
      lstKPGianTiep.forEach((item, idx) =>
        lastMonthData.forEach((val) => {
          if (item.id === val.department_id) {
            setValue(
              `formula_id-${idx + lstKPTrucTiep.length}`,
              val.formula_id
            );
            setValue(
              `sum_extra_salary-${idx + lstKPTrucTiep.length}`,
              val.sum_extra_salary
            );
            setValue(`sum_mark-${idx + lstKPTrucTiep.length}`, val.sum_mark);
          }
        })
      );
    }
  }, [render]);
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
    callApi(
      "odata/Departments?$Filter=is_direct_extra_salary eq true",
      "GET"
    ).then((res) => {
      res.data.value.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      setLstKPTrucTiep(res.data.value);
    });
  }, []);
  useEffect(() => {
    callApi(
      "odata/Departments?$Filter=is_direct_extra_salary eq false",
      "GET"
    ).then((res) => {
      res.data.value.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      setLstKPGianTiep(res.data.value);
    });
  }, []);
  const handleCancel = () => {
    setVisible(false);
    setObjEdit({});
  };

  //Submit form
  const onSubmit = async (data) => {
    console.log(data);
    if (isStatus === 0) {
      if (watch().month === null || watch().month === "") {
        openNotificationWithIcon("error", "Vui lòng chọn tháng/năm");
        return;
      }
      let index = Object.keys(data).sort(
        (a, b) =>
          a.slice(a.indexOf("-")).slice(1) - b.slice(b.indexOf("-")).slice(1)
      );
      // or array of sorted object
      let sortedArrayOfObject = index.map((v) => {
        return { key: v, value: data[v] };
      });
      const arr = [];
      for (let i = 1; i < sortedArrayOfObject.length; i += 4) {
        arr.push({
          department_id: sortedArrayOfObject[i].value,
          sum_mark: sortedArrayOfObject[i + 1].value,
          sum_extra_salary: sortedArrayOfObject[i + 2].value,
          month:
            watch().month === null
              ? null
              : watch().month.month() + 1 < 10
              ? "0" + String(watch().month.month() + 1).slice(-2)
              : watch().month.month() + 1,

          year: watch().month ? watch().month.year() : null,
          formula_id: sortedArrayOfObject[i + 3].value,
        });
      }
      arr.forEach((item) => {
        if (item.formula_id === "Gián tiếp") {
          item.formula_id = "592e01f0-ca07-4161-a1b4-bdf45368bae1";
        }
      });
      console.log(arr);
      if (arr[lstKPTrucTiep.length + 1].department_id === undefined) {
        openNotificationWithIcon(
          "warning",
          "Vui lòng kiểm tra thông tin gián tiếp trước khi xác nhận"
        );
        return;
      }
      setLoading(true);
      const result = await dispatch(createExtraSalaryTypes(arr));
      if (result) {
        openNotificationWithIcon(
          "success",
          "Thêm công thức tính TNTT  thành công"
        );
        setVisible(false);
        setObjEdit({});
      }
      setLoading(false);
    } else {
      const result = await dispatch(
        EditExtraSalaryTypes({
          ...data,
          month:
            watch().month === null
              ? null
              : watch().month.month() + 1 < 10
              ? "0" + String(watch().month.month() + 1).slice(-2)
              : watch().month.month() + 1,

          year: watch().month ? watch().month.year() : null,
        })
      );
      if (result) {
        openNotificationWithIcon(
          "success",
          "Sửa công thức tính TNTT thành công"
        );
        setVisible(false);
        setObjEdit({});
      }
    }
    // console.log(data);
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
        width={"70vw"}
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
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40vw",
              flexDirection: "column",
            }}
          >
            <p style={{ marginBottom: 40, fontSize: "20px" }}>Vui lòng đợi</p>
            <Space size="middle">
              <Spin size="large" />
            </Space>
          </div>
        ) : (
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
                      defaultValue={null}
                      placeholder="Chọn tháng/năm"
                      required
                      disabledDate={disableMonth}
                    />
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab={"Trực tiếp"} key="1">
                      <Row gutter={[8, 0]}>
                        {lstKPTrucTiep.map((item, key) => {
                          return (
                            <>
                              <Col span={0} style={{ display: "none" }}>
                                <Input
                                  label="Khoa phòng"
                                  name={register(`department_id-${key}`)}
                                  control={control}
                                  defaultValue={item.id}
                                />
                              </Col>
                              <Col span={6}>
                                <p>{item.name}</p>
                              </Col>

                              <Col span={15}>
                                <Select
                                  control={control}
                                  label="Công thức"
                                  name={`formula_id-${key}`}
                                  arrayItem={option}
                                  valueOpt={"id"}
                                  nameOpt="name"
                                  required
                                  errors={errors}
                                />
                              </Col>
                              <Col span={0} style={{ display: "none" }}>
                                <Input
                                  label="Điểm thi đua"
                                  name={register(`sum_mark-${key}`)}
                                  control={control}
                                  type="number"
                                  step={0.01}
                                  defaultValue={0}
                                  min={0}
                                  style={{ textAlign: "right" }}
                                />
                              </Col>
                              <Col span={3}>
                                <Input
                                  label="Tiền thu nhập tăng thêm"
                                  name={register(`sum_extra_salary-${key}`)}
                                  control={control}
                                  type="number"
                                  defaultValue={0}
                                  min={0}
                                  style={{ textAlign: "right" }}
                                />
                              </Col>
                              {/* <Divider /> */}
                            </>
                          );
                        })}
                      </Row>
                    </TabPane>
                    <TabPane tab={"Gián tiếp"} key="2">
                      <Row gutter={[8, 0]}>
                        {lstKPGianTiep.map((item, key) => {
                          return (
                            <>
                              <Col span={0} style={{ display: "none" }}>
                                <Input
                                  label="Khoa phòng"
                                  name={register(
                                    `department_id-${
                                      lstKPTrucTiep.length + key
                                    }`
                                  )}
                                  control={control}
                                  defaultValue={item.id}
                                />
                              </Col>
                              <Col span={6}>
                                <p>{item.name}</p>
                              </Col>

                              <Col span={12}>
                                <Select
                                  control={control}
                                  label="Công thức"
                                  name={`formula_id-${
                                    lstKPTrucTiep.length + key
                                  }`}
                                  arrayItem={optionGianTiep}
                                  valueOpt={"id"}
                                  nameOpt="name"
                                  // required
                                  errors={errors}
                                  defaultValue={"Gián tiếp"}
                                  disabled
                                />
                              </Col>
                              <Col span={3}>
                                <Input
                                  label="Điểm thi đua"
                                  name={register(
                                    `sum_mark-${lstKPTrucTiep.length + key}`
                                  )}
                                  control={control}
                                  type="number"
                                  step={0.01}
                                  defaultValue={0}
                                  min={0}
                                  style={{ textAlign: "right" }}
                                />
                              </Col>
                              <Col span={3}>
                                <Input
                                  label="Tiền thu nhập tăng thêm"
                                  name={register(
                                    `sum_extra_salary-${
                                      lstKPTrucTiep.length + key
                                    }`
                                  )}
                                  control={control}
                                  type="number"
                                  defaultValue={0}
                                  min={0}
                                  style={{ textAlign: "right" }}
                                />
                              </Col>
                              {/* <Divider /> */}
                            </>
                          );
                        })}
                      </Row>
                    </TabPane>
                  </Tabs>
                </Row>
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
                    arrayItem={lstAllKp}
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
                    arrayItem={option}
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
        )}
      </Modal>
    </div>
  );
}

export default ModalCreateAndEdit;
