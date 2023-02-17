import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callApi, DataGrid, ToolBar, _ } from "../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function ThongTinHopDong(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstLaborContracts, setLstLaborContracts] = useState([]);
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
    const obj = _.find(lstLaborContracts, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/LaborContracts?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        setLstLaborContracts(res.data.value);
      });
    } else {
      callApi(
        `odata/LaborContracts?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstLaborContracts(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);

  return (
    <div className="thong-tin-hop-dong">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstLaborContracts}
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

ThongTinHopDong.propTypes = {
  columns: PropTypes.array,
};
ThongTinHopDong.defaultProps = {
  columns: [
    {
      caption: "Số hợp đồng",
      dataField: "number",
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
      caption: "Ngày hiệu lực",
      dataField: "from",
      type: 0,
      format: "date",
    },
    {
      caption: "Ngày kết thúc",
      dataField: "to",
      type: 0,
      format: "date",
    },
    {
      caption: "Mức lương",
      dataField: "salary_level",
      type: 0,
    },
    {
      caption: "Nghạch/chức danh nghề nghiệp",
      dataField: "career_titles",
      type: 0,
    },
    {
      caption: "Bậc",
      dataField: "level",
      type: 0,
    },
    {
      caption: "Hệ số",
      dataField: "coeff",
      type: 0,
    },
    {
      caption: "Loại hợp đồng",
      dataField: "type_name",
      type: 0,
    },
    {
      caption: "Hiệu lực",
      dataField: "is_valid",
      type: 0,
    },
  ],
};

export default ThongTinHopDong;
