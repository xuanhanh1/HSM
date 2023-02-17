import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Descriptions, Divider } from "antd";
import callApi from "../../../../../config/configApi";
import { FormatDate, FormatMoney } from "../../../../controller/Format";
import { _ } from "../../../index";
const TienTruc = (props) => {
  const { objEdit } = props;
  const [data, setData] = useState([]);
  console.log(objEdit);
  useEffect(() => {
    callApi(
      `odata/OvertimeSalaries?$Filter=id eq ${objEdit.overtime_salary_id}`,
      "GET"
    )
      .then((res) => {
        console.log(res);
        setData(res.data.value);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Tiền trực
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
                <Descriptions.Item label={"Tiền lương/giờ"} span={1.5}>
                  <b>
                    {_.isNull(data?.hour_money)
                      ? ""
                      : FormatMoney(data.hour_money)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item
                  label={"Số giờ Ngày thường (T2-T6)"}
                  span={1.5}
                >
                  <b>
                    {_.isNull(data?.weekday_hours) ? "" : data.weekday_hours}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item
                  label={"Tiền Ngày thường (T2-T6)"}
                  span={1.5}
                >
                  <b>
                    {_.isNull(data?.weekday_money)
                      ? ""
                      : FormatMoney(data.weekday_money)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item
                  label={"Số giờ cuối tuần (T7-CN)"}
                  span={1.5}
                >
                  <b>
                    {_.isNull(data?.weekend_hours) ? "" : data.weekend_hours}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền cuối tuần (T7-CN)"} span={1.5}>
                  <b>
                    {_.isNull(data?.weekend_money)
                      ? ""
                      : FormatMoney(data.weekend_money)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Số giờ ngày lễ,tết"} span={1.5}>
                  <b>
                    {_.isNull(data?.holiday_hours) ? "" : data.holiday_hours}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền ngày lễ,tết"} span={1.5}>
                  <b>
                    {_.isNull(data?.holiday_money)
                      ? ""
                      : FormatMoney(data.holiday_money)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Số giờ trực đêm"} span={1.5}>
                  <b>{_.isNull(data?.night_hours) ? "" : data.night_hours}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền trực đêm"} span={1.5}>
                  <b>
                    {_.isNull(data?.night_money)
                      ? ""
                      : FormatMoney(data.night_money)}
                  </b>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          );
        })}
    </>
  );
};

TienTruc.propTypes = {};

export default TienTruc;
