import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import MonthPickerField from "../../../../common/control/componentsForm/MonthPicker";
import openNotificationWithIcon from "../../../../common/notification/notification";
import {
  deleteNhanViens,
  getALLNhanViens,
} from "../../../../redux/actions/DanhMuc";
import {
  callApi,
  DataGrid,
  Input,
  moment,
  ToolBar,
  UploadFile,
  useLocalStorage,
  _,
} from "../../index";
import ModalCreateAndEdit from "./modalCreateAndEdit/modalCreateAndEdit";

function TienTruc(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [isFileExcel, setFileExcel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lstLuong, setLstLuong] = useState([]);
  const { setValue, control, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [inforNhanVien, setInforNhanVien] = useLocalStorage("infoNV", {});
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
  const listFileUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e[0].originFileObj);
    setFileExcel(formData);
  };
  const selectedRow = ([params]) => {
    const obj = _.find(lstNhanViens, (x) => x.id === params);
    console.log(obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    dispatch(deleteNhanViens(params.id));
  };
  const handleSearch = () => {
    console.log("search");
  };
  const handleUploadFile = () => {
    setIsLoading(true);
    callApi(
      `odata/MedicalSupplies/ReadListMedicalSuppliesFromExcel?type_package_id=${
        watch().type_id
      }`,
      "POST",
      isFileExcel,
      "multipart/form-data"
    )
      .then((res) => {
        callApi(
          `odata/MedicalSupplies/ReadListMedicalSuppliesFromExcel?type_package_id=${
            watch().type_id
          }`,

          "POST",
          isFileExcel,
          "multipart/form-data"
        ).then((res) => {
          setLstLuong(res.data);
          setIsLoading(false);
        });
      })
      .catch((err) => {
        openNotificationWithIcon("warning", err.response.data.Errors[0]);
        // console.log(err.response);
        setIsLoading(false);
      });
  };
  return (
    <div className="bao-hiem">
      <PageHeader className="site-page-header" title={t("Ti???n tr???c")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
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
            <Input label="T??n c??n b???" name="name" />
          </Col>
          <Col span={4}>
            <MonthPickerField
              label="Th???i gian"
              name="NGAY"
              defaultValue={moment()}
              control={control}
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
              T??m ki???m
            </Button>
          </Col>
        </div>
      </Row>
      <UploadFile
        label="File ti???n tr???c"
        listFile={listFileUpload}
        maxCount={1}
        fileType={[".xlsx", ".xlsm"]}
      />
      <Button
        onClick={handleUploadFile}
        type="primary"
        disabled={_.isNull(isFileExcel)}
        loading={isLoading}
      >
        C???p nh???t b???ng ch???m c??ng
      </Button>
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstLuong}
          // allowView={true}
          dataKey={"id"}
          // showFilterRow={true}
          selectionChanged={selectedRow}
          // viewObj={handleOpenDrawer1}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

TienTruc.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
TienTruc.defaultProps = {
  columns: [
    {
      caption: "M?? NV",
      dataField: "code",
      type: 0,
    },
    {
      caption: "H??? t??n",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Ch???c v???",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Khoa/ph??ng",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Tr???c ng??y th?????ng",
      dataField: "DIACHI",
      type: 0,
    },
    {
      caption: "Tr???c th??? 7_cn",
      dataField: "EMAIL",
      type: 0,
    },
    {
      caption: "Tr???c ng??y l??? t???t",
      dataField: "TEN_KP",
      type: 0,
    },
    {
      caption: "H??? s??? TNT",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "H??? s??? TTB_CN",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "H??? s??? TLT",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "?????i t?????ng",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "T???ng ca",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "T???ng ti???n",
      dataField: "position_name",
      type: 0,
    },
  ],
};
export default TienTruc;
