import { Descriptions, Divider, Tabs } from "antd";
import React, { useEffect, useState } from "react";
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
function QuanHeGiaDinhDetail(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  const { TabPane } = Tabs;
  const [data, setData] = useState([]);
  console.log(objView);
  useEffect(() => {
    callApi(
      `odata/FamilyRelationships?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setData(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Quan hệ gia đình
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
                <Descriptions.Item label={"Kiểu quan hệ gia đình"} span={1.5}>
                  <b>{data.belong_to ? "Vợ hoặc chồng" : "Bản thân"}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Mối quan hệ"} span={1.5}>
                  <b>{data.type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Năm sinh"} span={1.5}>
                  <b>
                    {_.isNull(data?.date_of_birth)
                      ? ""
                      : FormatDate(data.date_of_birth)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Thông tin tổng hợp"} span={3}>
                  <b>{data.infor}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}
    </>
  );
}

export default QuanHeGiaDinhDetail;
