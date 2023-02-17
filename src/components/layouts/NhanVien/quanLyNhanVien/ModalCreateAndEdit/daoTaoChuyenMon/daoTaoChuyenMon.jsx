import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callApi, DataGrid, ToolBar, _ } from "../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function DaoTaoChuyenMon(props) {
  const { columns, staffId, isParentStatus, objParent } = props;

  const [isObjEdit, setObjEdit] = useState({});
  const [lstEducates, setLstEducates] = useState([]);
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
    const obj = _.find(lstEducates, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/Educates?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstEducates(res.data.value);
        }
      );
    } else {
      callApi(`odata/Educates?$filter=staff_id eq ${objParent.id}`, "GET").then(
        (res) => {
          setLstEducates(res.data.value);
        }
      );
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="dao-tao-chuyen-mon">
      <h4>Đào tạo chuyên môn</h4>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "500px" }}>
        <DataGrid
          column={columns}
          data={lstEducates}
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

DaoTaoChuyenMon.propTypes = {
  columns: PropTypes.array,
};
DaoTaoChuyenMon.defaultProps = {
  columns: [
    {
      caption: "Thời gian bắt đầu",
      dataField: "from",
      type: 0,
      format: "date",
    },
    {
      caption: "Thời gian kết thúc",
      dataField: "to",
      type: 0,

      format: "date",
    },
    {
      caption: "Cơ sở đào tạo",
      dataField: "educate_place_name",
      type: 0,
    },
    {
      caption: "Chuyên nghành",
      dataField: "educate_major_name",
      type: 0,
    },
    {
      caption: "Hình thức đào tạo",
      dataField: "educate_form_name",
      type: 0,
    },
    {
      caption: "Đào tạo cao nhất",
      dataField: "is_highest",
      type: 0,
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Số VB/CC",
      dataField: "degree_number",
      type: 0,
    },
    {
      caption: "Người ký",
      dataField: "signer",
      type: 0,
    },
    {
      caption: "Ngày ký",
      dataField: "signing_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Nguồn kinh phí",
      dataField: "educate_fund_name",
      type: 0,
    },
  ],
};

export default DaoTaoChuyenMon;
