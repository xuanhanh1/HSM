import React, { useState, } from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  Row,
  Col,
  Tabs,
} from "antd";
import {
  _,
  DataGrid,
} from "../../../index";

function DrawerChiTiet(props) {
  const { isVisible, setVisible, objView, columns, columnsHV } = props;
  console.log("🚀 ~ DrawerChiTiet ~ objView", objView)
  const { TabPane } = Tabs;
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };

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
  let arr = [1, 2, 3, 6, 5, 4, 8, 9, 7, 0]
  //trộn câu hỏi
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  return (
    <Drawer
      title={`Thông tin chi tiết của khóa học ${objView.code_code} - ${objView.name}`}
      placement="right"
      width={"90vw"}
      onClose={onClose}
      visible={isVisible}
      maskClosable={false}
    >
      <div >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Tabs defaultActiveKey="1" >
              <TabPane tab="Tài liệu" key="1">
                <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
                  <DataGrid
                    column={columns}
                    data={objView.documents}
                    // allowView={true}
                    dataKey={"id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    viewObj={handleOpenDrawer1}
                  />
                </div>
              </TabPane>
              <TabPane tab={`Thông tin học viên`} key="2">
                <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
                  <DataGrid
                    column={columnsHV}
                    data={objView.students}
                    // allowView={true}
                    dataKey={"id"}
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
      caption: "Tên tài liệu",
      dataField: "name",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Ngày tạo",
      dataField: "create_date",
      type: 0,
      format: "date"
    },
    {
      caption: "Cấp độ tài liệu",
      dataField: "level_name",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Link File",
      dataField: "link",
      type: 0,
      customCellRender: (item) => {
      console.log("🚀 ~ item", item)
        const link = item.data.link + item.data.name;
        return (
          <a href={link} download>
            {link}
          </a>
        );
      },
    },
    {
      caption: "Người hướng dẫn",
      dataField: "creator_code",
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
      caption: "Ngày tạo",
      dataField: "create_date",
      type: 0,
      format: "date"
    },
    {
      caption: "Ghi chú ",
      dataField: "note",
      type: 0,
    },
  ]
};

export default DrawerChiTiet;
