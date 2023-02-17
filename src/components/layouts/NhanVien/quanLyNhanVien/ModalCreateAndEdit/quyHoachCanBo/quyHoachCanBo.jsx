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
  callApi,
  ToolBar,
  DataGrid,
} from "../../../../index";
import { useForm } from "react-hook-form";
import YearPickerField from "../../../../../../common/control/componentsForm/YearPicker";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function QuyHoachCanBo(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstQHCB, setLstQHCB] = useState([]);
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
    const obj = _.find(lstQHCB, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/StaffPlannings?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        setLstQHCB(res.data.value);
      });
    } else {
      callApi(
        `odata/StaffPlannings?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstQHCB(res.data.value);
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
          data={lstQHCB}
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

QuyHoachCanBo.propTypes = {
  columns: PropTypes.array,
};
QuyHoachCanBo.defaultProps = {
  columns: [
    {
      caption: "Năm quy hoạch",
      dataField: "year",
      type: 0,
    },
    {
      caption: "Năm bắt đầu",
      dataField: "from",
      type: 0,
    },
    {
      caption: "Năm kết thúc",
      dataField: "to",
      type: 0,
    },
    {
      caption: "Chức danh quy hoạch 1",
      dataField: "agency1_name",
      type: 0,
    },
    {
      caption: "Đơn vị quy hoạch 1",
      dataField: "title1__name",
      type: 0,
    },
    {
      caption: "Chức danh quy hoạch 2",
      dataField: "agency2_name",
      type: 0,
    },
    {
      caption: "Đơn vị quy hoạch 2",
      dataField: "title2__name",
      type: 0,
    },
    {
      caption: "Chức danh quy hoạch 3",
      dataField: "agency2_name",
      type: 0,
    },
    {
      caption: "Đơn vị quy hoạch 3",
      dataField: "title3_name",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default QuyHoachCanBo;
