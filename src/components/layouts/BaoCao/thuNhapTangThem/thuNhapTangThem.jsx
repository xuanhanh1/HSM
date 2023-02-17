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

const headerPDF = (doc, objHeader) => {
  doc.setFontSize(11);
  doc.text(`BỘ Y TẾ`, 50, 10, "center");
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 200, 10);
  doc.setFontSize(10);

  doc.text("--------oOo--------", 50, 20, null, null, "center");
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

const ThuNhapTangThem = (props) => {
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

  const handleSearch = () => {
    let month = moment(watch().month).format("MM");
    let year = moment(watch().month).format("YYYY");
    if (!_.isEmpty(watch().department_name) && !_.isEmpty(watch().month)) {
      setLoading(true);
      let filter = `$filter=month eq '${month}' and year eq '${year}' and department_id eq ${
        watch().department_name
      }`;
      console.log("filter ", filter);
      callApi(`odata/ExtraSalarys?${filter}`, "GET").then((res) => {
        setLstReport(res.data.value);
        setLoading(false);
      });
    } else {
      Notification("warning", "Vui lòng nhập thời gian và khoa phòng !");
    }
  };

  useEffect(() => {
    handlePrint();
  }, [lstReport]);
  const disabledDate = (current) => {
    return current && current < moment(watch().TUNGAY).endOf("day");
  };
  const handlePrint = async () => {
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
      TITLE: `BẢNG THU NHẬP TĂNG THÊM`,
      DEPARTMENT:
        watch().department_name && lstReport.length > 0
          ? lstReport[0].department_name
          : "Tất cả",
      TUNGAY: watch().month ? FormatMonth(watch().month) : "",
      NHANVIEN: lstReport ? lstReport.length : "",
    });
    var finalY = doc.lastAutoTable.finalY + 20 || 30;

    doc.autoTable({
      startY: finalY + 15,
      headStyles: {
        fillColor: [208, 215, 222],
        textColor: 0,
        font: "Amiri-bold",
        halign: "center",
      },
      html: "#table",
      useCss: true,
      columnStyles: {
        1: { cellWidth: 30 },
        33: { cellWidth: 25 },
        34: { cellWidth: 25 },
        35: { cellWidth: 25 },
      },
      styles: {
        font: "Amiri",
        fontStyle: "normal",
        lineColor: "black",
        lineWidth: 0.3,
        textColor: "black",
      },
      margin: [5, 5, 5, 5],
    });
    if (!_.isEmpty(lstReport)) {
      let pdf = doc.output("datauri");
      setRenderPdf(pdf);
    } else {
      setRenderPdf("");
    }
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Báo cáo thu nhập tăng thêm"
      />
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
          <Col span={4}>
            <Select
              control={control}
              label="Khoa phòng"
              name="department_name"
              arrayItem={`odata/Departments`}
              valueOpt="id"
              nameOpt="name"
            />
          </Col>

          <Col span={3}>
            <MonthPicker
              label="Tháng"
              control={control}
              errors={errors}
              name="month"
              required
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

          {!_.isEmpty(renderPdf) && loading == false ? null : (
            <table id="table" style={{ display: "none" }}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã nhân viên</th>
                  <th>Họ và tên</th>
                  <th>Chức vụ</th>
                  <th>Tiền TNTT</th>
                  <th>Thuế</th>
                  <th>Thực lãnh</th>
                  <th>STK</th>
                  <th>Ngân hàng</th>
                </tr>
              </thead>
              <tbody>
                {_.map(lstReport, (item, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1} STT</td>
                      <td>{item.staff_code}</td>
                      <td> {item.staff_name}</td>
                      <td> {item.position_name}</td>
                      <td> {item.total_salary}</td>
                      <td> 0 </td>
                      <td> {item.extra_salary_received} </td>
                      <td> {item.bank_account_number} </td>
                      <td> {item.bank_name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Spin>
      </div>
    </div>
  );
};

ThuNhapTangThem.propTypes = {};

export default ThuNhapTangThem;
