import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
import {
  useLocalStorage,
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  Notification,
  ToolBar,
  callApi,
  DataGrid,
} from "../../../../../index";
import { useForm } from "react-hook-form";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function QuanLyNhaNuoc(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstStateManagements, setLstStateManagements] = useState([]);
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
    const obj = _.find(lstStateManagements, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/StateManagements?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        setLstStateManagements(res.data.value);
      });
    } else {
      callApi(
        `odata/StateManagements?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstStateManagements(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="quan-ly-nha-nuoc">
      <h3>Quản lý nhà nước</h3>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "400px" }}>
        <DataGrid
          column={columns}
          data={lstStateManagements}
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

QuanLyNhaNuoc.propTypes = {
  columns: PropTypes.array,
};
QuanLyNhaNuoc.defaultProps = {
  columns: [
    {
      caption: "Chương trình quản lí nhà nước",
      dataField: "type_name",
      type: 0,
    },
    {
      caption: "Ngày cấp",
      dataField: "issue_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Nơi cấp",
      dataField: "issue_place",
      type: 0,
    },
  ],
};

export default QuanLyNhaNuoc;
