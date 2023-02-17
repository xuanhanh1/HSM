import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { callApi, DataGrid, ToolBar, _, Select } from "../../../index";
import { useDispatch } from "react-redux";
import { deleteExtraSalaryTypes } from "../../../../../redux/actions/DanhMuc";
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";
import MonthPickerField from "../../../../../common/control/componentsForm/MonthPicker";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";

const CaNhan = (props) => {
  const { columns } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [loading, setLoading] = useState(false);
  const [lstKhoaPhong, setLstKhoaPhong] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [lstAllCT, setLstAllCT] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    callApi("odata/Departments", "GET").then((res) => {
      setLstKhoaPhong(res.data.value);
    });
  }, []);
  const callData = (month, year) => {
    callApi(
      `odata/ExtraSalarys?$filter=month eq '${month}' and year eq '${year}'`
    ).then((res) => {
      setLstAllCT(res.data.value?.list_extrasalary_staffs);
    });
  };
  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };
  const handleDelete = (params) => {
    dispatch(deleteExtraSalaryTypes(params.id));
    callData();
  };

  // useEffect(() => {
  //   callData();
  // }, [isStatusModal.isVisible]);
  const selectedRow = ([params]) => {
    const obj = _.find(lstAllCT, (x) => x.id === params);
    console.log(obj);
    setObjEdit(obj);
  };
  const handleSearch = () => {
    setLoading(true);
    const month =
      watch().month === null
        ? null
        : watch().month.month() + 1 < 10
        ? "0" + String(watch().month.month() + 1).slice(-2)
        : watch().month.month() + 1;
    const year = watch().month ? watch().month.year() : null;
    const deparment =
      watch().department_id === "" || watch().department_id === null
        ? ""
        : ` and department_id eq ${watch().department_id}`;
    callApi(
      `odata/ExtraSalarys?$filter=month eq '${month}' and year eq '${year}'${deparment}`
    ).then((res) => {
      console.log(res);
      setLstAllCT(res.data.value);
      setLoading(false);
    });
  };
  return (
    <div>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        // setEdit={() => handleOpenDrawer(1)}
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
        <DataGrid
          column={columns}
          data={lstAllCT}
          showPager={true}
          // allowView={true}
          dataKey={"id"}
          // showFilterRow={true}
          selectionChanged={selectedRow}
          infoText={`Tổng số nhân viên: ${lstAllCT.length}`}

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
};

CaNhan.propTypes = {
  columns: PropTypes.array,
};
CaNhan.defaultProps = {
  columns: [
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
      caption: "Tỉ lệ % (Trực tiếp)",
      dataField: "rate",
      type: 0,
    },
    {
      caption: "Điểm (Gián tiếp)",
      dataField: "mark",
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
      value:0,
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
export default CaNhan;
