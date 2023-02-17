import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import MonthPickerField from "../../../../common/control/componentsForm/MonthPicker";
import openNotificationWithIcon from "../../../../common/notification/notification";
// import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";
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
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";

function ThueThuNhapCaNhan(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [isFileExcel, setFileExcel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
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
    if (_.isNull(watch().search_month)) {
      openNotificationWithIcon("error", "Vui lòng chọn tháng/năm cần tìm");
      return;
    }
    // setLoading(true);
    const month =
      watch().search_month.month() + 1 < 10
        ? "0" + (watch().search_month.month() + 1)
        : watch().search_month.month() + 1;
    const year = watch().search_month.year();
    const deparment =
      watch().department_id === "" || watch().department_id === null
        ? ""
        : ` and department_id eq ${watch().department_id}`;
  };
  return (
    <div className="bao-hiem">
      <PageHeader
        className="site-page-header"
        title={t("Thuế thu nhập cá nhân")}
      />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
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
          <Col span={4}>
            <MonthPickerField
              label="Thời gian"
              name="NGAY"
              defaultValue={moment()}
              control={control}
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
          data={lstLuong}
          // allowView={true}
          dataKey={"id"}
          // showFilterRow={true}
          selectionChanged={selectedRow}
          // viewObj={handleOpenDrawer1}
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

ThueThuNhapCaNhan.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
ThueThuNhapCaNhan.defaultProps = {
  columns: [
    {
      caption: "Mã NV",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Họ tên",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Khoa/phòng",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Tổng lương tháng được chọn",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Tổng thu nhập trong năm đến tháng được chọn",
      dataField: "GIOITINH",
      type: 0,
    },
    {
      caption: "Các khoản giảm trừ",
      dataField: "DIENTHOAI",
      type: 0,
    },
    {
      caption: "Tổng thu nhập chịu thuế",
      dataField: "DIACHI",
      type: 0,
    },
    {
      caption: "Thuế TNCN",
      dataField: "EMAIL",
      type: 0,
    },
    {
      caption: "Thực lãnh",
      dataField: "TEN_KP",
      type: 0,
    },
  ],
};
export default ThueThuNhapCaNhan;
