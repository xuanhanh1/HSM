import { Col, Divider, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { DataGrid, callApi } from "../../../../../index";

function TaiSanKhacDetail(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(`odata/Movables?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log(res);
        setData(res.data.value);
      }
    );
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Tài sản khác
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

TaiSanKhacDetail.propTypes = {
  columns: PropTypes.array,
};
TaiSanKhacDetail.defaultProps = {
  columns: [
    {
      caption: "Tiền",
      dataField: "cash",
      type: 0,
    },
    {
      caption: "Phương tiện di chuyển",
      dataField: "transport",
      type: 0,
    },
    {
      caption: "Kim loại đá quý",
      dataField: "gemstone_stock",
      type: 0,
    },
    {
      caption: "Các loại tài sản khác",
      dataField: "other_assets",
      type: 0,
    },
    {
      caption: "Tài sản nước ngoài",
      dataField: "foreign",
      type: 0,
    },
    {
      caption: "Các khoản nợ",
      dataField: "debt",
      type: 0,
    },
    {
      caption: "Tổng thu nhập trong năm",
      dataField: "annual_income",
      type: 0,
    },
  ],
};

export default TaiSanKhacDetail;
