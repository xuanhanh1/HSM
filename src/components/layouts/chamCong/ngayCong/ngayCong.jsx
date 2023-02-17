import React, { useState, useEffect } from "react";
import { PageHeader } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getAllRoles } from "../../../../redux/actions/QuanTri";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import { DeleteTimesheetsCoeffs } from "../../../../redux/actions/DanhMuc";
function NgayCong(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const [lstAllNC, setLstAllNC] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    dispatch(getAllRoles());
  }, []);
  const handleDelete = (params) => {
    dispatch(DeleteTimesheetsCoeffs(params.id));
  };
  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    // setTimeout(() => {
    setStatusModal({
      isVisible: true,
      status,
    });
    // }, 500);
  };
  useEffect(() => {
    callApi("odata/TimesheetsCoeffs", "GET").then((res) => {
      setLstAllNC(res.data.value);
    });
  }, [isStatusModal.isVisible]);
  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lstAllNC, (x) => x.id === params);
    setObjEdit(obj);
  };

  return (
    <div>
      <PageHeader className="site-page-header" title={t("Ngày công")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstAllNC}
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

NgayCong.propTypes = {
  columns: PropTypes.array,
};
NgayCong.defaultProps = {
  columns: [
    {
      caption: "Kí hiệu",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Chú thích",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Ngày công quy đổi",
      dataField: "exchange_day",
      type: 0,
    },
    {
      caption: "BHXH chi trả",
      dataField: "is_insurance_paid",
      type: 0,
    },
    {
      caption: "Loại ngày",
      dataField: "date_type_name",
      type: 0,
    },
    {
      caption: "Hệ số",
      dataField: "date_type_coef",
      type: 0,
    },
  ],
};

export default NgayCong;
