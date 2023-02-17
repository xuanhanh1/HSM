import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Descriptions, Divider } from "antd";
import callApi from "../../../../../config/configApi";
import { FormatDate, FormatMoney } from "../../../../controller/Format";
import { _ } from "../../../index";
const LuongPhauThuat = (props) => {
  const { objEdit } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    callApi(`odata/Surgerys?$Filter=id eq ${objEdit.surgical_salary_id}`, "GET")
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
        Lương phẫu thuật
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
                <Descriptions.Item label={"Chính đặc biệt"} span={1.5}>
                  <b>{_.isNull(data?.ch_db) ? "" : data.ch_db}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền chính đặc biệt"} span={1.5}>
                  <b>
                    {_.isNull(data?.ch_db_monney)
                      ? ""
                      : FormatMoney(data.ch_db_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phụ đặc biệt"} span={1.5}>
                  <b>{_.isNull(data?.ph_db) ? "" : data.ph_db}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền phụ đặc biệt"} span={1.5}>
                  <b>
                    {_.isNull(data?.ph_db_monney)
                      ? ""
                      : FormatMoney(data.ph_db_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Giúp việc đặc biệt"} span={1.5}>
                  <b>{_.isNull(data?.gv_db) ? "" : data.gv_db}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền giúp việc đặc biệt"} span={1.5}>
                  <b>
                    {_.isNull(data?.gv_db_monney)
                      ? ""
                      : FormatMoney(data.gv_db_monney)}
                  </b>
                </Descriptions.Item>

                <Descriptions.Item label={"Chính loại 1"} span={1.5}>
                  <b>{_.isNull(data?.ch_l1) ? "" : data.ch_l1}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền chính loại 1"} span={1.5}>
                  <b>
                    {_.isNull(data?.ch_l1_monney)
                      ? ""
                      : FormatMoney(data.ch_l1_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phụ loại 1"} span={1.5}>
                  <b>{_.isNull(data?.ph_l1) ? "" : data.ph_l1}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền phụ loại 1"} span={1.5}>
                  <b>
                    {_.isNull(data?.ph_l1_monney)
                      ? ""
                      : FormatMoney(data.ph_l1_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Giúp việc loại 1"} span={1.5}>
                  <b>{_.isNull(data?.gv_l1) ? "" : data.gv_l1}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền giúp việc loại 1"} span={1.5}>
                  <b>
                    {_.isNull(data?.gv_l1_monney)
                      ? ""
                      : FormatMoney(data.gv_l1_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Chính loại 2"} span={1.5}>
                  <b>{_.isNull(data?.ch_l2) ? "" : data.ch_l2}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền chính loại 2"} span={1.5}>
                  <b>
                    {_.isNull(data?.ch_l2_monney)
                      ? ""
                      : FormatMoney(data.ch_l2_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phụ loại 2"} span={1.5}>
                  <b>{_.isNull(data?.ph_l2) ? "" : data.ph_l2}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền phụ loại 2"} span={1.5}>
                  <b>
                    {_.isNull(data?.ph_l2_monney)
                      ? ""
                      : FormatMoney(data.ph_l2_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Giúp việc loại 2"} span={1.5}>
                  <b>{_.isNull(data?.gv_l2) ? "" : data.gv_l2}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền giúp việc loại 2"} span={1.5}>
                  <b>
                    {_.isNull(data?.gv_l2_monney)
                      ? ""
                      : FormatMoney(data.gv_l2_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Chính loại 3"} span={1.5}>
                  <b>{_.isNull(data?.ch_l3) ? "" : data.ch_l3}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền chính loại 3"} span={1.5}>
                  <b>
                    {_.isNull(data?.ch_l3_monney)
                      ? ""
                      : FormatMoney(data.ch_l3_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Phụ loại 3"} span={1.5}>
                  <b>{_.isNull(data?.ph_l3) ? "" : data.ph_l3}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền phụ loại 3"} span={1.5}>
                  <b>
                    {_.isNull(data?.ph_l3_monney)
                      ? ""
                      : FormatMoney(data.ph_l3_monney)}
                  </b>
                </Descriptions.Item>
                <Descriptions.Item label={"Giúp việc loại 3"} span={1.5}>
                  <b>{_.isNull(data?.gv_l3) ? "" : data.gv_l3}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tiền giúp việc loại 3"} span={1.5}>
                  <b>
                    {_.isNull(data?.gv_l3_monney)
                      ? ""
                      : FormatMoney(data.gv_l3_monney)}
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

LuongPhauThuat.propTypes = {};

export default LuongPhauThuat;
