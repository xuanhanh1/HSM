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
import {
  callApi,
  DataGrid,
  Input,
  moment,
  useLocalStorage,
  Select,
  _,
} from "../../index";
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";

function PhuCapDacThu(props) {
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
  useEffect(() => {
    dispatch(getALLNhanViens(inforNhanVien.Id));
  }, [isStatusModal.isVisible]);
  useEffect(() => {
    const month =
      moment().month() + 1 < 10
        ? "0" + (moment().month() + 1)
        : moment().month() + 1;

    callApi(
      `odata/SpecialSalaries?$filter=month eq '${month}' and year eq '${moment().year()}'`
    ).then((res) => {
      // console.log(res);
      setLstLuong(res.data.value);
    });
  }, []);
  const selectedRow = (parmas) => {
    console.log(
      "🚀 ~ file: phuCapDacThu.jsx ~ line 76 ~ selectedRow ~ parmas",
      parmas
    );
  };
  const handleSearch = () => {
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

    console.log(
      `odata/SpecialSalaries?$filter=month eq '${month}' and year eq '${year}'${deparment}`
    );
    callApi(
      `odata/SpecialSalaries?$filter=month eq '${month}' and year eq '${year}'${deparment}`
    )
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setLstLuong(res.data.value);
      })
      .catch((err) => {
        openNotificationWithIcon("warning", err.response.data.errors[0]);
        console.log(err.response);
        setIsLoading(false);
      });
  };

  return (
    <div className="bao-hiem">
      <PageHeader className="site-page-header" title={t("Phụ cấp đặc thù")} />
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
              defaultValue={moment().startOf("months")}
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
      {/* <Row gutter={[8, 0]} className="upload-toolbar">
        <Col span={3}>
          <MonthPickerField
            label="Tháng"
            name="month"
            defaultValue={moment().startOf("months")}
            control={control}
          />
        </Col>
        <Col span={3}>
          <UploadFile
            label="File đặc thù"
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
            Cập nhật file đặc thù
          </Button>
        </Col>
      </Row> */}
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
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

PhuCapDacThu.propTypes = {
  columns: PropTypes.array,
};
PhuCapDacThu.defaultProps = {
  columns: [
    {
      caption: "Mã cán bộ",
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
      caption: "Hệ số đặc thù",
      dataField: "special_coeff",
      type: 0,
    },
    {
      caption: "Tiền đặc thù",
      dataField: "special_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Nghỉ thai sản",
      dataField: "exceed_maternity_day_off",
      type: 0,
    },
    {
      caption: "Nghỉ ốm",
      dataField: "sick_day_off",
      type: 0,
    },
    {
      caption: "Nghỉ không lương",
      dataField: "unpaid_day_off",

      type: 0,
    },
    {
      caption: "Nghỉ đi học",
      dataField: "study_day_off",
      type: 0,
    },
    {
      caption: "Tổng tiền chưa thuế",
      dataField: "total_salary",
      type: 0,
      format: "Money",
    },
    {
      caption: "Thuế",
      dataField: "tax",
      type: 0,
      format: "Money",
    },

    {
      caption: "Tổng tiền sau thuế",
      dataField: "special_salary_received",
      type: 0,
      format: "Money",
    },
  ],
};
export default PhuCapDacThu;
