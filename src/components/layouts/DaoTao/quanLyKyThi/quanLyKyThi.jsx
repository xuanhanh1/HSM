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
import { getAllTranning, getAllTest } from "../../../../redux/actions/TaiLieu"
import DrawerChiTiet from "./ChiTietKyThi/DrawerChiTiet"
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit"

function QuanLyKyThi(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [inforNhanVien, setInforNhanVien] = useLocalStorage("infoNV", {});
  const [lstDocuments, setLstDocuments] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const lstTrannings = useSelector(
    (state) => state.TaiLieuReducer.lstTrannings
  );
  const lstTests = useSelector((state) => state.TaiLieuReducer.lstTests)

  useEffect(() => {
    dispatch(getAllTranning());
    dispatch(getAllTest());
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
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    dispatch(deleteNhanViens(params.Id));
  };
  return (
    <div className="quan-ly-KT">
      <PageHeader className="site-page-header" title={"Quản lý kỳ thi"} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstTests}
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



QuanLyKyThi.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
QuanLyKyThi.defaultProps = {
  columns: [

    {
      caption: "Tên bài test",
      dataField: "name",
      type: 0,
      width: "",
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Thời gian làm bài",
      dataField: "test_time",
      type: 0,
      format: "number"
    },
    {
      caption: "Điểm cao nhất",
      dataField: "max_score",
      type: 0,
      format: "number"
    },
    {
      caption: "Điểm thấp nhất",
      dataField: "min_score",
      type: 0,
      format: "number"
    },
    // {
    //   caption: "Khóa học",
    //   dataField: "",
    //   type: 0,
    //   width: "",
    // },
    {
      caption: "Người hướng dẫn ",
      dataField: "creator",
      type: 0,
      width: "",
    },
    {
      caption: "Ngày tạo",
      dataField: "creating_date",
      type: 0,
      format: "date"
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
      width: "",
    },
  ],
};

export default QuanLyKyThi;
