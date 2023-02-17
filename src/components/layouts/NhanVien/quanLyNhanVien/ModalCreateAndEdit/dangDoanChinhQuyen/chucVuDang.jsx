import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callApi, DataGrid, ToolBar, _ } from "../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function ChucVuDang(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstChucVuDang, setLstChucVuDang] = useState([]);
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
    const obj = _.find(lstChucVuDang, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/PartyGovernments?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        setLstChucVuDang(res.data.value);
      });
    } else {
      callApi(
        `odata/PartyGovernments?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstChucVuDang(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="chuc-vu-dang">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstChucVuDang}
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

ChucVuDang.propTypes = {
  columns: PropTypes.array,
};
ChucVuDang.defaultProps = {
  columns: [
    {
      caption: "Chức vụ",
      dataField: "is_position",
      type: 0,
      customCellRender: (item) => {
        const status = item.data.is_position;
        return <span>{status ? "Đảng/Đoàn" : "Chính quyền"}</span>;
      },
    },
    {
      caption: "Số quyết định",
      dataField: "decision_mumber",
      type: 0,
    },
    {
      caption: "Ngày ký",
      dataField: "signing_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Người ký",
      dataField: "signer",
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
      caption: "Chức vụ",
      dataField: "party_position_name",
      type: 0,
    },
    {
      caption: "Phụ cấp",
      dataField: "allowance_money",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default ChucVuDang;
