import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row, Tabs } from "antd";
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
import {
  DataGrid,
  ToolBar,
  useLocalStorage,
  _,
  Select,
  DatePicker,
  moment,
  Input,
  callApi,
  UploadFile,
} from "../../index";
import DataGridCustom from "../../../../common/control/DataGirdCustom";
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";
const { TabPane } = Tabs;

function ChamCong(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [isFileExcel, setFileExcel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [lstAllCC, setLstAllCC] = useState([]);
  const [lstAllCaNhan, setLstAllCaNhan] = useState([]);
  const [lstKhoaPhong, setLstKhoaPhong] = useState([]);
  const [loading, setLoading] = useState(false);
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
  // useEffect(() => {
  //   const month = watch().search_month.month() + 1;
  //   const year = watch().search_month.year();
  //   callApi(
  //     `odata/Timesheetss?$filter=month eq '${month}' and year eq '${year}'`
  //   ).then((res) => {
  //     setLstAllCC(
  //       res.data.value.map((item, idx) => {
  //         return { ...item, STT: idx + 1 };
  //       })
  //     );
  //   });
  // }, []);
  // useEffect(() => {
  //   const month =
  //     watch().search_month.month() + 1 < 10
  //       ? "0" + (watch().search_month.month() + 1)
  //       : watch().search_month.month() + 1;
  //   const year = watch().search_month.year();
  //   const deparment =
  //     watch().department_id === "" || watch().department_id === null
  //       ? ""
  //       : ` and department_id eq ${watch().department_id}`;
  //   callApi(
  //     `odata/timekeepings?$filter=month eq '${month}' and year eq '${year}'${deparment}`
  //   ).then((res) => {
  //     console.log(res);
  //     setLstAllCaNhan(res.data.value);
  //   });
  // }, []);
  const handleSearch = () => {
    if (_.isNull(watch().search_month)) {
      openNotificationWithIcon("error", "Vui lòng chọn tháng/năm cần tìm");
      return;
    }
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
    callApi(
      `odata/Timesheetss?$filter=month eq '${month}' and year eq '${year}'${deparment}`
    ).then((res) => {
      console.log(res);
      setLstAllCC(
        res.data.value.map((item, idx) => {
          return { ...item, STT: idx + 1 };
        })
      );
    });
    callApi(
      `odata/timekeepings?$filter=month eq '${month}' and year eq '${year}'${deparment}`
    ).then((res) => {
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
      setLstAllCaNhan(res.data.value);
      setLoading(false);
    });
  };

  const handleUploadFile = () => {
    if (_.isNull(watch().month)) {
      openNotificationWithIcon(
        "error",
        "Vui lòng chọn tháng/năm cập nhật bảng công"
      );
    } else {
      const month =
        watch().month.month() + 1 < 10
          ? "0" + (watch().month.month() + 1)
          : watch().month.month() + 1;
      const year = watch().month.year();
      console.log(`odata/Timesheetss/ImportExcel?month=${month}&year=${year} `);
      setIsLoading(true);
      callApi(
        `odata/Timesheetss/ImportExcel?month=${month}&year=${year}`,
        "POST",
        isFileExcel,
        "multipart/form-data"
      )
        .then((res) => {
          setIsLoading(false);
          callApi(
            `odata/Timesheetss?$filter=month eq '${month}' and year eq '${year}'`
          ).then((res) => {
            console.log(res);
            setLstAllCC(
              res.data.value.map((item, idx) => {
                return { ...item, STT: idx + 1 };
              })
            );
            openNotificationWithIcon("success", "Thêm file thàng công");
            setFileExcel(null);
          });
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
          console.log(err.response);
          setIsLoading(false);
        });
    }
  };
  const listFileUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e[0].originFileObj);
    setFileExcel(formData);
  };
  const selectedRow = ([params]) => {
    const obj = _.find(lstNhanViens, (x) => x.id === params);
    console.log(obj);
    setObjEdit(obj);
  };
  return (
    <div className="bao-hiem">
      <PageHeader className="site-page-header" title={t("Bảng chấm công")} />
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

          <Col span={2}>
            <MonthPickerField
              label="Tháng"
              name="search_month"
              defaultValue={null}
              control={control}
              placeholder="Chọn tháng/năm"
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
      <Tabs defaultActiveKey="1">
        <TabPane tab={"Bảng chấm công"} key="1">
          <Row gutter={[8, 0]} className="upload-toolbar">
            <Col span={3}>
              <MonthPickerField
                label="Tháng"
                name="month"
                placeholder="Chọn tháng/năm"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={2}>
              <UploadFile
                label="File chấm công"
                listFile={listFileUpload}
                maxCount={1}
                fileType={[".xlsx", ".xlsm"]}
              />
            </Col>
            <Col span={3}>
              <Button
                onClick={handleUploadFile}
                type="primary"
                disabled={_.isNull(isFileExcel)}
                loading={isLoading}
                style={{ marginTop: 10 }}
              >
                Cập nhật bảng chấm công
              </Button>
            </Col>
          </Row>

          <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
            <DataGrid
              column={columns}
              data={lstAllCC}
              // allowView={true}
              dataKey={"id"}
              // showFilterRow={true}
              showPager={true}
              exportSampleFile={true}
              selectionChanged={selectedRow}
              // viewObj={handleOpenDrawer1}
              infoText={`Tổng số nhân viên: ${lstAllCC.length}`}
            />
          </div>
        </TabPane>
        <TabPane tab={"Bảng công cá nhân"} key="2">
          <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
            <DataGridCustom
              data={lstAllCaNhan}
              // allowView={true}
              dataKey={"id"}
              showPager={true}
              // showFilterRow={true}
              exportSampleFile={true}
              selectionChanged={selectedRow}
              // viewObj={handleOpenDrawer1}
              infoText={`Tổng số nhân viên: ${lstAllCaNhan.length}`}
            />
          </div>
        </TabPane>
      </Tabs>

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
      {/* {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null} */}
    </div>
  );
}

