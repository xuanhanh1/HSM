// import React, { useState, useEffect } from "react";
// import Chart from "react-apexcharts";
// import { callApi, moment, _ } from "../../index";
// import { DatePicker } from "antd";
// function DoTuoiTheoThangChart(props) {
//   const nvInfor = JSON.parse(window.localStorage.getItem("infoNV"));
//   const [lineChart, setLineChart] = useState({
//     options: {
//       grid: {
//         borderColor: "#f0f2f5",
//         xaxis: { lines: { show: true } },
//         yaxis: { lines: { show: true } },
//       },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: "50%",
//           endingShape: "rounded",
//           dataLabels: {
//             position: "top", // top, center, bottom
//           },
//         },
//       },
//       stroke: {
//         show: true,
//         width: 2,
//         colors: ["transparent"],
//       },
//       xaxis: {
//         categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//       },
//       yaxis: {
//         logBase: 10,
//         // tickAmount: 6,
//         min: 0,
//         labels: {
//           formatter: function (val, index) {
//             return val.toFixed(0);
//           },
//         },
//       },
//       chart: {
//         toolbar: {
//           show: false,
//         },
//       },
//       tooltip: {
//         x: {
//           show: true,
//           formatter: (title) => "Tháng " + title,
//         },
//       },
//       noData: { text: "Loading..." },
//     },
//     series: [],
//   });
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const getApi = (year) => {
//     const currentYear = new Date().getFullYear();
//     if (year > currentYear) {
//       setLineChart({
//         ...lineChart,
//         options: { ...lineChart.options, noData: { text: "Không có dữ liệu" } },
//         series: [],
//       });
//       return;
//     }
//     setLineChart({
//       ...lineChart,
//       options: { ...lineChart.options, noData: { text: "Loading..." } },
//       series: [],
//     });
//     callApi(`api/Dashboard/GetCountGroupbyMonth/${year}`, "GET")
//       .then((res) => {
//         let data = res.data;
//         if (_.isEmpty(data[0].COUNT)) {
//           setLineChart({
//             ...lineChart,
//             options: {
//               ...lineChart.options,
//               noData: { text: "Không có dữ liệu" },
//             },
//             series: [],
//           });
//         } else {
//           let seriesChart = data.map((x) => {
//             return { name: x.TEN, data: x.COUNT };
//           });
//           setLineChart({ ...lineChart, series: seriesChart });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
//   useEffect(() => {
//     getApi(selectedYear);
//   }, [selectedYear]);
//   const onChange = (date, dateString) => {
//     if (dateString === "") return;
//     setSelectedYear(dateString);
//   };
//   const disabledDate = (current) => {
//     return current && current > moment().endOf("day");
//   };
//   return (
//     <div className="card-body">
//       <div
//         class="card-title"
//         style={{ display: "flex", justifyContent: "space-between" }}
//       >
//         <span>Số lượng nhân sự theo độ tuổi</span>
//         <DatePicker
//           onChange={onChange}
//           picker="year"
//           placeholder="Năm"
//           style={{ width: "100px" }}
//           defaultValue={moment(new Date())}
//           allowClear={false}
//           disabledDate={disabledDate}
//         />
//       </div>

//       <Chart
//         options={lineChart.options}
//         series={lineChart.series}
//         height={320}
//         type="area"
//         style={{ padding: "0px 25px" }}
//       />
//     </div>
//   );
// }

// export default DoTuoiTheoThangChart;

import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";

const DoTuoiTheoThangChart = (props) => {
  const [data, setData] = useState({
    series: [
      {
        name: "Tuổi 20-30",
        type: "column",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        name: "Tuổi 30-40",
        type: "area",
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
      {
        name: "Tuổi 50-60",
        type: "line",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        stacked: false,
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },

      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        "01/01/2003",
        "02/01/2003",
        "03/01/2003",
        "04/01/2003",
        "05/01/2003",
        "06/01/2003",
        "07/01/2003",
        "08/01/2003",
        "09/01/2003",
        "10/01/2003",
        "11/01/2003",
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Points",
        },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          },
        },
      },
    },
  });
  return (
    <div className="card-body">
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="line"
        height={350}
      />
    </div>
  );
};

DoTuoiTheoThangChart.propTypes = {};

export default DoTuoiTheoThangChart;
