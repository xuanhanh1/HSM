import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import MonthPickerField from "../../../../common/control/componentsForm/MonthPicker";
import openNotificationWithIcon from "../../../../common/notification/notification";
import {
  deleteNhanViens,
  getALLNhanViens,
} from "../../../../redux/actions/DanhMuc";
import { FormatMoney } from "../../../controller/Format";
import {
  DataGrid,
  DatePicker,
  ToolBar,
  useLocalStorage,
  _,
  Input,
  moment,
  Select,
  callApi,
} from "../../index";
import DrawerChiTiet from "./drawerChiTiet/DrawerChiTiet";

function Luong(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [lstAllLuong, setLstAllLuong] = useState([]);
  const [lstKhoaPhong, setLstKhoaPhong] = useState([]);
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [inforNhanVien, setInforNhanVien] = useLocalStorage("infoNV", {});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  useEffect(() => {
    callApi("odata/Departments", "GET").then((res) => {
      setLstKhoaPhong(res.data.value);
    });
  }, []);

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };
  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };

  const selectedRow = ([params]) => {
    // const obj = _.find(lstNhanViens, (x) => x.id === params);
    // console.log(obj);
    // setObjEdit(obj);
  };
  const handleDelete = (params) => {
    dispatch(deleteNhanViens(params.id));
  };
  const handleSearch = () => {
    if (watch().month === null || watch().month === "") {
      openNotificationWithIcon("error", "Vui lòng chọn  tháng/năm tìm kiếm");
    } else {
      const month =
        watch().month.month() + 1 < 10
          ? "0" + (watch().month.month() + 1)
          : watch().month.month() + 1;
      const year = watch().month.year();
      const deparment =
        watch().department_id === "" || watch().department_id === null
          ? ""
          : ` and department_id eq ${watch().department_id}`;
      const bank =
        watch().bank === "" || watch().bank === null
          ? ""
          : ` and bank_id eq ${watch().bank}`;
      setIsLoading(true);

      callApi(
        `odata/Incomes?$filter=month eq '${month}' and year eq '${year}'${deparment}${bank}`
      )
        .then((res) => {
          console.log(res);

          setIsLoading(false);
          setLstAllLuong(res.data.value);
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
          console.log(err.response);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="bao-hiem">
      <PageHeader className="site-page-header" title={t("Bảng lương")} />
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
          <Col span={4}>
            <Select
              control={control}
              label="Ngân hàng"
              name={"bank"}
              arrayItem={"odata/AvailableCatalogs/Banks"}
              valueOpt="id"
              nameOpt="name"
              // required
              errors={errors}
            />
          </Col>
          <Col span={3}>
            <MonthPickerField
              label="Tháng"
              name="month"
              defaultValue={null}
              control={control}
              placeholder="Chọn tháng/năm"
            />
          </Col>
          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              loading={isLoading}
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
        <DataGrid
          showPager={true}
          column={columns}
          data={lstAllLuong}
          allowView={true}
          dataKey={"id"}
          // showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
          infoText={`Tổng số nhân viên: ${lstAllLuong.length}`}
          exportSampleFile={true}
          selectionMode={"multiple"}
        />
      </div>
      {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null}
    </div>
  );
}

Luong.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
Luong.defaultProps = {
  columns: [
    {
      caption: "Mã cán bộ",
      dataField: "staff_code",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Họ và tên",
      dataField: "staff_name",
      type: 0,
      width: "10vw",
    },
    {
      caption: "Khoa phòng",
      dataField: "department_name",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "Tháng",
      dataField: "month",
      type: 0,
    },
    {
      caption: "Năm",
      dataField: "year",
      type: 0,
    },
    {
      caption: "Lương cơ bản",
      dataField: "fixed_salary_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Lương đặc thù",
      dataField: "special_salary_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Lương thủ thuật",
      dataField: "minorsurgical_salary_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Lương phẩu thuật",
      dataField: "surgical_salary_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Thu nhập tăng thêm",
      dataField: "extra_salary_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền trực,thêm giờ",
      dataField: "overtime_salary_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Thuế TNCN",
      value: 0,
      type: 0,
      format: "Money",
    },
    {
      caption: "Tổng cộng",
      dataField: "total",
      type: 0,
      customCellRender: (item) => {
        const total =
          item.data.fixed_salary_money +
          item.data.overtime_salary_money +
          item.data.special_salary_money +
          item.data.surgical_salary_money +
          item.data.minorsurgical_salary_money +
          item.data.extra_salary_money;
        return (
          <span
            style={{
              color: "#19b159",
              fontWeight: "bold",
              textAlign: "right",
              display: "block",
            }}
          >
            {FormatMoney(total)}
          </span>
        );
      },
      format: "Money",
    },
    {
      caption: "Số tài khoản",
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
export default Luong;
