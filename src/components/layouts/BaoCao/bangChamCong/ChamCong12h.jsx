import React, { useEffect, useState } from "react";
import { PageHeader, Row, Col, Button, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  moment,
  Select1 as Select,
  _,
  callApi,
  Notification,
  MonthPicker,
} from "../../index";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FormatMonth } from "../../../controller/Format";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import font from "../../../controller/font";
import fontBold from "../../../controller/font-bold";
import PropTypes from "prop-types";

const BangChamCong12h = (props) => {
  let { lstReport, value } = props
  console.log("value", value);

  const nvInfor = JSON.parse(window.localStorage.getItem("infoNV"));
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    setValue,
    control,
    watch,
    register,
    formState: { errors },
  } = useForm();

  return (
    <table id="table_bc_cong" style={{ display: "none" }}>
      <thead>
        <tr>
          <th rowSpan={2}>STT</th>
          <th rowSpan={2}>Họ và tên</th>
          <th colSpan={31} id="date_month">
            Các ngày trong tháng
          </th>
          <th colSpan={3} id="cong">
            Quy ra công trực
          </th>
        </tr>
        <tr>
          <th>01</th>
          <th>02</th>
          <th>03</th>
          <th>04</th>
          <th>05</th>
          <th>06</th>
          <th>07</th>
          <th>08</th>
          <th>09</th>
          <th>10</th>
          <th>11</th>
          <th>12</th>
          <th>13</th>
          <th>14</th>
          <th>15</th>
          <th>16</th>
          <th>17</th>
          <th>18</th>
          <th>19</th>
          <th>20</th>
          <th>21</th>
          <th>22</th>
          <th>23</th>
          <th>24</th>
          <th>25</th>
          <th>26</th>
          <th>27</th>
          <th>28</th>
          <th>29</th>
          <th>30</th>
          <th>31</th>
          <th id="cong_1">Thường ngày</th>
          <th id="cong_1">Thứ 7,CN</th>
          <th id="cong_1">Lễ, tết</th>
        </tr>
      </thead>
      <tbody>
        {_.map(lstReport, (item, index) => {
          let weekday = ""
          let holiday = ""
          let weekend = ""
          if (value === '12') {
            weekday = item.weekday_12h_duty;
            holiday = item.holiday_12h_duty;
            weekend = item.weekend_12h_duty;
          }
          if (value === '8') {
            weekday = item.weekday_8h_duty;
            holiday = item.holiday_8h_duty;
            weekend = item.weekend_8h_duty;
          }
          if (value === '16') {
            weekday = item.weekday_16h_duty;
            holiday = item.holiday_16h_duty;
            weekend = item.weekend_16h_duty;
          }
          if (value === '24') {
            weekday = item.weekday_24h_duty;
            holiday = item.holiday_24h_duty;
            weekend = item.weekend_24h_duty;
          }
          console.log(weekend, holiday, weekday);
          return (
            <tr key={index}>
              <td className="name">{index + 1}</td>
              <td className="name">{item.staff_name}</td>
              <td>{item.day_1}</td>
              <td>{item.day_2}</td>
              <td>{item.day_3}</td>
              <td>{item.day_4}</td>
              <td>{item.day_5}</td>
              <td>{item.day_6}</td>
              <td>{item.day_7}</td>
              <td>{item.day_8}</td>
              <td>{item.day_9}</td>
              <td>{item.day_10}</td>
              <td>{item.day_11}</td>
              <td>{item.day_12}</td>
              <td>{item.day_13}</td>
              <td>{item.day_14}</td>
              <td>{item.day_15}</td>
              <td>{item.day_16}</td>
              <td>{item.day_17}</td>
              <td>{item.day_18}</td>
              <td>{item.day_19}</td>
              <td>{item.day_20}</td>
              <td>{item.day_21}</td>
              <td>{item.day_22}</td>
              <td>{item.day_23}</td>
              <td>{item.day_24}</td>
              <td>{item.day_25}</td>
              <td>{item.day_26}</td>
              <td>{item.day_27}</td>
              <td>{item.day_28}</td>
              <td>{item.day_29}</td>
              <td>{item.day_30}</td>
              <td>{item.day_31}</td>
              <td>{weekday}</td>
              <td>{holiday}</td>
              <td>{weekend}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

BangChamCong12h.propTypes = {};

export default BangChamCong12h;
