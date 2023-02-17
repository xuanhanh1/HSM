import { Col, Divider, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, _, callApi } from "../../../../index";
function ThongTinKyLuatDetail(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(`odata/Disciplines?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log(res);
        setData(res.data.value);
      }
    );
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

ThongTinKyLuatDetail.propTypes = {
  columns: PropTypes.array,
};
ThongTinKyLuatDetail.defaultProps = {
  columns: [
    {
      caption: "Hình thức kỷ luật",
      dataField: "form_name",
      type: 0,
    },
    {
      caption: "Cơ quan ban hành",
      dataField: "agency_issued",
      type: 0,
    },
    {
      caption: "Ngày ký",
      dataField: "signing_date",
      type: 0,

      format: "date",
    },
    {
      caption: "số quyết định",
      dataField: "decision_number",
      type: 0,
    },
    {
      caption: "Thời gian hiệu lực",
      dataField: "duration",
      type: 0,
    },
    {
      caption: "Thời gian kéo dài nâng lương",
      dataField: "delay_salary_increase",
      type: 0,
    },
    {
      caption: "Cao nhất",
      dataField: "is_highest",
      type: 0,
    },
    {
      caption: "Nội dung",
      dataField: "content",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default ThongTinKyLuatDetail;
