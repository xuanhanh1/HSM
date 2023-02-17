import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { PageHeader } from "antd";
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
import { ToolBar, DataGrid, _, callApi, useLocalStorage } from "../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import { deleteTaiLieu } from "../../../../redux/actions/TaiLieu";

function QuanLyTaiLieu(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [inforHocVien, setInforHocVien] = useLocalStorage("inforStudent", {});
  const [lstDocuments, setLstDocuments] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    callApi("odata/Documents?$expand=files,questions", "GET").then((res) => {
      const arr = [];
      res.data.forEach((item) => {
        if (item.files.length > 0) {
          item.files.forEach((file) => {
            arr.push({ ...file, nameTL: item.name, ...item });
          });
        }
      });
      //
      // console.log(arr);
      setLstDocuments(arr);
    });
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
    const obj = _.find(lstDocuments, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    dispatch(deleteTaiLieu(params.id));
  };

  //---------------------------------------------------------

  //---------------------------------------------------------

  return (
    <div className="quan-ly-NV">
      <PageHeader className="site-page-header" title={t("QuanLyTL")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstDocuments}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
          // allowView={true}
        />
      </div>

      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          inforHocVien={inforHocVien}
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

QuanLyTaiLieu.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
QuanLyTaiLieu.defaultProps = {
  columns: [
    {
      caption: "Tên tài liệu",
      dataField: "nameTL",
      type: 0,
      width: "",
    },
    {
      caption: "Tên File",
      dataField: "name",
      type: 0,
      width: "",
    },
    {
      caption: "Link File",
      dataField: "link",
      type: 0,
      customCellRender: (item) => {
        const link = item.data.link + item.data.name;
        return (
          <a href={link} download>
            {link}
          </a>
        );
      },
    },
    {
      caption: "Ngày tạo",
      dataField: "create_date",
      type: 0,
      width: "",
      format: "date",
    },
    {
      caption: "Người tạo",
      dataField: "creator_code",
      type: 0,
      width: "",
    },
  ],
};
export default QuanLyTaiLieu;
