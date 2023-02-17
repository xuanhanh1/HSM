import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import MonthPickerField from "../../../../common/control/componentsForm/MonthPicker";
import DataGridLuongCoBan from "../../../../common/control/DataGirdLuongCoBan";
import openNotificationWithIcon from "../../../../common/notification/notification";
import { callApi, Select, useLocalStorage, _, ToolBar } from "../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";

function BangLuongCoBan(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [isFileExcel, setFileExcel] = useState(null);
  const [lstLuong, setLstLuong] = useState([]);
  const [lstKhoaPhong, setLstKhoaPhong] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [inforNhanVien, setInforNhanVien] = useLocalStorage("infoNV", {});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const lstNhanViens = useSelector(
    (state) => state.DanhMucReducers.lstNhanViens
  );
  useEffect(() => {
    callApi("odata/Departments", "GET").then((res) => {
      setLstKhoaPhong(res.data.value);
    });
  }, []);

  const selectedRow = ([params]) => {
    const obj = _.find(lstNhanViens, (x) => x.id === params);
    console.log(obj);
    setObjEdit(obj);
  };
  const handleSearch = () => {
    if (_.isNull(watch().search_month)) {
      openNotificationWithIcon("error", "Vui lòng chọn tháng/năm tìm kiếm");
    } else {
      setLoading(true);
      const month =
        watch().search_month.month() + 1 < 10
          ? "0" + (watch().search_month.month() + 1)
          : watch().search_month.month() + 1;
      const year = watch().search_month.year();
      const deparment =
        watch().department_id === "" || watch().department_id === null
          ? ""
          : ` and department_id eq ${watch().department_id}`;
      console.log(
        `odata/FixedSalarys?$filter=month eq '${month}' and year eq '${year}'${deparment}`
      );
      callApi(
        `odata/FixedSalarys?$filter=month eq '${month}' and year eq '${year}'${deparment}`
      ).then((res) => {
        console.log(res);
        setLstLuong(res.data.value);
        setLoading(false);
      });
    }
  };
  const handleOpenDrawer = (status) => {
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  return (
    <div className="bang-luong-co-ban">
      <PageHeader className="site-page-header" title={t("Bảng lương cơ bản")} />
      <ToolBar
        titleAdd={"Tạo mới bảng lương cơ bản"}
        setStateOpen={() => handleOpenDrawer(0)}
        // setEdit={() => handleOpenDrawer(1)}
        // data={isObjEdit}
      />
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            display: "flex",
            width: "100%",
          }}
        >
          <Col span={4}>
            <Select
              control={control}
              label="KhoaPhong"
              name={"department_id"}
              arrayItem={lstKhoaPhong}
              valueOpt="id"
              nameOpt="name"
              // required
              errors={errors}
            />
          </Col>
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
          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              loading={loading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
        </div>
      </Row>
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGridLuongCoBan
          data={lstLuong}
          // allowView={true}
          dataKey={"id"}
          // showFilterRow={true}
          showPager={true}
          exportSampleFile={true}
          selectionChanged={selectedRow}
          // viewObj={handleOpenDrawer1}
          infoText={`Tổng số nhân viên: ${lstLuong.length}`}
          selectionMode={"multiple"}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

BangLuongCoBan.propTypes = {
  columns: PropTypes.array,
};
BangLuongCoBan.defaultProps = {
  columns: [
    {
      caption: "manv",
      dataField: "staff_code",
      type: 0,
    },
    {
      caption: "hoten",
      dataField: "staff_name",
      type: 0,
    },
    {
      caption: "chucvu",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "tendonvi",
      dataField: "department_name",
      type: 0,
    },
    {
      caption: "heso",
      dataField: "salary_coef",
      type: 0,
    },
    {
      caption: "pctnvk",
      dataField: "salary_deduction",
      type: 0,
    },
    {
      caption: "pccv",
      dataField: "seniority_coef",
      type: 0,
    },
    {
      caption: "hstncv",
      dataField: "toxic_deduction",
      type: 0,
    },
    {
      caption: "hsuudai",
      dataField: "favour_coef",
      type: 0,
    },
    {
      caption: "hsdochai",
      dataField: "toxic_coef",
      type: 0,
    },
    {
      caption: "Tổng thu nhập lương",
      dataField: "total_salary",
      type: 0,
    },
    {
      caption: "Tiên nghỉ trừ luong",
      dataField: "salary_money",
      type: 0,
    },
    {
      caption: "Tiền nghỉ trừ độc hại",
      dataField: "toxic_money",
      type: 0,
    },
    {
      caption: "Tiền nghỉ trừ ưu đãi",
      dataField: "favour_money",
      type: 0,
    },
    {
      caption: "Tổng lương được hưởng",
      dataField: "total_salary",
      type: 0,
    },
    {
      caption: "t_bhxh",
      dataField: "social_insurance_fee",
      type: 0,
    },
    {
      caption: "t_bhyt",
      dataField: "health_insurance_fee",
      type: 0,
    },
    {
      caption: "t_bhtn",
      dataField: "unemployment_insurance_fee",
      type: 0,
    },
    {
      caption: "t_congdoan",
      dataField: "labor_union_fee",
      type: 0,
    },
    {
      caption: "tienconnlai_luong",
      dataField: "real_salary",
      type: 0,
    },
  ],
};
export default BangLuongCoBan;
