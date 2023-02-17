import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { callApi, DataGrid, ToolBar, _, moment } from "../../../index";
import { useDispatch } from "react-redux";
import { deleteExtraSalaryTypes } from "../../../../../redux/actions/DanhMuc";
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";
import { Button, Col, Row } from "antd";
import MonthPickerField from "../../../../../common/control/componentsForm/MonthPicker";
import { SearchOutlined } from "@ant-design/icons";

const CongThucTNTT = (props) => {
  const { columns } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [loading, setLoading] = useState(false);

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

  const callData = (month, year) => {
    callApi(
      `odata/ExtraSalaryTypes?$filter=month eq '${month}' and year eq '${year}'`
    ).then((res) => {
      setLstAllCT(res.data.value);
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
    callApi(
      `odata/ExtraSalaryTypes?$filter=month eq '${month}' and year eq '${year}'`
    ).then((res) => {
      console.log(res);
      setLstAllCT(res.data.value);
      setLoading(false);
    });
  };
  return (
    <div>
      <ToolBar
        titleAdd={"Thêm công thức tính TNTT"}
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
};

CongThucTNTT.propTypes = {
  columns: PropTypes.array,
};
CongThucTNTT.defaultProps = {
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
};
export default CongThucTNTT;
