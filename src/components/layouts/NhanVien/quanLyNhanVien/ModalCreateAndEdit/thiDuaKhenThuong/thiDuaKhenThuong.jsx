import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { callApi, DataGrid, ToolBar, _, moment } from "../../../../index";

import { useForm } from "react-hook-form";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function ThiDuaKhenThuong(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstThiDua, setLstThiDua] = useState([]);
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
    const obj = _.find(lstThiDua, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(
        `odata/EmulationRewards?$filter=staff_id eq ${staffId}`,
        "GET"
      ).then((res) => {
        setLstThiDua(res.data.value);
      });
    } else {
      callApi(
        `odata/EmulationRewards?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstThiDua(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="thi-dua">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstThiDua}
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

ThiDuaKhenThuong.propTypes = {
  columns: PropTypes.array,
};
ThiDuaKhenThuong.defaultProps = {
  columns: [
    {
      caption: "Kiểu",
      dataField: "type",
      type: 0,
      customCellRender: (item) => {
        const status = item.data.type;
        return <span>{status ? "Khen thưởng" : "Thi đua"}</span>;
      },
    },
    {
      caption: "Năm",
      dataField: "year",
      type: 0,
      customCellRender: (item) => {
        const status = item.data.year;
        return <span>{moment(status).format("YYYY")}</span>;
      },
    },
    {
      caption: "Cơ quan ban hành",
      dataField: "agency_issued",
      type: 0,
    },
    {
      caption: "Danh hiệu",
      dataField: "award_name",
      type: 0,
    },
    {
      caption: "Ngày ký",
      dataField: "signing_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Số quyết định",
      dataField: "decision_number",
      type: 0,
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Mức khen thưởng",
      dataField: "reward_level",
      type: 0,
    },
    {
      caption: "Cao nhất",
      dataField: "is_highest",
      type: 0,
    },
    {
      caption: "Thời gian hiệu lực",
      dataField: "duration",
      type: 0,
    },
    {
      caption: "Thời gian áp dụng nâng lương trước hạn",
      dataField: "early_salary_increase",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default ThiDuaKhenThuong;
