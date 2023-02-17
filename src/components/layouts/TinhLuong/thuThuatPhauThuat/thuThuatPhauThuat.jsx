import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row, Tabs } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import MonthPickerField from "../../../../common/control/componentsForm/MonthPicker";
import openNotificationWithIcon from "../../../../common/notification/notification";
import { deleteNhanViens } from "../../../../redux/actions/DanhMuc";
import { callApi, DataGrid, Input, moment, UploadFile, _ } from "../../index";
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";
const { TabPane } = Tabs;

function ThuThuatPhauThuat(props) {
  const { columns, columnsMoney } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [isFileExcelTT, setFileExcelTT] = useState(null);
  const [isFileExcelPT, setFileExcelPT] = useState(null);
  const [isLoadingTT, setIsLoadingTT] = useState(false);
  const [isLoadingPT, setIsLoadingPT] = useState(false);

  const [lstTT, setLstTT] = useState([]);
  const [lstPT, setLstPT] = useState([]);
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
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const selectedRow = ([params]) => {
    // const obj = _.find(lstNhanViens, (x) => x.id === params);
    // console.log(obj);
    // setObjEdit(obj);
  };
  const handleDelete = (params) => {
    dispatch(deleteNhanViens(params.id));
  };
  const handleSearch = () => {
    if (watch().search_month === null || watch().search_month === "") {
      openNotificationWithIcon("error", "Vui lòng chọn tháng/năm tìm kiếm");
    } else {
      setLoading(true);
      const month =
        watch().search_month.month() + 1 < 10
          ? "0" + (watch().search_month.month() + 1)
          : watch().search_month.month() + 1;
      const year = watch().search_month.year();
      callApi(
        `odata/MinorSurgerys?$filter=month eq '${month}' and year eq '${year}'`
      ).then((res) => {
        // console.log(res);
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
        setLstTT(res.data.value);
      });
      callApi(
        `odata/Surgerys?$filter=month eq '${month}' and year eq '${year}'`
      ).then((res) => {
        // console.log(res);
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
        setLstPT(res.data.value);
      });
      setLoading(false);
    }
  };
  const listFileUploadTT = (e) => {
    let formData = new FormData();
    formData.append("file", e[0].originFileObj);
    setFileExcelTT(formData);
  };

  const handleUploadFileTT = () => {
    if (watch().month === null || watch().month === "") {
      openNotificationWithIcon(
        "error",
        "Vui lòng chọn tháng/năm cập nhật file"
      );
    } else {
      const month =
        watch().month.month() + 1 < 10
          ? "0" + (watch().month.month() + 1)
          : watch().month.month() + 1;
      const year = watch().month.year();
      setIsLoadingTT(true);
      callApi(
        `odata/MinorSurgerys/ImportExcel?month=${month}&year=${year}`,
        "POST",
        isFileExcelTT,
        "multipart/form-data"
      )
        .then((res) => {
          callApi(
            `odata/MinorSurgerys?$filter=month eq '${month}' and year eq '${year}'`
          ).then((res) => {
            // setLstLuong(res.data);
            openNotificationWithIcon(
              "success",
              "Thêm file thủ thuật thành công"
            );
            // console.log(res);
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
            setLstTT(res.data.value);
            setIsLoadingTT(false);
          });
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
          // console.log(err.response);
          setIsLoadingTT(false);
        });
    }
  };
  const listFileUploadPT = (e) => {
    let formData = new FormData();
    formData.append("file", e[0].originFileObj);
    setFileExcelPT(formData);
  };

  const handleUploadFilePT = () => {
    if (_.isNull(watch().month)) {
      openNotificationWithIcon(
        "error",
        "Vui lòng chọn tháng/năm cập nhật file"
      );
    } else {
      const month =
        watch().month.month() + 1 < 10
          ? "0" + (watch().month.month() + 1)
          : watch().month.month() + 1;
      const year = watch().month.year();
      setIsLoadingPT(true);
      callApi(
        `odata/Surgerys/ImportExcel?month=${month}&year=${year}`,
        "POST",
        isFileExcelPT,
        "multipart/form-data"
      )
        .then((res) => {
          callApi(
            `odata/Surgerys?$filter=month eq '${month}' and year eq '${year}'`
          ).then((res) => {
            // console.log(res);
            // setLstLuong(res.data);
            openNotificationWithIcon(
              "success",
              "Thêm file phẫu thuật thành công"
            );
            // console.log(res);
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
            setLstPT(res.data.value);
            setIsLoadingPT(false);
          });
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
          // console.log(err.response);
          setIsLoadingPT(false);
        });
    }
  };

  return (
    <div className="bao-hiem">
      <PageHeader
        className="site-page-header"
        title={t("Thủ thuật phẫu thuật")}
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
          {/* <Col span={3}>
            <Input control={control} label="Tên nhân viên" name="nv_name" />
          </Col> */}

          <Col span={3}>
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
        <TabPane tab={"Thủ thuật"} key="1">
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
                label="File thủ thuật"
                listFile={listFileUploadTT}
                maxCount={1}
                fileType={[".xlsx", ".xlsm", ".xls"]}
              />
            </Col>
            <Col span={3}>
              <Button
                onClick={handleUploadFileTT}
                type="primary"
                disabled={_.isNull(isFileExcelTT)}
                loading={isLoadingTT}
                style={{ marginTop: 10 }}
              >
                Cập nhật file thủ thuật
              </Button>
            </Col>
          </Row>
          <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
            <DataGrid
              showPager={true}
              column={columns}
              data={lstTT}
              // allowView={true}
              dataKey={"id"}
              // showFilterRow={true}
              exportSampleFile={true}
              selectionChanged={selectedRow}
              infoText={`Tổng số nhân viên: ${lstTT.length}`}
              // viewObj={handleOpenDrawer1}
              selectionMode={"multiple"}
            />
          </div>
        </TabPane>
        <TabPane tab={"Phẫu thuật"} key="2">
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
                label="File phẫu thuật"
                listFile={listFileUploadPT}
                maxCount={1}
                fileType={[".xlsx", ".xlsm", ".xls"]}
              />
            </Col>
            <Col span={3}>
              <Button
                onClick={handleUploadFilePT}
                type="primary"
                disabled={_.isNull(isFileExcelPT)}
                loading={isLoadingPT}
                style={{ marginTop: 10 }}
              >
                Cập nhật file phẫu thuật
              </Button>
            </Col>
          </Row>
          <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
            <DataGrid
              showPager={true}
              column={columns}
              data={lstPT}
              // allowView={true}
              dataKey={"id"}
              // showFilterRow={true}
              exportSampleFile={true}
              selectionChanged={selectedRow}
              infoText={`Tổng số nhân viên: ${lstPT.length}`}

              // viewObj={handleOpenDrawer1}
            />
          </div>
        </TabPane>
        <TabPane tab={"Tiền Thủ thuật"} key="3">
          <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
            <DataGrid
              showPager={true}
              column={columnsMoney}
              data={lstTT}
              // allowView={true}
              dataKey={"id"}
              // showFilterRow={true}
              exportSampleFile={true}
              selectionChanged={selectedRow}
              // viewObj={handleOpenDrawer1}
              infoText={`Tổng số nhân viên: ${lstTT.length}`}
            />
          </div>
        </TabPane>
        <TabPane tab={"Tiền phẫu thuật"} key="4">
          <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
            <DataGrid
              showPager={true}
              column={columnsMoney}
              data={lstPT}
              // allowView={true}
              dataKey={"id"}
              // showFilterRow={true}
              exportSampleFile={true}
              selectionChanged={selectedRow}
              // viewObj={handleOpenDrawer1}
              infoText={`Tổng số nhân viên: ${lstPT.length}`}
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
    </div>
  );
}

