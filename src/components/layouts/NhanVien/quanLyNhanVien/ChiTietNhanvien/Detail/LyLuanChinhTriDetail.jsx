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

function LyLuanChinhTriDetail(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  const { TabPane } = Tabs;
  const [dataLL, setDataLL] = useState([]);
  const [dataQL, setDataQL] = useState([]);
  const [dataNC, setDataNC] = useState([]);

  useEffect(() => {
    callApi(
      `odata/PoliticalTheorys?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setDataLL(res.data.value);
    });
  }, []);
  useEffect(() => {
    callApi(
      `odata/StateManagements?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setDataQL(res.data.value);
    });
  }, []);
  useEffect(() => {
    callApi(
      `odata/NationalSecuritys?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setDataNC(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Lí luận chính trị
      </Divider>
      {dataLL &&
        dataLL.map((data) => {
          return (
            <>
              <Descriptions
                bordered
                size="small"
                style={{ marginBottom: "10px" }}
              >
                <Descriptions.Item label={"Lí luận chính trị"} span={3}>
                  <b>{data.type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày cấp"} span={1.5}>
                  <b>
                    {_.isNull(data?.issue_date)
                      ? ""
                      : FormatDate(data.issue_date)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nơi cấp"} span={1.5}>
                  <b>{data.issue_place}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}

      <Divider orientation="left" orientationMargin={10}>
        Quản lí nhà nước
      </Divider>
      {dataQL &&
        dataQL.map((data) => {
          return (
            <>
              <Descriptions
                bordered
                size="small"
                style={{ marginBottom: "10px" }}
              >
                <Descriptions.Item
                  label={"Chương trình quản lí nhà nước"}
                  span={3}
                >
                  <b>{data.type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày cấp"} span={1.5}>
                  <b>
                    {_.isNull(data?.issue_date)
                      ? ""
                      : FormatDate(data.issue_date)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nơi cấp"} span={1.5}>
                  <b>{data.issue_place}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}

      <Divider orientation="left" orientationMargin={10}>
        An ninh quốc phòng
      </Divider>
      {dataNC &&
        dataNC.map((data) => {
          return (
            <>
              <Descriptions
                bordered
                size="small"
                style={{ marginBottom: "10px" }}
              >
                <Descriptions.Item label={"Nội dung"} span={3}>
                  <b>{data.content}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày cấp"} span={1.5}>
                  <b>
                    {_.isNull(data?.issue_date)
                      ? ""
                      : FormatDate(data.issue_date)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nơi cấp"} span={1.5}>
                  <b>{data.issue_place}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}
    </>
  );
}

export default LyLuanChinhTriDetail;
