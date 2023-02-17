import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Radio, Row } from "antd";
import {
  useLocalStorage,
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  Notification,
  callApi,
  DataGrid,
  ToolBar,
} from "../../../../index";
import { useForm } from "react-hook-form";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function ThongTinKyLuat(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstDisciplines, setLstDisciplines] = useState([]);
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
  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };
  const handleOpenDrawerObj = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  const selectedRow = ([params]) => {
    const obj = _.find(lstDisciplines, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/Disciplines?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstDisciplines(res.data.value);
        }
      );
    } else {
      callApi(
        `odata/Disciplines?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstDisciplines(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="thong-tin-luong">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstDisciplines}
          // allowView={true}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawerObj}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          staffId={staffId}
          isParentStatus={isParentStatus}
          objParent={objParent}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

ThongTinKyLuat.propTypes = {
  columns: PropTypes.array,
};
ThongTinKyLuat.defaultProps = {
  columns: [
    {
      caption: "Hình thức kỷ luật",
      dataField: "form_name",
      type: 0,
    },
    {
      caption: "Cơ quan ban hành",
      dataField: "agency_issued",
      type: 0,
    },
    {
      caption: "Ngày ký",
      dataField: "signing_date",
      type: 0,

      format: "date",
    },
    {
      caption: "số quyết định",
      dataField: "decision_number",
      type: 0,
    },
    {
      caption: "Thời gian hiệu lực",
      dataField: "duration",
      type: 0,
    },
    {
      caption: "Thời gian kéo dài nâng lương",
      dataField: "delay_salary_increase",
      type: 0,
    },
    {
      caption: "Cao nhất",
      dataField: "is_highest",
      type: 0,
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default ThongTinKyLuat;
