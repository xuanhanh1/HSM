import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callApi, DataGrid, ToolBar, _ } from "../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function PhuCap(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstAllowances, setLstAllowances] = useState([]);
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
    const obj = _.find(lstAllowances, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };

  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/Allowances?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstAllowances(res.data.value);
        }
      );
    } else {
      callApi(
        `odata/Allowances?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstAllowances(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="phu-cap">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstAllowances}
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

PhuCap.propTypes = {
  columns: PropTypes.array,
};
PhuCap.defaultProps = {
  columns: [
    {
      caption: "Loại phụ cấp",
      dataField: "type_name",
      type: 0,
    },
    {
      caption: "Phần trăm thưởng",
      dataField: "percent",
      type: 0,
    },
    {
      caption: "Hệ số hưởng",
      dataField: "coef",
      type: 0,
    },
    {
      caption: "Ngày bắt đầu",
      dataField: "from",
      type: 0,

      format: "date",
    },
    {
      caption: "Ngày kết thúc",
      dataField: "to",
      type: 0,
      format: "date",
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default PhuCap;
