import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { DataGrid, ToolBar, callApi, _, moment } from "../../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";

function QuyenSuDungDat(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [lstImmovables, setLstImmovables] = useState([]);
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
  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  const selectedRow = ([params]) => {
    const obj = _.find(lstImmovables, (x) => x.id === params);
    setObjEdit(obj);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/Immovables?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstImmovables(res.data.value);
        }
      );
    } else {
      callApi(
        `odata/Immovables?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstImmovables(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="quyen-su-dung-dat">
      <h3>Quyền sử dụng đất</h3>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "400px" }}>
        <DataGrid
          column={columns}
          data={lstImmovables}
          // allowView={true}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
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

QuyenSuDungDat.propTypes = {
  columns: PropTypes.array,
};
QuyenSuDungDat.defaultProps = {
  columns: [
    {
      caption: "Loại tài sản",
      dataField: "immovables_type_name",
      type: 0,
    },
    {
      caption: "Tên mảnh đất",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Địa chỉ",
      dataField: "address",
      type: 0,
    },
    {
      caption: "Diện tích",
      dataField: "area",
      type: 0,
    },
    {
      caption: "Giá trị",
      dataField: "value",
      type: 0,
    },
    {
      caption: "Giấy chứng nhận",
      dataField: "title_deed",
      type: 0,
    },
    {
      caption: "Năm",
      dataField: "year",
      type: 0,
      customCellRender: (item) => {
        const status = item.data.year;
        return <span>{moment(status).format("YYYY")}</span>;
      },
    },
    {
      caption: "Thông tin khác",
      dataField: "note",
      type: 0,
    },
  ],
};
export default QuyenSuDungDat;
