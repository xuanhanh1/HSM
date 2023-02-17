import { PageHeader, Tabs } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { deleteSurgeryBenefits } from "../../../../redux/actions/DanhMuc";
import { callApi, DataGrid, ToolBar, _ } from "../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
const { TabPane } = Tabs;
function PhuCapThuThuatPhauThuat(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [lstAll, setLstAll] = useState([]);
  const handleDelete = (params) => {
    dispatch(deleteSurgeryBenefits(params.id));
    callData();
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
  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lstAll, (x) => x.id === params);
    setObjEdit(obj);
  };
  const callData = () => {
    callApi("odata/SurgeryBenefits").then((res) => {
      setLstAll(res.data.value);
    });
  };
  useEffect(() => {
    callData();
  }, [isStatusModal.isVisible]);
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title={t("Đặc thù thủ thuật phẫu thuật")}
      />
      <ToolBar
        // setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstAll}
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

PhuCapThuThuatPhauThuat.propTypes = {
  columns: PropTypes.array,
};
PhuCapThuThuatPhauThuat.defaultProps = {
  columns: [
    {
      caption: "Thủ thuật/Phẩu thuật",
      dataField: "surgery_type_name",
      type: 0,
    },
    {
      caption: "Mã thủ thuật/phẩu thuật",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Loại",
      dataField: "type",
      type: 0,
    },
    {
      caption: "Đối tượng",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Tiền",
      dataField: "money",
      type: 0,
      format: "Money",
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

export default PhuCapThuThuatPhauThuat;
