import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Radio, Row } from "antd";
import {
  useLocalStorage,
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  Notification,
  FormatDate,
  ToolBar,
  callApi,
  DataGrid,
} from "../../../../index";
import { useForm } from "react-hook-form";
import YearPickerField from "../../../../../../common/control/componentsForm/YearPicker";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function QuanHeGiaDinh(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstQHGD, setLstQHGD] = useState([]);
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
    const obj = _.find(lstQHGD, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/FamilyRelationships?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        setLstQHGD(res.data.value);
      });
    } else {
      callApi(
        `odata/FamilyRelationships?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstQHGD(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="quan-he-gia-dinh">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstQHGD}
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

QuanHeGiaDinh.propTypes = {
  columns: PropTypes.array,
};
QuanHeGiaDinh.defaultProps = {
  columns: [
    {
      caption: "Kiểu quan hệ",
      dataField: "belong_to",
      type: 0,
      customCellRender: (item) => {
        const status = item.data.belong_to;
        return <span>{status ? "Vợ hoặc chồng" : "Bản thân"}</span>;
      },
    },
    {
      caption: "Mối quan hệ",
      dataField: "type_name",
      type: 0,
    },
    {
      caption: "Năm sinh",
      dataField: "date_of_birth",
      type: 0,
      customCellRender: (item) => {
        const status = item.data.date_of_birth;
        return <span>{moment(status).format("YYYY")}</span>;
      },
    },
    {
      caption: "Thông tin chung",
      dataField: "infor",
      type: 0,
    },
  ],
};

export default QuanHeGiaDinh;
