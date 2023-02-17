import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PageHeader } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, callApi } from "../../index";
import { useTranslation } from "react-i18next";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import {
  deletePositions,
  getALLPositions,
} from "../../../../redux/actions/DanhMuc";

function CongThucTNTT(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const [allCt, setAllCt] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  useEffect(() => {
    callApi("odata/ExtraSalaryFormulas").then((res) => {
      setAllCt(res.data.value);
    });
  }, []);

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };
  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    // const obj = _.find(lstPositions, (x) => x.id === params);
    // setObjEdit(obj);
  };

  const handleDelete = (params) => {
    dispatch(deletePositions(params.id));
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title={t("Công thức tính thu nhập tăng thêm")}
      />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        // setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView">
        <DataGrid
          column={columns}
          data={allCt}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
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

CongThucTNTT.propTypes = {
  columns: PropTypes.array,
};
CongThucTNTT.defaultProps = {
  columns: [
    {
      caption: "Tên công thức",
      dataField: "name",
      type: 0,
    },

    {
      caption: "Cách tính",
      dataField: "note",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "note",
      type: 0,
    },
    {
      caption: "Tỉ lệ",
      dataField: "note",
      type: 0,
    },
  ],
};
export default CongThucTNTT;
