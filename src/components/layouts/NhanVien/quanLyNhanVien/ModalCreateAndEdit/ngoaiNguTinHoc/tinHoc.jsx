import { Divider } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callApi, DataGrid, ToolBar, _ } from "../../../../index";
import ModalCreateAndEditTH from "./ModalCreateAndEditTH";

function TinHoc(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});

  const [lstTinHoc, setLstTinHoc] = useState([]);

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
    const obj = _.find(lstTinHoc, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };

  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/Computings?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstTinHoc(res.data.value);
        }
      );
    } else {
      callApi(
        `odata/Computings?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstTinHoc(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="tin-hoc">
      <Divider />
      <h3>Tin học</h3>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "500px" }}>
        <DataGrid
          column={columns}
          data={lstTinHoc}
          // allowView={true}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawerObj}
        />
      </div>

      {isStatusModal.isVisible ? (
        <ModalCreateAndEditTH
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

TinHoc.propTypes = {
  columns: PropTypes.array,
};
TinHoc.defaultProps = {
  columns: [
    {
      caption: "Cấp độ",
      dataField: "level_name",
      type: 0,
    },
    {
      caption: "Loại văn bằng",
      dataField: "degree_type_name",
      type: 0,
    },
    {
      caption: "Cao nhất",
      dataField: "is_highest",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default TinHoc;
