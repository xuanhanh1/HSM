import { Col, Divider, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { DataGrid, callApi } from "../../../../index";

function DaoTaoBoiDuongDetail(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const [data, setData] = useState([]);
  console.log(objView);
  useEffect(() => {
    callApi(`odata/Cultivates?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log("staff info ", res.data);
        setData(res.data.value);
      }
    );
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Đào tạo bồi dưỡng
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

DaoTaoBoiDuongDetail.propTypes = {
  columns: PropTypes.array,
};
DaoTaoBoiDuongDetail.defaultProps = {
  columns: [
    {
      caption: "Kiểu bồi dưỡng",
      dataField: "type",
      type: 0,
      customCellRender: (item) => {
        const check = item.data.type;
        return <span>{check ? "Đào tạo liên tục" : "Thông thường"}</span>;
      },
    },
    {
      caption: "Từ ngày",
      dataField: "from",
      type: 0,
      format: "date",
    },
    {
      caption: "Đến ngày",
      dataField: "to",
      type: 0,

      format: "date",
    },
    {
      caption: "Số tiết học",
      dataField: "lesson",
      type: 0,
    },
    {
      caption: "Số văn bằng chứng chỉ",
      dataField: "degree_number",
      type: 0,
    },
    {
      caption: "Tên chứng chỉ",
      dataField: "degree_name",
      type: 0,
    },
    {
      caption: "Cơ sở đào tạo",
      dataField: "place_name",
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
      caption: "Nguồn kinh phí",
      dataField: "fund_name",
      type: 0,
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
  ],
};

export default DaoTaoBoiDuongDetail;
