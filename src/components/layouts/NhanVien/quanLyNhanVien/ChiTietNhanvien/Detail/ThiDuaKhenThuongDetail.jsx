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

function ThiDuaKhenThuongDetail(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const { TabPane } = Tabs;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(
      `odata/EmulationRewards?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log(res);
      setData(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Thi đua khen thưởng
      </Divider>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ height: "85vh" }}>
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

ThiDuaKhenThuongDetail.defaultProps = {
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

export default ThiDuaKhenThuongDetail;
