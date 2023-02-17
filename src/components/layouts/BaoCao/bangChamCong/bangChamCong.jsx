import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { LoaiCong } from "../../../controller/DataSample";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import font from "../../../controller/font";
import fontBold from "../../../controller/font-bold";
import PropTypes from "prop-types";
import BangChamCong12h from "./ChamCong12h";
import "./index.css";
import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers";

const headerPDF = (doc, objHeader) => {
  doc.setFontSize(11);
  doc.text(`BỘ Y TẾ`, 40, 10, "center");
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 200, 10);
  doc.setFontSize(10);
  doc.text("--------oOo--------", 40, 20, null, null, "center");
  doc.setFontSize(10);
  doc.text("Độc Lập - Tự Do - Hạnh Phúc", 240, 15, null, null, "center");
  doc.text("--------oOo--------", 240, 20, null, null, "center");
  doc.setFont("Amiri-bold");
  doc.text(`BỆNH VIỆN THỐNG NHẤT`, 50, 15, "center");
  doc.setFontSize(14);
  doc.setFont("Amiri-bold");
  doc.text(objHeader.TITLE, 150, 30, null, null, "center");
  doc.setFontSize(9);
  doc.text(
    `Khoa phòng: ${objHeader.DEPARTMENT}`,
    150,
    35,
    null,
    null,
    "center"
  );
  doc.setFontSize(9);
  doc.text(
    `Thời gian: ${objHeader.TUNGAY} - Tổng nhân viên: ${objHeader.NHANVIEN}
   `,
    150,
    40,
    null,
    null,
    "center"
  );
};

