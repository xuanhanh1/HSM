import { Col, Divider, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { DataGrid, callApi } from "../../../../index";

function NgoaiNguDetail(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(
      `odata/ForeignLanguages?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log(res);
      setData(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Ngoại ngữ
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

NgoaiNguDetail.propTypes = {
  columns: PropTypes.array,
};
NgoaiNguDetail.defaultProps = {
  columns: [
    {
      caption: "Cấp độ",
      dataField: "level_name",
      type: 0,
    },
    {
      caption: "Loại văn bằng",
      dataField: "degree_type_name",
      type: 0,
    },
    {
      caption: "Cao nhất",
      dataField: "is_highest",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default NgoaiNguDetail;
