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
} from "../../../../index";
import { useForm } from "react-hook-form";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function QuaTrinhNVCongTac(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstNVCongTac, setLstNVCongTac] = useState([]);
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
    const obj = _.find(lstNVCongTac, (x) => x.id === params);
    // console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/WorkingProcesss?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        setLstNVCongTac(res.data.value);
      });
    } else {
      callApi(
        `odata/WorkingProcesss?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstNVCongTac(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="quy-hoach-can-bo">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstNVCongTac}
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

QuaTrinhNVCongTac.propTypes = {
  columns: PropTypes.array,
};
QuaTrinhNVCongTac.defaultProps = {
  columns: [
    {
      caption: "Thời gian bắt đầu",
      dataField: "from",
      type: 0,
      format: "date",
    },
    {
      caption: "Thời gian kết thúc",
      dataField: "to",
      type: 0,
      format: "date",
    },
    {
      caption: "Cơ quan,chức vụ,chức danh",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Số quyết định",
      dataField: "decision_number",
      type: 0,
    },
    {
      caption: "Người ký",
      dataField: "signer",
      type: 0,
    },
    {
      caption: "Ngày ký",
      dataField: "signing_date",
      type: 0,
      format: "date",
    },
  ],
};

export default QuaTrinhNVCongTac;
