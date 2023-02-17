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

function DaoTaoChuyenMonDetail(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  const { TabPane } = Tabs;
  const [data, setData] = useState([]);
  const [dataCC, setDataCC] = useState([]);

  console.log(objView);
  useEffect(() => {
    callApi(`odata/Educates?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log("data ", res.data);
        setData(res.data.value);
      }
    );
  }, []);
  useEffect(() => {
    callApi(
      `odata/PracticingCertificates?$filter=staff_id eq ${objView.id}`,
      "GET"
    ).then((res) => {
      console.log("datacc ", res.data);
      setDataCC(res.data.value);
    });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Đào tạo chuyên môn
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
                <Descriptions.Item label={"Thời gian bắt đầu"} span={1.5}>
                  <b>{_.isNull(data?.from) ? "" : FormatDate(data.from)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Thời gian kết thúc"} span={1.5}>
                  <b>{_.isNull(data?.to) ? "" : FormatDate(data.to)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Cơ sở đào tạo"} span={1.5}>
                  <b>{data.educate_place_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Chuyên nghành"} span={1.5}>
                  <b>{data.educate_major_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hình thức đào tạo"} span={1.5}>
                  <b>{data.educate_form_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Đào tạo cao nhất"} span={1.5}>
                  <b>{data.is_highest}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nội dung"} span={3}>
                  <b>{data.content}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Số VB/CC"} span={1.5}>
                  <b>{data.degree_number}</b>
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
                <Descriptions.Item label={"Nguồn kinh phí"} span={1.5}>
                  <b>{data.educate_fund_name}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}

      <Divider orientation="left" orientationMargin={10}>
        Chứng chỉ hành nghề
      </Divider>
      {dataCC &&
        dataCC.map((data) => {
          return (
            <>
              <Descriptions
                bordered
                size="small"
                style={{ marginBottom: "10px" }}
              >
                <Descriptions.Item label={"Loại chứng chỉ"} span={1.5}>
                  <b>{data.degree_type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Số chứng chỉ"} span={1.5}>
                  <b>{data.number}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Đơn vị cấp"} span={1.5}>
                  <b>{data.issue_agency}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày cấp"} span={1.5}>
                  <b>
                    {_.isNull(data.issue_date)
                      ? ""
                      : FormatDate(data.issue_date)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Ngày hết hạn"} span={1.5}>
                  <b>
                    {_.isNull(data.expiry_date)
                      ? ""
                      : FormatDate(data.expiry_date)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Người ký"} span={1.5}>
                  <b>{data.signer}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nội dung"} span={3}>
                  <b>{data.content}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}
    </>
  );
}

export default DaoTaoChuyenMonDetail;
