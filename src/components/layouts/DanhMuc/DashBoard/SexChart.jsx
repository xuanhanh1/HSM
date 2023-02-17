import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
import { useLocalStorage, Input, Notification, callApi, _ } from "../../index";

const SexChart = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: [],
    },
  });
  useEffect(() => {
    setLoading(true);
    callApi("odata/Staffs", "GET")
      .then((res) => {
        setData({
          series: [
            _.countBy(
              res.data.value,
              (item) =>
                item.sex_name === "Giới tính nam" &&
                item.staff_status_name === "Đang công tác"
            ).true,
            _.countBy(
              res.data.value,
              (item) =>
                item.sex_name === "Giới tính nữ" &&
                item.staff_status_name === "Đang công tác"
            ).true,
            _.countBy(
              res.data.value,
              (item) =>
                item.sex_name !== "Giới tính nữ" &&
                item.sex_name !== "Giới tính nam"
            ).true,
          ],
          options: {
            chart: {
              width: 380,
              type: "pie",
            },
            labels: ["Nam", "Nữ", "Khác"],
          },
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        setLoading(false);
      });
  }, [data]);
  return (
    <div className="card-body">
      <div className="card-title">Số nhân sự theo giới tính</div>
      <ReactApexChart
        options={data.options}
        series={data.series}
        height="350"
        type="donut"
      />
    </div>
  );
};

SexChart.propTypes = {};

export default SexChart;
