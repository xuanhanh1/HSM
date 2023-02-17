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
function DanhGiaCanBoHangNam(props) {
  const { columns, staffId, isParentStatus, objParent } = props;

  const [isObjEdit, setObjEdit] = useState({});
  const [lstAnnualReviews, setLstAnnualReviews] = useState([]);
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
    const obj = _.find(lstAnnualReviews, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/AnnualReviews?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstAnnualReviews(res.data.value);
        }
      );
    } else {
      callApi(
        `odata/AnnualReviews?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstAnnualReviews(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="danh-gia-can-bo">
      <h3>Đánh giá cán bộ</h3>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "400px" }}>
        <DataGrid
          column={columns}
          data={lstAnnualReviews}
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

DanhGiaCanBoHangNam.propTypes = {
  columns: PropTypes.array,
};
DanhGiaCanBoHangNam.defaultProps = {
  columns: [
    {
      caption: "Năm đánh giá",
      dataField: "year",
      type: 0,
      customCellRender: (item) => {
        const status = item.data.year;
        return <span>{moment(status).format("YYYY")}</span>;
      },
    },
    {
      caption: "Kết quả",
      dataField: "result_name",
      type: 0,
      format: "date",
    },
  ],
};

export default DanhGiaCanBoHangNam;
