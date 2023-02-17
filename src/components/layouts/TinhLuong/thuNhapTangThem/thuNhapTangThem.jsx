import { PageHeader, Tabs } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { _ } from "../../index";
import CaNhan from "./caNhan/caNhan";
import CongThucTNTT from "./congThucTNTT/congThucTNTT";

const { TabPane } = Tabs;

function ThuNhapTangThem(props) {
  const { columns, columnsTNTT } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [lstAllCT, setLstAllCT] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();

  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  const selectedRow = ([params]) => {
    const obj = _.find(lstAllCT, (x) => x.id === params);
    console.log(obj);
    setObjEdit(obj);
  };

  return (
    <div className="bao-hiem">
      <PageHeader
        className="site-page-header"
        title={t("Thu nhập tăng thêm")}
      />

      <Tabs defaultActiveKey="1">
        <TabPane tab={"Thu nhập tăng thêm cá nhân"} key="1">
          <CaNhan />
        </TabPane>
        <TabPane tab={"Công thức và tiền tính TNTT"} key="2">
          <CongThucTNTT />
        </TabPane>
      </Tabs>
    </div>
  );
}

ThuNhapTangThem.propTypes = {
  columns: PropTypes.array,
  columnsTNTT: PropTypes.array,
};
ThuNhapTangThem.defaultProps = {
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
  columnsTNTT: [
    {
      caption: "Mã NV",
      dataField: "staff_code",
      type: 0,
    },
    {
      caption: "Họ tên",
      dataField: "staff_name",
      type: 0,
    },
    {
      caption: "Khoa/phòng",
      dataField: "department_name",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "Tiền TNTT",
      dataField: "total_salary",
      type: 0,
      format: "Money",
    },

    {
      caption: "Thuế",
      setValue:0,
      type: 0,
      format: "Money",
    },
    {
      caption: "Thực lãnh",
      dataField: "extra_salary_received",
      type: 0,
      format: "Money",
    },
    {
      caption: "STK",
      dataField: "bank_account_number",
      type: 0,
    },
    {
      caption: "Ngân hàng",
      dataField: "bank_name",
      type: 0,
    },
  ],
};
export default ThuNhapTangThem;
