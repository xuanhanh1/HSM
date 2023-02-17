import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import MonthPickerField from "../../../../common/control/componentsForm/MonthPicker";
import openNotificationWithIcon from "../../../../common/notification/notification";
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";
import {
  deleteNhanViens,
  getALLNhanViens,
} from "../../../../redux/actions/DanhMuc";
import {
  DataGrid,
  DatePicker,
  moment,
  ToolBar,
  useLocalStorage,
  _,
  callApi,
  UploadFile,
  Input,
  Select,
} from "../../index";

function TienLamThemGio(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [lstLuongOT, setLstLuongOT] = useState([]);
  const [lstKhoaPhong, setLstKhoaPhong] = useState([]);

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

  const selectedRow = ([params]) => {};
  const handleDelete = (params) => {
    dispatch(deleteNhanViens(params.id));
  };
  const handleSearch = () => {
    if (watch().month === null || watch().month === "") {
      openNotificationWithIcon("error", "Vui lòng chọn  tháng/năm tìm kiếm");
      return;
    }
    const month =
      watch().month.month() + 1 < 10
        ? "0" + (watch().month.month() + 1)
        : watch().month.month() + 1;
    const year = watch().month.year();
    const deparment =
      watch().department_id === "" || watch().department_id === null
        ? ""
        : ` and department_id eq ${watch().department_id}`;
    setIsLoading(true);
    callApi(
      `odata/OvertimeSalaries?$filter=month eq '${month}' and year eq '${year}'${deparment}`
    )
      .then((res) => {
        console.log(res);

        res.data.value.forEach((item) => {
          for (let prop in item) {
            if (
              item.hasOwnProperty(prop) &&
              item[prop] === 0 &&
              typeof item[prop] === "number"
            ) {
              item[prop] = null;
            }
          }
        });
        setIsLoading(false);
        setLstLuongOT(res.data.value);
      })
      .catch((err) => {
        console.log(err.response);
        // openNotificationWithIcon("warning", err.response.data.errors[0]);
        setIsLoading(false);
      });
  };

  return (
    <div className="bao-hiem">
      <PageHeader className="site-page-header" title={t("Tiền làm thêm giờ")} />
      {/* <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      /> */}
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
              name="month"
              defaultValue={null}
              control={control}
              placeholder={"Chọn tháng/năm"}
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
          column={columns}
          data={lstLuongOT}
          // allowView={true}
          dataKey={"id"}
          showPager={true}
          exportSampleFile={true}
          // showFilterRow={true}
          selectionChanged={selectedRow}
          infoText={`Tổng số nhân viên: ${lstLuongOT.length}`}
          // viewObj={handleOpenDrawer1}
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

TienLamThemGio.propTypes = {
  columns: PropTypes.array,
};
TienLamThemGio.defaultProps = {
  columns: [
    {
      caption: "Mã NV",
      dataField: "staff_code",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Họ tên",
      dataField: "staff_name",
      type: 0,
      width: "10vw",
    },
    {
      caption: "Chức vụ",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "Khoa/phòng",
      dataField: "department_name",
      type: 0,
    },
    {
      caption: "Tiền lương/giờ",
      dataField: "hour_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Số giờ Ngày thường (T2-T6)",
      dataField: "weekday_hours",
      type: 0,
    },
    {
      caption: "Tiền Ngày thường (T2-T6)",
      dataField: "weekday_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Số giờ cuối tuần (T7-CN)",
      dataField: "weekend_hours",
      type: 0,
    },
    {
      caption: "Tiền cuối tuần (T7-CN)",
      dataField: "weekend_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Số giờ ngày lễ,tết",
      dataField: "holiday_hours",
      type: 0,
    },
    {
      caption: "Tiền ngày lễ,tết",
      dataField: "holiday_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Số giờ trực đêm",
      dataField: "night_hours",
      type: 0,
    },
    {
      caption: "Tiền trực đêm",
      dataField: "night_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tổng lương",
      dataField: "total_salary",
      type: 0,
      format: "Money",
    },
    {
      caption: "Số giờ nghỉ bù",
      dataField: "compensatory_leave_hours",
      type: 0,
    },
    {
      caption: "Tiền nghỉ bù",
      dataField: "compensatory_leave_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Lương thực nhận",
      dataField: "overtime_salary_received",
      type: 0,
      format: "Money",
    },
  ],
};
export default TienLamThemGio;