ChamCong.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
ChamCong.defaultProps = {
  columns: [
    // {
    //   caption: "MANV_Hsoft",
    //   dataField: "staff_code",
    //   type: 0,
    //   width: "4vw",
    // },
    {
      caption: "Mã CB",
      dataField: "staff_code",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Họ và tên",
      dataField: "staff_name",
      width: "12vw",
    },
    {
      caption: "Tháng",
      dataField: "month",
      width: "3vw",
    },
    {
      caption: "Năm",
      dataField: "year",
      width: "3vw",
    },
    { caption: "N1", dataField: "day_1", type: 0 },
    { caption: "N2", dataField: "day_2", type: 0 },
    { caption: "N3", dataField: "day_3", type: 0 },
    { caption: "N4", dataField: "day_4", type: 0 },
    { caption: "N5", dataField: "day_5", type: 0 },
    { caption: "N6", dataField: "day_6", type: 0 },
    { caption: "N7", dataField: "day_7", type: 0 },
    { caption: "N8", dataField: "day_8", type: 0 },
    { caption: "N9", dataField: "day_9", type: 0 },
    { caption: "N10", dataField: "day_10", type: 0 },
    { caption: "N11", dataField: "day_11", type: 0 },
    { caption: "N12", dataField: "day_12", type: 0 },
    { caption: "N13", dataField: "day_13", type: 0 },
    { caption: "N14", dataField: "day_14", type: 0 },
    { caption: "N15", dataField: "day_15", type: 0 },
    { caption: "N16", dataField: "day_16", type: 0 },
    { caption: "N17", dataField: "day_17", type: 0 },
    { caption: "N18", dataField: "day_18", type: 0 },
    { caption: "N19", dataField: "day_19", type: 0 },
    { caption: "N20", dataField: "day_20", type: 0 },
    { caption: "N21", dataField: "day_21", type: 0 },
    { caption: "N22", dataField: "day_22", type: 0 },
    { caption: "N23", dataField: "day_23", type: 0 },
    { caption: "N24", dataField: "day_24", type: 0 },
    { caption: "N25", dataField: "day_25", type: 0 },
    { caption: "N26", dataField: "day_26", type: 0 },
    { caption: "N27", dataField: "day_27", type: 0 },
    { caption: "N28", dataField: "day_28", type: 0 },
    { caption: "N29", dataField: "day_29", type: 0 },
    { caption: "N30", dataField: "day_30", type: 0 },
    { caption: "N31", dataField: "day_31", type: 0 },
  ],
};
export default ChamCong;