ThuThuatPhauThuat.propTypes = {
  columns: PropTypes.array,
  columnsMoney: PropTypes.array,
};
ThuThuatPhauThuat.defaultProps = {
  columns: [
    {
      caption: "Mã NV",
      dataField: "staff_code_kt",
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
      caption: "Tên đơn vị",
      dataField: "department_name",
      type: 0,
      width: "10vw",
    },
    {
      caption: "Chính đặc biệt",
      dataField: "ch_db",
      type: 0,
    },
    {
      caption: "Phụ đặc biệt",
      dataField: "ph_db",
      type: 0,
    },
    {
      caption: "Giúp việc đặc biệt",
      dataField: "gv_db",
      type: 0,
    },
    {
      caption: "Chính loại 1",
      dataField: "ch_l1",
      type: 0,
    },
    {
      caption: "Phụ loại 1",
      dataField: "ph_l1",
      type: 0,
    },
    {
      caption: "Giúp việc loại 1",
      dataField: "gv_l1",
      type: 0,
    },
    {
      caption: "Chính loại 2",
      dataField: "ch_l2",
      type: 0,
    },
    {
      caption: "Phụ loại 2",
      dataField: "ph_l2",
      type: 0,
    },
    {
      caption: "Giúp việc loại 2",
      dataField: "gv_l2",
      type: 0,
    },
    {
      caption: "Chính loại 3",
      dataField: "ch_l3",
      type: 0,
    },
    {
      caption: "Phụ loại 3",
      dataField: "ph_l3",
      type: 0,
    },

    {
      caption: "Giúp việc loại 3",
      dataField: "gv_l3",
      type: 0,
    },
  ],
  columnsMoney: [
    {
      caption: "Mã NV",
      dataField: "staff_code_kt",
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
      caption: "Tên đơn vị",
      dataField: "department_name",
      type: 0,
      width: "10vw",
    },
    {
      caption: "Tiền chính đặc biệt",
      dataField: "ch_db_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền phụ đặc biệt",
      dataField: "ph_db_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền giúp việc đặc biệt",
      dataField: "gv_db_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền chính loại 1",
      dataField: "ch_l1_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền phụ loại 1",
      dataField: "ph_l1_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền giúp việc loại 1",
      dataField: "gv_l1_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền chính loại 2",
      dataField: "ch_l2_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền phụ loại 2",
      dataField: "ph_l2_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền giúp việc loại 2",
      dataField: "gv_l2_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền chính loại 3",
      dataField: "ch_l3_monney",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tiền phụ loại 3",
      dataField: "ph_l3_monney",
      type: 0,
      format: "Money",
    },

    {
      caption: "Tiền giúp việc loại 3",
      dataField: "gv_l3_monney",
      type: 0,
      format: "Money",
    },
  ],
};
export default ThuThuatPhauThuat;
