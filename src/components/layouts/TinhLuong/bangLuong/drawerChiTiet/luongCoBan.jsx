import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Descriptions, Divider } from "antd";
import callApi from "../../../../../config/configApi";
import { FormatDate, FormatMoney } from "../../../../controller/Format";
import { _ } from "../../../index";
const LuongCoBan = (props) => {
  const { objEdit } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(
      `odata/FixedSalarys?$Filter=id eq ${objEdit.fixed_salary_id}`,
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
        Lương cơ bản
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
                <Descriptions.Item label={"Hệ số lương"} span={1.5}>
                  <b>{_.isNull(data?.salary_coef) ? "" : data.salary_coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hệ số phụ cấp"} span={1.5}>
                  <b>
                    {_.isNull(data?.seniority_coef) ? "" : data.seniority_coef}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phụ cấp chức vụ"} span={1.5}>
                  <b>
                    {_.isNull(data?.position_coef) ? "" : data.position_coef}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item
                  label={"Phụ trách nhiệm công việc"}
                  span={1.5}
                >
                  <b>
                    {_.isNull(data?.responsibility_coef)
                      ? ""
                      : data.responsibility_coef}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phụ cấp ưu đãi"} span={1.5}>
                  <b>{_.isNull(data?.favour_coef) ? "" : data.favour_coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phụ cấp độc hại"} span={1.5}>
                  <b>{_.isNull(data?.toxic_coef) ? "" : data.toxic_coef}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền lương cơ bản"} span={1.5}>
                  <b>
                    {_.isNull(data?.salary_money)
                      ? ""
                      : FormatMoney(data.salary_money)}
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

LuongCoBan.propTypes = {};

export default LuongCoBan;
