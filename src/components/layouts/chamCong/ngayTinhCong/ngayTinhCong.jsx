import React, { useState, useEffect } from "react";
import { PageHeader } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getAllRoles } from "../../../../redux/actions/QuanTri";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import { deleteStandardTimes } from "../../../../redux/actions/DanhMuc";
function NgayTinhCong(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [lstTinhCong, setLstTinhCong] = useState([]);
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    dispatch(getAllRoles());
  }, []);

  const handleOpenDrawer = (status) => {
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lstTinhCong, (x) => x.id === params);
    setObjEdit(obj);
  };
  const getAllStandardTimes = () => {
    callApi("odata/StandardTimes").then((res) => {
      console.log(res);
      setLstTinhCong(res.data.value);
    });
  };
  useEffect(() => {
    getAllStandardTimes();
  }, [isStatusModal.isVisible]);
  const handleDelete = (params) => {
    dispatch(deleteStandardTimes(params.id));
    getAllStandardTimes();
  };
  return (
    <div>
      <PageHeader className="site-page-header" title={t("Ngày tính công")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstTinhCong}
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

NgayTinhCong.propTypes = {
  columns: PropTypes.array,
  ITrangThietBis: PropTypes.object,
};
NgayTinhCong.defaultProps = {
  columns: [
    {
      caption: "Tháng",
      dataField: "month",
      type: 0,
    },
    {
      caption: "Năm",
      dataField: "year",
      type: 0,
    },
    {
      caption: "Số ngày trong tháng",
      dataField: "quantity_day",
      type: 0,
    },
    {
      caption: "Số ngày làm việc trong tháng",
      dataField: "weekday",
      type: 0,
    },

    {
      caption: "Số ngày nghỉ cuối tuần ",
      dataField: "weekend",
      type: 0,
    },
    {
      caption: "Số ngày lễ tết",
      dataField: "holiday",
      type: 0,
    },
    // {
    //   caption: "Số đêm",
    //   dataField: "night",
    //   type: 0,
    // },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default NgayTinhCong;
