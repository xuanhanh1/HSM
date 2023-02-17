import { Col, Modal, Popconfirm, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import MonthPickerField from "../../../../../common/control/componentsForm/MonthPicker";
import DataGridLuongCoBan from "../../../../../common/control/DataGirdLuongCoBan";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import { getAllMenus } from "../../../../../redux/actions/Menu";
import { setValueReactFormHook } from "../../../../controller/Format";
import { callApi } from "../../../index";

function renderTreeViewItem(item) {
  return `${item.TEN_MENU}`;
}
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
  const [isResult, setResult] = useState(null);
  const [lstLuong, setLstLuong] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const selectedRow = ([params]) => {
    console.log(params);
  };
  //Submit form
  const onSubmit = (data) => {
    if (watch().search_month === null || watch().search_month === "") {
      openNotificationWithIcon(
        "warning",
        "Chọn tháng năm cần xác nhận bảng lương"
      );
    } else {
      setLoading(true);
      const month =
        watch().search_month.month() + 1 < 10
          ? "0" + (watch().search_month.month() + 1)
          : watch().search_month.month() + 1;
      const year = watch().search_month.year();
      lstLuong.forEach((item) => {
        item.month = month;
        item.year = year;
      });
      callApi("odata/FixedSalarys", "POST", lstLuong)
        .then((res) => {
          console.log(res);
          openNotificationWithIcon("success", "Xác nhận bảng lương thành công");
          setLoading(false);
          setVisible(false);
        })
        .catch((err) => {
          console.log(err);
          openNotificationWithIcon("error", err.response.data.errors[0]);
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    callApi(`odata/FixedSalarys/GetToAdd`).then((res) => {
      const arr = res.data.value.map((item) => {
        return {
          ...item,
          total_salary:
            item.salary_money +
            item.seniority_money +
            item.position_money +
            item.responsibility_money +
            item.favour_money +
            item.toxic_money,
          real_salary:
            item.salary_money +
            item.seniority_money +
            item.position_money +
            item.responsibility_money +
            item.favour_money +
            item.toxic_money -
            item.salary_deduction -
            item.toxic_deduction -
            item.favour_deduction,
          fixed_salary_received:
            item.salary_money +
            item.seniority_money +
            item.position_money +
            item.responsibility_money +
            item.favour_money +
            item.toxic_money -
            item.salary_deduction -
            item.toxic_deduction -
            item.favour_deduction -
            item.social_insurance_fee -
            item.health_insurance_fee -
            item.unemployment_insurance_fee,
        };
      });
      setLstLuong(arr);
    });
  }, []);

  return (
    <div>
      <Modal
        title={
          isStatus === 0
            ? t("Xác nhận bảng lương theo tháng/năm")
            : t("SuaVaiTro")
        }
        visible={isVisible}
        width={"100vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 20 }}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <Popconfirm
            title="Đồng ý xác nhận bảng lương"
            okText="Đông ý"
            onConfirm={onSubmit}
            cancelText="Hủy"
          >
            <button
              form="form"
              key="submit"
              htmlType="submit"
              className="btnSubmit"
            >
              {t("Xác nhận")}
            </button>
            ,
          </Popconfirm>,
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
            <Col span={3}>
              <MonthPickerField
                label="Tháng"
                name="search_month"
                placeholder="Chọn tháng/năm"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
              <DataGridLuongCoBan
                data={lstLuong}
                // allowView={true}
                showPager={true}
                dataKey={"id"}
                // showFilterRow={true}
                exportSampleFile={true}
                selectionChanged={selectedRow}
                infoText={`Tổng số nhân viên: ${lstLuong.length}`}
                // viewObj={handleOpenDrawer1}
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ModalCreateAndEdit;
