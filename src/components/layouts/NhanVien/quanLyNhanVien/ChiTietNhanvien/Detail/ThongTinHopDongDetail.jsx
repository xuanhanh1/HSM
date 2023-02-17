import { Descriptions, Divider, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { FormatDate } from "../../../../../controller/Format";
import {
  callApi,
  _,
  DataGridOdata,
  moment,
  Select,
  DataGrid,
} from "../../../../index";
function ThongTinHopDongDetail(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  const { TabPane } = Tabs;
  const [data, setData] = useState([]);
  console.log(objView);
  useEffect(() => {
    callApi(
      `odata/LaborContracts?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("staff info ", res.data);
      setData(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Thông tin hợp đồng
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
                <Descriptions.Item label={"Số hợp đồng"} span={1.5}>
                  <b>{data.number}</b>
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
                <Descriptions.Item label={"Ngày hiệu lực"} span={1.5}>
                  <b>{_.isNull(data?.from) ? "" : FormatDate(data.from)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày kết thúc"} span={1.5}>
                  <b>{_.isNull(data?.to) ? "" : FormatDate(data.to)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Mức lương"} span={1.5}>
                  <b>{data.salary_level}</b>
                </Descriptions.Item>
                <Descriptions.Item
                  label={"Chức danh nghề nghiệp/nghạch"}
                  span={1.5}
                >
                  <b>{data.career_titles}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Bậc lương"} span={1.5}>
                  <b>{data.level}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hệ số"} span={1.5}>
                  <b>{data.coeff}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Loại hợp đồng"} span={1.5}>
                  <b>{data.type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hiệu lực"} span={1.5}>
                  <b>{data.is_valid ? "Còn hiệu lực" : "Hết hiệu lực"}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}
    </>
  );
}

export default ThongTinHopDongDetail;
