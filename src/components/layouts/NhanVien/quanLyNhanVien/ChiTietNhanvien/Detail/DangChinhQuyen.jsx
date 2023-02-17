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

function DangChinhQuyen(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  const { TabPane } = Tabs;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(
      `odata/PartyGovernments?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data.value);
      setData(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Thông tin chi tiết Đảng/Đoàn, chính quyền
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
                <Descriptions.Item label={"Chức vụ"} span={1.5}>
                  <b>{data.is_position ? "Đảng/Đoàn" : "Chính quyền"}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Số quyết định"} span={1.5}>
                  <b>{data.decision_mumber}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày ký"} span={1.5}>
                  <b>
                    {_.isNull(data?.signing_date)
                      ? ""
                      : FormatDate(data.signing_date)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Người ký"} span={1.5}>
                  <b>{data.signer}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày bắt đầu"} span={1.5}>
                  <b>{_.isNull(data?.from) ? "" : FormatDate(data.from)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày kêt thúc "} span={1.5}>
                  <b>{_.isNull(data?.to) ? "" : FormatDate(data.to)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Mã chức vụ"} span={1.5}>
                  <b>{data.party_position_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phụ cấp"} span={1.5}>
                  <b>{data.allowance_money}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ghi chú"} span={3}>
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

export default DangChinhQuyen;
