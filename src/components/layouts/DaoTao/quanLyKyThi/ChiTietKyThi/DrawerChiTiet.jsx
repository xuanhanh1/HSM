import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  Row,
  Col,
  Descriptions,
  Tabs,
  Divider,
  Image,
  Space,
} from "antd";

import {
  FormatDateTime,
  FormatDate,
  FormatMoney,
} from "../../../../controller/Format";
import {
  callApi,
  _,
  DataGridOdata,
  moment,
  Select,
  DataGrid,
} from "../../../index";

function DrawerChiTiet(props) {
  const { isVisible, setVisible, objView, columns, columnsHV } = props;
  // console.log("🚀 ~ DrawerChiTiet ~ objView", objView)
  const { TabPane } = Tabs;
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const URL = "/odata/MedicalSuppliesPackages";
  const [optionsOdata, setOptionsOdata] = useState({ filter: [], sort: [] });
  const [listContracts, setListContracts] = useState([]);
  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };
  // useEffect(() => {
  //   callApi(`odata/Contracts?$filter=package_id eq ${objView.Id}`, "GET").then(
  //     (res) => {
  //       setListContracts(res.data.value);
  //     }
  //   );
  // }, []);

  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };

  const selectedRow = ([params]) => {
    // console.log("🚀 ~ selectedRow ~ params", params)
    // const obj = _.find(lstNhanViens, (x) => x.Id === params);
    // console.log("object ", obj);
    // setObjEdit(obj);
  };

  return (
    <Drawer
      title={`Thông tin chi tiết của khóa học ${objView.code_code} - ${objView.name}`}
      placement="right"
      width={"90vw"}
      onClose={onClose}
      visible={isVisible}
      maskClosable={false}
    >
      <div>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Tài liệu" key="1">
                <div
                  className="gridView"
                  style={{ height: "calc(100vh - 175px)" }}
                >
                  <DataGrid
                    column={columns}
                    data={[]}
                    allowView={true}
                    dataKey={"Id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    viewObj={handleOpenDrawer1}
                  />
                </div>
              </TabPane>
              <TabPane tab={`Thông tin nhân viên`} key="2">
                <div
                  className="gridView"
                  style={{ height: "calc(100vh - 175px)" }}
                >
                  <DataGrid
                    column={columnsHV}
                    data={[]}
                    allowView={true}
                    dataKey={"Id"}
                    // showFilterRow={true}
                    // selectionChanged={selectedRow}
                    // viewObj={handleOpenDrawer1}
                  />
                </div>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    </Drawer>
  );
}

DrawerChiTiet.defaultProps = {
  columns: [
    {
      caption: "tên tài liệu",
      dataField: "name",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Ngày tạo",
      dataField: "",
      type: 0,
    },
    {
      caption: "Khóa học",
      dataField: "GIOITINH",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Cấp độ tài liệu",
      dataField: "document_level",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Link tài liệu",
      dataField: "link",
      type: 0,
    },
    {
      caption: "Tên khoa/phòng",
      dataField: "TEN_KP",
      type: 0,
    },
    {
      caption: "Tên chức vụ",
      dataField: "position_name",
      type: 0,
      width: "5vw",
    },
  ],
  columnsHV: [
    {
      caption: "Mã học viên",
      dataField: "code",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Tên học viên",
      dataField: "staff_name",
      type: 0,
    },

    {
      caption: "Ghi chú ",
      dataField: "note",
      type: 0,
    },
  ],
};

export default DrawerChiTiet;
