import React, { useState, useEffect } from "react";
import { Descriptions, Tabs, Divider, Drawer, Row, Col } from "antd";

import {
  FormatDateTime,
  FormatDate,
  FormatMoney,
} from "../../../../../controller/Format";
import {
  callApi,
  _,
  DataGridOdata,
  moment,
  Select,
  DataGrid,
} from "../../../../index";

function QuaTrinhCongTacDetail(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const { TabPane } = Tabs;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(
      `odata/WorkingProcesss?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log(res);
      setData(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Quá trình công tác của nhân viên
      </Divider>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ height: "50vh" }}>
            <DataGrid
              column={columns}
              data={data}
              dataKey={"id"}
              showFilterRow={true}
              pageSize={50}
              //  selectionChanged={selectedRow}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

QuaTrinhCongTacDetail.defaultProps = {
  columns: [
    {
      caption: "Thời gian bắt đầu",
      dataField: "from",
      type: 0,
      format: "date",
    },
    {
      caption: "Thời gian kết thúc",
      dataField: "to",
      type: 0,
      format: "date",
    },
    {
      caption: "Cơ quan,chức vụ,chức danh",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Số quyết định",
      dataField: "decision_number",
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
  ],
};

export default QuaTrinhCongTacDetail;
