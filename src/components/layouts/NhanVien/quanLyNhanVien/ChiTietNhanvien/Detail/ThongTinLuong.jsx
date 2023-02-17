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

function ThongTinLuongDetail(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  const { TabPane } = Tabs;
  const [data, setData] = useState([]);
  console.log(objView);
  useEffect(() => {
    callApi(`odata/SalaryInfors?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log("staff info ", res.data);
        setData(res.data.value);
      }
    );
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Thông tin lương
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
                <Descriptions.Item label={"Kiểu nâng lương"} span={1.5}>
                  <b>{data.salary_increase_type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Kiểu bảng lương"} span={1.5}>
                  <b>{data.salary_sheet_type_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Số quyết định"} span={1.5}>
                  <b>{data.decision_number}</b>
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
                <Descriptions.Item label={"Ngày hưởng"} span={1.5}>
                  <b>
                    {_.isNull(data?.benefit_date)
                      ? ""
                      : FormatDate(data.benefit_date)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tập sự"} span={1.5}>
                  <b>{data.is_probationary ? "Tập sự" : "Đang tập sự"}</b>
                </Descriptions.Item>
                <Descriptions.Item
                  label={"Chức danh nghề nghiệp/nghạch"}
                  span={1.5}
                >
                  <b>{data.career_title_name}</b>
                </Descriptions.Item>
                <Descriptions.Item
                  label={"Ngày giữ nghạch/chức danh nghề nghiệp"}
                  span={1.5}
                >
                  <b>
                    {_.isNull(data?.career_start_date)
                      ? ""
                      : FormatDate(data.career_start_date)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Bậc lương"} span={1.5}>
                  <b>{data.salary_level}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hệ số"} span={1.5}>
                  <b>{data.salary_coeff}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Vượt khung"} span={1.5}>
                  <b>{data.is_seniority ? "Vượt khung" : "Không vượt khung"}</b>
                </Descriptions.Item>
                <Descriptions.Item
                  label={"Hệ số thâm niêm vượt khung"}
                  span={1.5}
                >
                  <b>{data.seniority_coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hệ số chức vụ"} span={1.5}>
                  <b>{data.position_coef}</b>
                </Descriptions.Item>

                <Descriptions.Item
                  label={"Hệ số trách nhiệm công việc"}
                  span={1.5}
                >
                  <b>{data.responsibility_coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hệ số ưu đãi"} span={1.5}>
                  <b>{data.favour_coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hệ số độc hại"} span={1.5}>
                  <b>{data.toxic_coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hệ số đặc thù"} span={1.5}>
                  <b>{data.special_coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Điểm chức vụ"} span={1.5}>
                  <b>{data.position_mark}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Điểm trình độ"} span={1.5}>
                  <b>{data.degree_mark}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Điểm phân loại"} span={1.5}>
                  <b>{data.classify_mark}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền công đoàn"} span={1.5}>
                  <b>{data.labor_union_fee}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Thời gian nâng"} span={1.5}>
                  <b>{data.salary_increase_time}</b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}
    </>
  );
}

export default ThongTinLuongDetail;
