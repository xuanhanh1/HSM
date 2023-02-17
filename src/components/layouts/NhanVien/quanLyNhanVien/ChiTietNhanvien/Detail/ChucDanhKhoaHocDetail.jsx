import React, { useState, useEffect } from "react";
import { Descriptions, Tabs, Divider } from "antd";

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

function ChucDanhKhoaHocDetail(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  const { TabPane } = Tabs;
  const [dataKH, setDataKH] = useState([]);
  const [dataDT, setDataDT] = useState([]);
  const [dataDG, setDataDG] = useState([]);

  useEffect(() => {
    callApi(
      `odata/AcademicTitles?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setDataKH(res.data.value);
    });
  }, []);
  useEffect(() => {
    callApi(
      `odata/EthnicLanguages?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setDataDT(res.data.value);
    });
  }, []);
  useEffect(() => {
    callApi(
      `odata/AnnualReviews?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setDataDG(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Chức danh khoa học
      </Divider>
      {dataKH &&
        dataKH.map((data) => {
          return (
            <>
              <Descriptions
                bordered
                size="small"
                style={{ marginBottom: "10px" }}
              >
                <Descriptions.Item label={"Chức danh khoa học"} span={1.5}>
                  <b>{data.type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Năm được phong"} span={1.5}>
                  <b>{_.isNull(data?.year) ? "" : FormatDate(data.year)}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}

      <Divider orientation="left" orientationMargin={10}>
        Tiếng dân tộc
      </Divider>
      {dataDT &&
        dataDT.map((data) => {
          return (
            <>
              <Descriptions
                bordered
                size="small"
                style={{ marginBottom: "10px" }}
              >
                <Descriptions.Item label={"Tiếng dân tộc"} span={3}>
                  <b>{data.language_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Trình độ"} span={1.5}>
                  <b>{data.level_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Cao nhất"} span={1.5}>
                  <b>{data.is_highest}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}

      <Divider orientation="left" orientationMargin={10}>
        Đánh giá cán bộ
      </Divider>
      {dataDG &&
        dataDG.map((data) => {
          return (
            <>
              <Descriptions
                bordered
                size="small"
                style={{ marginBottom: "10px" }}
              >
                <Descriptions.Item label={"Năm đánh giá"} span={1.5}>
                  <b>
                    {_.isNull(data?.year)
                      ? ""
                      : moment(data.year).format("YYYY")}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Kết quả đánh giá"} span={1.5}>
                  <b>{data.result_name}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}
    </>
  );
}

export default ChucDanhKhoaHocDetail;
