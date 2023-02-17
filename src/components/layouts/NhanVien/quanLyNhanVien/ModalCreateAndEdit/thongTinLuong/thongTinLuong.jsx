import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { DataGrid, ToolBar, callApi, _ } from "../../../../index";
import DrawerThongTinLuong from "./drawerThongTinLuong";
import ModalCreateAndEdit from "./ModalCreateAndEdit";

function ThongTinLuong(props) {
  const { columns, staffId, isParentStatus, objParent } = props;
  const [isObjEdit, setObjEdit] = useState({});
  const [lstSalary, setLstSalary] = useState([]);
  const dispatch = useDispatch();
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
  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  useEffect(() => {
    if (isParentStatus === 0) {
      callApi(`odata/SalaryInfors?$filter=staff_id eq ${staffId}`, "GET").then(
        (res) => {
          setLstSalary(res.data.value);
        }
      );
    } else {
      callApi(
        `odata/SalaryInfors?$filter=staff_id eq ${objParent.id}`,
        "GET"
      ).then((res) => {
        setLstSalary(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  const selectedRow = ([params]) => {
    const obj = _.find(lstSalary, (x) => x.id === params);
    setObjEdit(obj);
  };
  return (
    <div className="thong-tin-luong">
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstSalary}
          allowView={true}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
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
      {isOpenDrawer.isVisible && (
        <DrawerThongTinLuong
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      )}
    </div>
  );
}

ThongTinLuong.propTypes = {
  columns: PropTypes.array,
};
ThongTinLuong.defaultProps = {
  columns: [
    {
      caption: "Kiểu nâng lương",
      dataField: "salary_increase_type_name",
      type: 0,
    },
    {
      caption: "Kiểu bảng lương",
      dataField: "salary_sheet_type_name",
      type: 0,
    },
    {
      caption: "Số quyết định",
      dataField: "decision_number",
      type: 0,
    },
    {
      caption: "Ngày ký",
      dataField: "signing_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Người ký",
      dataField: "signer",
      type: 0,
    },
    {
      caption: "Ngày hưởng",
      dataField: "benefit_date",
      type: 0,
      format: "date",
    },

    {
      caption: "Tập sự",
      dataField: "is_probationary",
      type: 0,
    },
    {
      caption: "Chức danh nghề nghiệp",
      dataField: "career_title_name",
      type: 0,
    },
    {
      caption: "Ngày giữ nghạch",
      dataField: "career_start_date",
      type: 0,
      format: "date",
    },
  ],
};
export default ThongTinLuong;
