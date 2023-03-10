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
function ChucDanh(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstAcademicTitles, setLstAcademicTitles] = useState([]);
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
    const obj = _.find(lstAcademicTitles, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/AcademicTitles?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        console.log(res);
        setLstAcademicTitles(res.data.value);
      });
    } else {
      callApi(
        `odata/AcademicTitles?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        console.log(res);
        setLstAcademicTitles(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="thong-tin-luong">
      <h3>Ch???c danh khoa h???c</h3>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "400px" }}>
        <DataGrid
          column={columns}
          data={lstAcademicTitles}
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

ChucDanh.propTypes = {
  columns: PropTypes.array,
};
ChucDanh.defaultProps = {
  columns: [
    {
      caption: "Ch???c danh khoa h???c",
      dataField: "type_name",
      type: 0,
    },
    {
      caption: "N??m ???????c phong",
      dataField: "year",
      type: 0,
      customCellRender: (item) => {
        const status = item.data.year;
        return <span>{moment(status).format("YYYY")}</span>;
      },
    },
  ],
};

export default ChucDanh;
