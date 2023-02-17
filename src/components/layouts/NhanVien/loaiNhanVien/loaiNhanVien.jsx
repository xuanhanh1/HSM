import React, { useState, useEffect } from "react";
import { PageHeader } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getAllRoles } from "../../../../redux/actions/QuanTri";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import { DeleteStaffTypes } from "../../../../redux/actions/Users";
function LoaiNhanVien(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const [lstStaffTypes, setLstStaffTypes] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    dispatch(getAllRoles());
  }, []);

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    // setTimeout(() => {
    setStatusModal({
      isVisible: true,
      status,
    });
    // }, 500);
  };
  const handleDelete = (params) => {
    console.log(params);
    dispatch(DeleteStaffTypes(params.id));
  };
  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lstStaffTypes, (x) => x.id === params);
    setObjEdit(obj);
  };
  useEffect(() => {
    callApi("odata/StaffTypes").then((res) => {
      setLstStaffTypes(res.data.value);
    });
  }, [isStatusModal.isVisible]);

  return (
    <div>
      <PageHeader className="site-page-header" title={t("LoaiNhanVien")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstStaffTypes}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          exportExcel={false}
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
    </div>
  );
}

LoaiNhanVien.propTypes = {
  columns: PropTypes.array,
};
LoaiNhanVien.defaultProps = {
  columns: [
    {
      caption: "Mã loại cán bộ",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Loại cán bộ",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Sử dụng",
      dataField: "is_using",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default LoaiNhanVien;
