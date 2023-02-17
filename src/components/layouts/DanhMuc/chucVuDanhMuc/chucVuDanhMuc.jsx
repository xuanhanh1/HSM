import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PageHeader } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _ } from "../../index";
import { useTranslation } from "react-i18next";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import {
  deletePositions,
  getALLPositions,
} from "../../../../redux/actions/DanhMuc";

function ChucVuDanhMuc(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lstPositions = useSelector(
    (state) => state.DanhMucReducers.lstPositions
  );
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    dispatch(getALLPositions());
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
    const obj = _.find(lstPositions, (x) => x.id === params);
    setObjEdit(obj);
  };

  const handleDelete = (params) => {
    dispatch(deletePositions(params.id));
  };
  console.log(lstPositions);
  return (
    <div>
      <PageHeader className="site-page-header" title={t("ChucVu")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstPositions}
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

ChucVuDanhMuc.propTypes = {
  columns: PropTypes.array,
};
ChucVuDanhMuc.defaultProps = {
  columns: [
    {
      caption: "Tên chức vụ",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Mã chức vụ",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Ghi Chú",
      dataField: "note",
      type: 0,
    },
  ],
};
export default ChucVuDanhMuc;
