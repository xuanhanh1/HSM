import React, { useState, useEffect } from "react";
import { PageHeader } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGridOdata, _ } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  getALLDepartments,
  deleteDepartments,
} from "../../../../redux/actions/DanhMuc";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import DrawerKhoaPhong from "./DrawerKhoaPhong/DrawerKhoaPhong";
function KhoaPhong(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [urlKhoaPhong, setUrlKhoaPhong] = useState("/odata/Departments");
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  //Chọn Row Datagrid
  const selectedRow = (selectedObject) => {
    setObjEdit(selectedObject);
  };

  const handleDelete = (params) => {
    dispatch(deleteDepartments(params.id));
    if (urlKhoaPhong === "/odata/Departments") {
      setUrlKhoaPhong("/odata/departments");
    } else {
      setUrlKhoaPhong("/odata/Departments");
    }
  };
  const setUrlApi = (object) => {
    setUrlKhoaPhong(object);
  };
  const handleOpenDrawerKhoaPhong = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  return (
    <div>
      <PageHeader className="site-page-header" title={t("KhoaPhong")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView">
        <DataGridOdata
          column={columns}
          urlApi={urlKhoaPhong}
          dataKey={"id"}
          pageSize={20}
          fieldTypes={{
            id: "String",
          }}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawerKhoaPhong}
          allowView={true}
        />
      </div>
      {isStatusModal.isVisible && (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          setUrlKhoaPhong={setUrlApi}
          urlApi={urlKhoaPhong}
        />
      )}
      {isOpenDrawer.isVisible && (
        <DrawerKhoaPhong
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      )}
    </div>
  );
}

KhoaPhong.propTypes = {
  columns: PropTypes.array,
  IDepartments: PropTypes.object,
};
KhoaPhong.defaultProps = {
  columns: [
    {
      caption: "Tên bệnh viện",
      dataField: "hospital_name",
      type: 0,
    },
    {
      caption: "Mã khoa/phòng",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Tên khoa/phòng",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Tên khoa/phòng trực thuộc",
      dataField: "department_parent_name",
      type: 0,
    },
    {
      caption: "Lãnh đạo",
      dataField: "leader",
      type: 0,
    },
    {
      caption: "Điện thoại",
      dataField: "phone",
      type: 0,
    },
  ],
};

export default KhoaPhong;
