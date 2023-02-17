import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Descriptions, Divider } from "antd";
import callApi from "../../../../../config/configApi";
import { FormatDate, FormatMoney } from "../../../../controller/Format";
import { _ } from "../../../index";
const ThuNhapTangThem = (props) => {
  const { objEdit } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(
      `odata/ExtraSalarys?$Filter=id eq ${objEdit.extra_salary_id}`,
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
        Thu nhập tăng thêm
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
                <Descriptions.Item label={"Điểm (Gián tiếp)"} span={1.5}>
                  <b>{_.isNull(data?.mark) ? "" : data.mark}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền TNTT"} span={1.5}>
                  <b>
                    {_.isNull(data?.total_salary)
                      ? ""
                      : FormatMoney(data.total_salary)}
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

ThuNhapTangThem.propTypes = {};

export default ThuNhapTangThem;
