import { Divider } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callApi, DataGrid, ToolBar, _ } from "../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function ChungChiHanhNghe(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstPracticingCertificates, setLstPracticingCertificates] = useState(
    []
  );
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
    const obj = _.find(lstPracticingCertificates, (x) => x.id === params);
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
        `odata/PracticingCertificates?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        console.log(res);
        setLstPracticingCertificates(res.data.value);
      });
    } else {
      callApi(
        `odata/PracticingCertificates?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        console.log(res);
        setLstPracticingCertificates(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="chung-chi-hanh-nghe">
      <Divider />
      <h4>Chứng chỉ hành nghề</h4>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "500px" }}>
        <DataGrid
          column={columns}
          data={lstPracticingCertificates}
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

ChungChiHanhNghe.propTypes = {
  columns: PropTypes.array,
};
ChungChiHanhNghe.defaultProps = {
  columns: [
    {
      caption: "Loại chứng chỉ",
      dataField: "degree_type_name",
      type: 0,
    },
    {
      caption: "Số chứng chỉ",
      dataField: "number",
      type: 0,
    },
    {
      caption: "Đơn vị cấp",
      dataField: "issue_agency",
      type: 0,
    },
    {
      caption: "Ngày cấp",
      dataField: "issue_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Ngày hết hạn",
      dataField: "expiry_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Người ký",
      dataField: "signer",
      type: 0,
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
  ],
};

export default ChungChiHanhNghe;
