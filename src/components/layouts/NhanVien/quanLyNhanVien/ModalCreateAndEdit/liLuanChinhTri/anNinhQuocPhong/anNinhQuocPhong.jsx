import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callApi, DataGrid, ToolBar, _ } from "../../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function AnNinhQuocPhong(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstNationalSecuritys, setLstNationalSecuritys] = useState([]);
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
    const obj = _.find(lstNationalSecuritys, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/NationalSecuritys?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        setLstNationalSecuritys(res.data.value);
      });
    } else {
      callApi(
        `odata/NationalSecuritys?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstNationalSecuritys(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="an-ninh-quoc-phong">
      <h3>An ninh quốc phòng</h3>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "400px" }}>
        <DataGrid
          column={columns}
          data={lstNationalSecuritys}
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

AnNinhQuocPhong.propTypes = {
  columns: PropTypes.array,
};
AnNinhQuocPhong.defaultProps = {
  columns: [
    {
      caption: "Nội dung",
      dataField: "content",
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

export default AnNinhQuocPhong;
