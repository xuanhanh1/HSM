import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { PageHeader, Row, Col, Button } from "antd";
import {
  getALLNhanViens,
  getALLNhanVienInDanhMuc,
  deleteNhanViens,
} from "../../../../redux/actions/DanhMuc";
import {
  ToolBar,
  DataGrid,
  _,
  Select,
  callApi,
  Notification,
  DataGridOdata,
  useLocalStorage,
} from "../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import DrawerChiTiet from "./ChiTietNhanvien/drawerChiTiet";
const arr = [];
const selectRating = () => {
  callApi("odata/AvailableCatalogs/Ratings").then((res) => {
    arr.push(...res.data);
    return res;
  });
};
selectRating();
function QuanLyNhanVien(props) {
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
  const totalNvInvailabe =
    lstNhanViens.length -
    1 -
    _.countBy(
      lstNhanViens,
      (item) =>
        item.staff_status_name === "Thôi việc" ||
        item.staff_status_name === null
    ).true;
  const selectedRow = ([params]) => {
    const obj = _.find(lstNhanViens, (x) => x.id === params);
    console.log(obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    dispatch(deleteNhanViens(params.id));
  };
  const handleRowChange = (e) => {
    console.log(e);
  };
  return (
    <div className="quan-ly-NV">
      <PageHeader className="site-page-header" title={t("QuanLyNV")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstNhanViens}
          allowView={true}
          showPager={true}
          dataKey={"id"}
          handleRowChange={handleRowChange}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
          infoText={`Số lượng nhân viên đang còn làm việc: ${totalNvInvailabe}`}
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

QuanLyNhanVien.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
QuanLyNhanVien.defaultProps = {
  columns: [
    {
      caption: "Mã cán bộ",
      dataField: "code",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Họ và tên",
      dataField: "name",
      type: 0,
      width: "12vw",
    },
    {
      caption: "Giới tính",
      dataField: "sex_name",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Điện thoại",
      dataField: "phone",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Địa chỉ",
      dataField: "address",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Email",
      dataField: "email",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Tên khoa/phòng",
      dataField: "department_name",
      type: 0,
      width: "12vw",
    },
    {
      caption: "Tên chức vụ",
      dataField: "position_name",
      type: 0,
      // width: "5vw",
    },
    {
      caption: "Trạng thái",
      dataField: "staff_status_name",
      type: 0,
      // width: "5vw",
    },
  ],
};
export default QuanLyNhanVien;
