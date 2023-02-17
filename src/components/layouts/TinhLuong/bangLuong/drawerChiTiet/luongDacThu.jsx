import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Descriptions, Divider } from "antd";
import callApi from "../../../../../config/configApi";
import { FormatDate, FormatMoney } from "../../../../controller/Format";
import { _ } from "../../../index";
const LuongDacThu = (props) => {
  const { objEdit } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(
      `odata/SpecialSalaries?$Filter=id eq ${objEdit.special_salary_id}`,
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
        Lương đặc thù
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
                <Descriptions.Item label={"Hệ số đặc thù"} span={1.5}>
                  <b>
                    {_.isNull(data?.special_coeff) ? "" : data.special_coeff}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nghỉ thai sản"} span={1.5}>
                  <b>
                    {_.isNull(data?.exceed_maternity_day_off)
                      ? ""
                      : data.exceed_maternity_day_off}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nghỉ ốm"} span={1.5}>
                  <b>{_.isNull(data?.sick_day_off) ? "" : data.sick_day_off}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nghỉ không lương"} span={1.5}>
                  <b>
                    {_.isNull(data?.unpaid_day_off) ? "" : data.unpaid_day_off}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nghỉ đi học"} span={1.5}>
                  <b>
                    {_.isNull(data?.study_day_off) ? "" : data.study_day_off}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Lương sau thuế"} span={1.5}>
                  <b>
                    {_.isNull(data?.special_salary_received)
                      ? ""
                      : FormatMoney(data.special_salary_received)}
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

LuongDacThu.propTypes = {};

export default LuongDacThu;
