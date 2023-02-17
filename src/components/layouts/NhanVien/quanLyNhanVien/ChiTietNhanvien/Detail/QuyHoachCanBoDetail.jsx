import { Col, Divider, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { DataGrid, callApi } from "../../../../index";

function QuyHoachCanBoDetail(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const [data, setData] = useState([]);
  console.log(objView);
  useEffect(() => {
    callApi(
      `odata/StaffPlannings?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setData(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Quy hoạch cán bộ
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
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

QuyHoachCanBoDetail.propTypes = {
  columns: PropTypes.array,
};
QuyHoachCanBoDetail.defaultProps = {
  columns: [
    {
      caption: "Năm quy hoạch",
      dataField: "year",
      type: 0,
    },
    {
      caption: "Năm bắt đầu",
      dataField: "from",
      type: 0,
    },
    {
      caption: "Năm kết thúc",
      dataField: "to",
      type: 0,
    },
    {
      caption: "Chức danh quy hoạch 1",
      dataField: "agency1_name",
      type: 0,
    },
    {
      caption: "Đơn vị quy hoạch 1",
      dataField: "title1__name",
      type: 0,
    },
    {
      caption: "Chức danh quy hoạch 2",
      dataField: "agency2_name",
      type: 0,
    },
    {
      caption: "Đơn vị quy hoạch 2",
      dataField: "title2__name",
      type: 0,
    },
    {
      caption: "Chức danh quy hoạch 3",
      dataField: "agency2_name",
      type: 0,
    },
    {
      caption: "Đơn vị quy hoạch 3",
      dataField: "title3_name",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default QuyHoachCanBoDetail;
