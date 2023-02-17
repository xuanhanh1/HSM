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

function PhuCapDetail(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  const { TabPane } = Tabs;
  const [data, setData] = useState([]);
  console.log(objView);
  useEffect(() => {
    callApi(`odata/Allowances?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log("staff info ", res.data);
        setData(res.data.value);
      }
    );
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Phụ cấp
      </Divider>
      {data &&
        data.map((data) => {
          return (
            <>
              <Descriptions
                bordered
                size="small"
                style={{ marginBottom: "10px" }}
              >
                <Descriptions.Item label={"Loại phụ cấp"} span={1.5}>
                  <b>{data.type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phần trăm hưởng"} span={1.5}>
                  <b>{data.percent}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hệ số hưởng"} span={1.5}>
                  <b>{data.coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày bắt đầu"} span={1.5}>
                  <b>{_.isNull(data?.from) ? "" : FormatDate(data.from)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày kết thúc"} span={1.5}>
                  <b>{_.isNull(data?.to) ? "" : FormatDate(data.to)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ghi chú"} span={1.5}>
                  <b>{data.note}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}
    </>
  );
}

export default PhuCapDetail;
