import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callApi, DataGrid, ToolBar, _ } from "../../../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit";
function DaoTaoBoiDuong(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstCultivates, setLstCultivates] = useState([]);
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
    const obj = _.find(lstCultivates, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    // dispatch(deleteTaiLieu(params.id));
    console.log("delete", params);
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/Cultivates?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstCultivates(res.data.value);
        }
      );
    } else {
      callApi(
        `odata/Cultivates?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstCultivates(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  return (
    <div className="dao-tao-boi-duong">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstCultivates}
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

DaoTaoBoiDuong.propTypes = {
  columns: PropTypes.array,
};
DaoTaoBoiDuong.defaultProps = {
  columns: [
    {
      caption: "Ki???u b???i d?????ng",
      dataField: "type",
      type: 0,
      customCellRender: (item) => {
        const check = item.data.type;
        return <span>{check ? "????o t???o li??n t???c" : "Th??ng th?????ng"}</span>;
      },
    },
    {
      caption: "T??? ng??y",
      dataField: "from",
      type: 0,
      format: "date",
    },
    {
      caption: "?????n ng??y",
      dataField: "to",
      type: 0,

      format: "date",
    },
    {
      caption: "S??? ti???t h???c",
      dataField: "lesson",
      type: 0,
    },
    {
      caption: "S??? v??n b???ng ch???ng ch???",
      dataField: "degree_number",
      type: 0,
    },
    {
      caption: "T??n ch???ng ch???",
      dataField: "degree_name",
      type: 0,
    },
    {
      caption: "C?? s??? ????o t???o",
      dataField: "place_name",
      type: 0,
    },
    {
      caption: "Ng??y k??",
      dataField: "signing_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Ng?????i k??",
      dataField: "signer",
      type: 0,
    },
    {
      caption: "Ngu???n kinh ph??",
      dataField: "fund_name",
      type: 0,
    },
    {
      caption: "N???i dung",
      dataField: "content",
      type: 0,
    },
  ],
};

export default DaoTaoBoiDuong;
