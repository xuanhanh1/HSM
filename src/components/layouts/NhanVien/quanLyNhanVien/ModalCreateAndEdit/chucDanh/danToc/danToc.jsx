import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
import {
  useLocalStorage,
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  Notification,
  callApi,
  DataGrid,
  ToolBar,
} from "../../../../../index";
import { useForm } from "react-hook-form";
import YearPickerField from "../../../../../../../common/control/componentsForm/YearPicker";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function DanToc(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstEthnicLanguages, setLstEthnicLanguages] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };
  const handleOpenDrawerObj = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  const selectedRow = ([params]) => {
    const obj = _.find(lstEthnicLanguages, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/EthnicLanguages?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        console.log(res);
        setLstEthnicLanguages(res.data.value);
      });
    } else {
      callApi(
        `odata/EthnicLanguages?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        console.log(res);
        setLstEthnicLanguages(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="thong-tin-luong">
      <h3>Dân tộc</h3>

      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "400px" }}>
        <DataGrid
          column={columns}
          data={lstEthnicLanguages}
          // allowView={true}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawerObj}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          staffId={staffId}
          isParentStatus={isParentStatus}
          objParent={objParent}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

DanToc.propTypes = {
  columns: PropTypes.array,
};
DanToc.defaultProps = {
  columns: [
    {
      caption: "Tiếng dân tộc",
      dataField: "language_name",
      type: 0,
    },
    {
      caption: "Trình độ",
      dataField: "level_name",
      type: 0,
      format: "date",
    },
    {
      caption: "Cao nhất",
      dataField: "is_highest",
      type: 0,
    },
  ],
};

export default DanToc;
