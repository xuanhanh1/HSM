import { Col, Divider, Row } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { DataGrid, callApi, moment } from "../../../../../index";

function NhaODetail(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(`odata/Buildings?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log(res);
        setData(res.data.value);
      }
    );
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Nhà ở
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

NhaODetail.propTypes = {
  columns: PropTypes.array,
};
NhaODetail.defaultProps = {
  columns: [
    {
      caption: "Loại tài sản",
      dataField: "immovables_type_name",
      type: 0,
    },
    {
      caption: "Tên nhà và công trình",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Loại nhà",
      dataField: "building_type_name",
      type: 0,
    },
    {
      caption: "Cấp công trình",
      dataField: "level",
      type: 0,
    },
    {
      caption: "Diện tích",
      dataField: "area",
      type: 0,
    },
    {
      caption: "Giá trị",
      dataField: "value",
      type: 0,
    },
    {
      caption: "Giấy chứng nhận",
      dataField: "title_deed",
      type: 0,
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
      caption: "Thông tin khác",
      dataField: "note",
      type: 0,
    },
  ],
};

export default NhaODetail;
