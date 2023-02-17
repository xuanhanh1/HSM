import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { DataGrid, ToolBar, callApi, _ } from "../../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";

function TaiSanKhac(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [lstMovables, setLstMovables] = useState([]);
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
    const obj = _.find(lstMovables, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/Movables?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstMovables(res.data.value);
        }
      );
    } else {
      callApi(`odata/Movables?$filter=staff_id eq ${objParent.id}`, "GET").then(
        (res) => {
          setLstMovables(res.data.value);
        }
      );
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="tai-san-khac">
      <h3>Tài sản khác</h3>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "400px" }}>
        <DataGrid
          column={columns}
          data={lstMovables}
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

TaiSanKhac.propTypes = {
  columns: PropTypes.array,
};
TaiSanKhac.defaultProps = {
  columns: [
    {
      caption: "Tiền",
      dataField: "cash",
      type: 0,
    },
    {
      caption: "Phương tiện di chuyển",
      dataField: "transport",
      type: 0,
    },
    {
      caption: "Kim loại đá quý",
      dataField: "gemstone_stock",
      type: 0,
    },
    {
      caption: "Các loại tài sản khác",
      dataField: "other_assets",
      type: 0,
    },
    {
      caption: "Tài sản nước ngoài",
      dataField: "foreign",
      type: 0,
    },
    {
      caption: "Các khoản nợ",
      dataField: "debt",
      type: 0,
    },
    {
      caption: "Tổng thu nhập trong năm",
      dataField: "annual_income",
      type: 0,
    },
  ],
};
export default TaiSanKhac;
