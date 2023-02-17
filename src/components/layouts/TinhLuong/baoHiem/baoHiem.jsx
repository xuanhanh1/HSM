import { PageHeader } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNhanViens,
  getALLNhanViens,
} from "../../../../redux/actions/DanhMuc";
import { DataGrid, ToolBar, useLocalStorage, _ } from "../../index";
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";

function BaoHiem(props) {
  const { columns } = props;
  const { t } = useTranslation();
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
  const lstNhanViens = useSelector(
    (state) => state.DanhMucReducers.lstNhanViens
  );

  useEffect(() => {
    dispatch(getALLNhanViens(inforNhanVien.Id));
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
    const obj = _.find(lstNhanViens, (x) => x.id === params);
    console.log(obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    dispatch(deleteNhanViens(params.id));
  };
  return (
    <div className="bao-hiem">
      <PageHeader className="site-page-header" title={t("Bảo hiểm")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={[]}
          allowView={true}
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
        />
      ) : (
        <></>
      )}
      {/* {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null} */}
    </div>
  );
}

BaoHiem.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
BaoHiem.defaultProps = {
  columns: [
    {
      caption: "Mã cán bộ",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Họ và tên",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Số BHYT",
      dataField: "GIOITINH",
      type: 0,
    },
    {
      caption: "Số BHXH",
      dataField: "DIENTHOAI",
      type: 0,
    },
    {
      caption: "Nơi cấp",
      dataField: "DIACHI",
      type: 0,
    },
    {
      caption: "Nơi đăng kí khám chữa bệnh",
      dataField: "EMAIL",
      type: 0,
    },
    {
      caption: "Trạng thái sổ",
      dataField: "TEN_KP",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "position_name",
      type: 0,
    },
  ],
};
export default BaoHiem;
