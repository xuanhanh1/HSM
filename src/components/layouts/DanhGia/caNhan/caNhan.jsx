import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNhanViens,
  getALLNhanViens,
} from "../../../../redux/actions/DanhMuc";
import {
  DataGrid,
  ToolBar,
  useLocalStorage,
  _,
  Select,
  DatePicker,
  moment,
  Input,
} from "../../index";
// import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";

function CaNhan(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const { setValue, control, watch } = useForm();

  const dispatch = useDispatch();
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [inforNhanVien, setInforNhanVien] = useLocalStorage("infoNV", {});
  const [loading, setLoading] = useState(false);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const lstNhanViens = useSelector(
    (state) => state.DanhMucReducers.lstNhanViens
  );

  useEffect(() => {
    dispatch(getALLNhanViens(inforNhanVien.Id));
  }, [isStatusModal.isVisible]);

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

  const selectedRow = ([params]) => {
    const obj = _.find(lstNhanViens, (x) => x.id === params);
    console.log(obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    dispatch(deleteNhanViens(params.id));
  };
  const disabledDate = (current) => {
    return current && current < moment(watch().TUNGAY).endOf("day");
  };
  const handleSearch = () => {
    setLoading(true);
    console.log("search");
  };
  return (
    <div className="bao-hiem">
      <PageHeader className="site-page-header" title={t("Bảng chấm công")} />
      {/* <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      /> */}
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            display: "flex",
            width: "100%",
          }}
        >
          <Col span={6}>
            <Select
              control={control}
              label="Loại"
              name="supplier_name"
              arrayItem={"odata/Suppliers"}
              valueOpt="Id"
              nameOpt="name"
            />
          </Col>
          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              loading={loading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
        </div>
      </Row>
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={[]}
          // allowView={true}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          // viewObj={handleOpenDrawer1}
        />
      </div>
      {/* {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
        />
      ) : (
        <></>
      )} */}
      {/* {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null} */}
    </div>
  );
}

CaNhan.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
CaNhan.defaultProps = {
  columns: [
    {
      caption: "Mã cán bộ",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Họ và tên",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Phòng ban",
      dataField: "GIOITINH",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "DIENTHOAI",
      type: 0,
    },
    {
      caption: "Thời gian bắt đầu làm việc",
      dataField: "DIACHI",
      type: 0,
    },
    {
      caption: "Thời gian kết thúc quá trình làm việc",
      dataField: "EMAIL",
      type: 0,
    },
    {
      caption: "Tổng thời gian làm việc thực tế",
      dataField: "TEN_KP",
      type: 0,
    },
  ],
};
export default CaNhan;
