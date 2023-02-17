import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { PageHeader, } from "antd";

import {
  ToolBar,
  DataGrid,
  _,



  useLocalStorage,
} from "../../index";
import { getAllTranning } from "../../../../redux/actions/TaiLieu"
import DrawerChiTiet from "./ChiTietKhoaHoc/DrawerChiTiet"
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit"

function QuanLyKhoaHoc(props) {
  const { columns } = props;

  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [inforNhanVien, setInforNhanVien] = useLocalStorage("infoNV", {});

  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const lstTrannings = useSelector(
    (state) => state.TaiLieuReducer.lstTrannings
  );

  useEffect(() => {
    dispatch(getAllTranning());
  }, [isStatusModal.isVisible]);

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
    const obj = _.find(lstTrannings, (x) => x.id === params);
    console.log("🚀 ~ selectedRow ~ obj", obj)
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteNhanViens(params.Id));
  };
  return (
    <div className="quan-ly-KH">
      <PageHeader className="site-page-header" title={"Quản lý khóa học"} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstTrannings}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
          allowView={true}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          nhanVienInfor={inforNhanVien.id}
        />
      ) : null}
      {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null}
    </div>
  );

}

QuanLyKhoaHoc.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
QuanLyKhoaHoc.defaultProps = {
  columns: [
    {
      caption: "Tên khóa học",
      dataField: "name",
      type: 0,
      width: "",
    },
    {
      caption: "Nội dung khóa học",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Ngày bắt đầu",
      dataField: "from",
      type: 0,
      format: "date"
    },
    {
      caption: "Ngày kết thúc",
      dataField: "to",
      type: 0,
      format: "date"
    },
    {
      caption: "Ngày tạo",
      dataField: "creating_date",
      type: 0,
      format: "date"
    },
    {
      caption: "Người tạo",
      dataField: "personCreate",
      type: 0,
      width: "",
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
      width: "",
    },
  ],
};

export default QuanLyKhoaHoc;