const BangChamCong = (props) => {
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
  const [renderPdf, setRenderPdf] = useState();
  const [loading, setLoading] = useState(false);
  const [lstReport, setLstReport] = useState([]);
  const { columnsReports } = props;
  const [timeKeeping, setTimeKeeping] = useState();

  const handleSearch = () => {
    let month = moment(watch().month).format("MM");
    let year = moment(watch().month).format("YYYY");
    let hour = watch().timesheet_coeff;
    setTimeKeeping();
    if (!_.isEmpty(watch().month)) {
      if (
        (!_.isEmpty(watch().department_name) &&
          _.isEmpty(watch().timesheet_coeff)) ||
        (!_.isEmpty(watch().department_name) && watch().timesheet_coeff === "0")
      ) {
        setLoading(true);
        let filter = `$filter=department_id eq ${
          watch().department_name
        } and month eq '${month}' and year eq '${year}'`;
        callApi(`odata/Timesheetss?${filter}`, "GET").then((res) => {
          setTimeKeeping(true);
          setLstReport(res.data.value);
          setLoading(false);
        });
      } else if (
        !_.isEmpty(watch().department_name) &&
        !_.isEmpty(watch().timesheet_coeff)
      ) {
        setLoading(true);
        let filter = `hour=${
          watch().timesheet_coeff
        }&month=${month}&year=${year}&$Filter=department_id eq ${
          watch().department_name
        }`;
        callApi(`odata/Timesheetss/hourly?${filter}`, "GET").then((res) => {
          setTimeKeeping(false);
          setLstReport(res.data.value);
          setLoading(false);
        });
      } else {
        Notification("warning", "Vui lòng nhập khoa phòng");
      }
    } else {
      Notification("warning", "Vui lòng nhập tháng !");
    }
  };
  console.log("timekeeping ", timeKeeping);

  useEffect(() => {
    handlePrint();
  }, [lstReport]);
  const disabledDate = (current) => {
    return current && current < moment(watch().TUNGAY).endOf("day");
  };
  const handlePrint = async () => {
    const time = _.isEmpty(watch().timesheet_coeff)
      ? ""
      : watch().timesheet_coeff === "0"
      ? ""
      : `TRỰC ${watch().timesheet_coeff}H`;
    var doc = new jsPDF("l", "", "a4");

    doc.addFileToVFS("Amiri-Regular.ttf", font);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.addFileToVFS("Amiri-Regular-bold.ttf", fontBold);
    doc.addFont("Amiri-Regular-bold.ttf", "Amiri-bold", "normal");
    doc.setFont("Amiri");
    doc.setFontSize(5);
    headerPDF(doc, {
      COMPANY: `Bệnh viện Thống Nhất`,
      ADDRESS: `1 Lý Thường Kiệt, Phường 7, Tân Bình, Thành phố Hồ Chí Minh`,
      TITLE: `BẢNG CHẤM CÔNG ${time ? time : ""}`,
      DEPARTMENT:
        watch().department_name && lstReport.length > 0
          ? lstReport[0].department_name
          : "Tất cả",
      TUNGAY: watch().month ? FormatMonth(watch().month) : "",
      NHANVIEN: lstReport.length > 0 ? lstReport.length : "--",
    });
    var finalY = doc.lastAutoTable.finalY + 20 || 30;

    doc.autoTable({
      startY: finalY + 20,
      headStyles: {
        fillColor: [208, 215, 222],
        textColor: 0,
        font: "Amiri-bold",
        halign: "center",
      },
      html: "#table_bc_cong",
      useCss: true,
      columnStyles: {
        1: { cellWidth: 30 },
        33: { cellWidth: 11 },
        34: { cellWidth: 11 },
        35: { cellWidth: 11 },
      },
      styles: {
        font: "Amiri",
        fontStyle: "normal",
        lineColor: "black",
        lineWidth: 0.3,
        textColor: "black",
      },
      margin: [4, 4, 4, 4],
    });

    var finalYY = doc.lastAutoTable.finalY;

    if (finalYY > 160) {
      finalYY = 10;
      doc.addPage();
      doc.setFontSize(10);
      doc.text(`LAO ĐỘNG TIỀN LƯƠNG`, 10, finalYY + 40);
      doc.text(`LÃNH ĐẠO KHOA/PHÒNG`, 150, finalYY + 40);
      doc.text(`NGƯỜI CHẤM CÔNG`, 260, finalYY + 40, "center");
      doc.setFont("Amiri");
      doc.setFontSize(8);
      doc.text(
        `Tp.Hồ Chí Minh, ngày ... tháng ... năm ...`,
        260,
        finalYY + 35,
        "center"
      );
      doc.setFont("Amiri");
      doc.setFontSize(8);
      doc.text("Ghi chú", 25, finalYY + 10);
      doc.text("- +: Lương thời gian", 30, finalYY + 15);
      doc.text("- P: Nghỉ phép năm", 70, finalYY + 15);
      doc.text("- T: Trực thường", 110, finalYY + 15);
      doc.text("- Ô: Bản thân ốm", 30, finalYY + 20);
      doc.text("- H: Nghỉ hội nghị, học tập", 70, finalYY + 20);
      doc.text("- C: Trực thứ 7, CN", 110, finalYY + 20);
      doc.text("- Cô: Nghỉ con ốm", 30, finalYY + 25);
      doc.text("- +/P: Nghỉ phép nữa ngày", 70, finalYY + 25);
      doc.text("- L: Trực lễ", 110, finalYY + 25);
      doc.text("- TS: Thai sản", 30, finalYY + 30);
      doc.text("- Ro: Nghỉ không lương", 70, finalYY + 30);
      doc.text("- Te: Trực tết", 110, finalYY + 30);
    } else {
      doc.setFontSize(10);
      doc.text(`LAO ĐỘNG TIỀN LƯƠNG`, 10, finalYY + 40);
      doc.text(`LÃNH ĐẠO KHOA/PHÒNG`, 150, finalYY + 40);
      doc.text(`NGƯỜI CHẤM CÔNG`, 260, finalYY + 40, "center");
      doc.setFont("Amiri");
      doc.setFontSize(8);
      doc.text(
        `Tp.Hồ Chí Minh, ngày ... tháng ... năm ...`,
        260,
        finalYY + 35,
        "center"
      );
      doc.setFont("Amiri");
      doc.setFontSize(8);
      doc.text("Ghi chú", 25, doc.lastAutoTable.finalY + 10);
      doc.text("- +: Lương thời gian", 30, doc.lastAutoTable.finalY + 15);
      doc.text("- P: Nghỉ phép năm", 70, doc.lastAutoTable.finalY + 15);
      doc.text("- T: Trực thường", 110, doc.lastAutoTable.finalY + 15);
      doc.text("- Ô: Bản thân ốm", 30, doc.lastAutoTable.finalY + 20);
      doc.text(
        "- H: Nghỉ hội nghị, học tập",
        70,
        doc.lastAutoTable.finalY + 20
      );
      doc.text("- C: Trực thứ 7, CN", 110, doc.lastAutoTable.finalY + 20);
      doc.text("- Cô: Nghỉ con ốm", 30, doc.lastAutoTable.finalY + 25);
      doc.text("- +/P: Nghỉ phép nữa ngày", 70, doc.lastAutoTable.finalY + 25);
      doc.text("- L: Trực lễ", 110, doc.lastAutoTable.finalY + 25);
      doc.text("- TS: Thai sản", 30, doc.lastAutoTable.finalY + 30);
      doc.text("- Ro: Nghỉ không lương", 70, doc.lastAutoTable.finalY + 30);
      doc.text("- Te: Trực tết", 110, doc.lastAutoTable.finalY + 30);
    }

    // doc.save("in.pdf");
    if (!_.isEmpty(lstReport)) {
      let pdf = doc.output("datauri");
      setRenderPdf(pdf);
    } else {
      setRenderPdf("");
    }
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="Báo cáo chấm công" />
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            display: "flex",
            width: "100%",
          }}
        >
          {/* <Link to="/dao-tao/ngan-hang-cau-hoi" target="_blank">About</Link> */}
          <Col span={4}>
            <Select
              control={control}
              label="Khoa phòng"
              name="department_name"
              arrayItem={`odata/Departments`}
              valueOpt="id"
              nameOpt="name"
              // required
            />
          </Col>

          <Col span={3}>
            <MonthPicker
              label="Tháng"
              control={control}
              errors={errors}
              name="month"
              // required
            />
          </Col>

          <Col span={8}>
            <Select
              control={control}
              label="Loại công"
              name="timesheet_coeff"
              arrayItem={LoaiCong}
              valueOpt="value"
              nameOpt="LoaiCong"
              // required
            />
          </Col>
          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              loading={loading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
        </div>
      </Row>
      <div className="gridView" id="report">
        <Spin spinning={loading}>
          {_.isEmpty(lstReport) ? (
            <h1 style={{ height: "78vh" }} className="d-flex-center">
              Không có dữ liệu
            </h1>
          ) : (
            <embed
              src={renderPdf}
              type="application/pdf"
              style={{ height: "78vh", width: "100%" }}
            ></embed>
          )}

          {!_.isEmpty(renderPdf) && loading == false ? null : timeKeeping ? (
            <>
              <table id="table_bc_cong" style={{ display: "none" }}>
                <thead>
                  <tr>
                    <th rowSpan={2}>STT</th>
                    <th rowSpan={2}>Họ và tên</th>
                    <th colSpan={31} id="date_month">
                      Các ngày trong tháng
                    </th>
                    <th colSpan={3} id="cong">
                      Quy ra công
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
                    <th className="cong_1">Công hưởng lương thời gian</th>
                    <th className="cong_1">Công nghỉ không lương</th>
                    <th className="cong_1">Công nghỉ hưởng BHXH</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(lstReport, (item, index) => {
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
                        <td>{item.count_day}</td>
                        <td>{item.unpaid_day_off}</td>
                        <td>{item.insurance_day_off}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table id="table_note">
                {/* <tr>
                <th colSpan={3}>Ghi chú</th>
              </tr>
              <tr>
                <td>Lương thời gian</td>
              </tr> */}
              </table>
            </>
          ) : (
            <BangChamCong12h
              lstReport={lstReport}
              value={watch().timesheet_coeff}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

BangChamCong.propTypes = {};

export default BangChamCong;
