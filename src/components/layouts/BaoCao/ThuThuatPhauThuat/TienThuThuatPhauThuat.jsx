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
import { FormatMoney, FormatMonth } from "../../../controller/Format";
import { Type } from "../../../controller/DataSample";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import font from "../../../controller/font";
import fontBold from "../../../controller/font-bold";
import PropTypes from "prop-types";
import "../bangChamCong/index.css";

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

const TienThuThuatPhauThuat = (props) => {
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
  const [isTT, setTT] = useState();
  const { columnsReports } = props;

  const handleSearch = () => {
    let month = moment(watch().month).format("MM");
    let year = moment(watch().month).format("YYYY");
    let type = watch().type;
    console.log("log", type);
    if (type === "") {
      Notification("warning", "Vui lòng chọn thủ thuật hay phẫu thuật !");
    } else {
      if (!_.isEmpty(watch().month)) {
        if (!_.isEmpty(watch().department_name) && !_.isEmpty(watch().month)) {
          setLoading(true);
          let filter = `$filter=department_id eq ${
            watch().department_name
          } and month eq '${month}' and year eq '${year}'`;
          console.log("filter ", filter);
          if (type) {
            callApi(`odata/Surgerys?${filter}`, "GET").then((res) => {
              setTT(true);
              setLstReport(res.data.value);
              setLoading(false);
            });
          } else {
            callApi(`odata/MinorSurgerys?${filter}`, "GET").then((res) => {
              setTT(false);
              setLstReport(res.data.value);
              setLoading(false);
            });
          }
        } else {
          Notification("warning", "Vui lòng nhập khoa phòng !");
        }
      } else {
        Notification("warning", "Vui lòng nhập thời gian !");
      }
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
      TITLE: `BẢNG BÁO CÁO ${isTT ? "THỦ THUẬT" : "PHẪU THUẬT"}`,
      DEPARTMENT:
        watch().department_name && lstReport.length > 0
          ? lstReport[0].department_name
          : "Tất cả",
      TUNGAY: watch().month ? FormatMonth(watch().month) : "",
      NHANVIEN: lstReport ? lstReport.length : "",
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
      html: "#table",
      useCss: true,
      columnStyles: {
        2: { cellWidth: 30 },
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
        title="Báo cáo tiền phẫu thuật thủ thuật"
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
              label="Loại thủ thuật phẫu thuật"
              name="type"
              arrayItem={Type}
              valueOpt="value"
              nameOpt="Type"
            />
          </Col>
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

          {!_.isEmpty(renderPdf) && loading == false ? null : isTT ? (
            <table id="table" style={{ display: "none" }}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã NV</th>
                  <th>Họ và tên</th>
                  <th>Chức vụ</th>
                  <th>Tiền ch_db</th>
                  <th>Tiền ph_db</th>
                  <th>Tiền gv_db</th>
                  <th>Tiền ch_l1</th>
                  <th>Tiền ph_l1</th>
                  <th>Tiền gv_l1</th>
                  <th>Tiền ch_l2</th>
                  <th>Tiền p_l2</th>
                  <th>Tiền gv_l2</th>
                  <th>Tiền ch_l3</th>
                  <th>Tiền p_l3</th>
                  <th>Tiền gv_l3</th>
                  <th>Tổng lương</th>
                </tr>
              </thead>
              <tbody>
                {_.map(lstReport, (item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.staff_code}</td>
                      <td>{item.staff_name}</td>
                      <td>{item.position_name}</td>
                      <td style={{ textAlign: "right" }}>
                        {" "}
                        {FormatMoney(item.ch_db_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ph_db_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.gv_db_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ch_l1_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ph_l1_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.gv_l1_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ch_l2_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ph_l2_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.gv_l2_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ch_l3_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ph_l3_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.gv_l3_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.total_money)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table id="table" style={{ display: "none" }}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã NV</th>
                  <th>Họ và tên</th>
                  <th>Chức vụ</th>
                  <th>Tiền ch_db</th>
                  <th>Tiền ph_db</th>
                  <th>Tiền gv_db</th>
                  <th>Tiền ch_l1</th>
                  <th>Tiền ph_l1</th>
                  <th>Tiền gv_l1</th>
                  <th>Tiền ch_l2</th>
                  <th>Tiền p_l2</th>
                  <th>Tiền gv_l2</th>
                  <th>Tiền ch_l3</th>
                  <th>Tiền p_l3</th>
                  <th>Tiền gv_l3</th>
                  <th>Tổng lương</th>
                </tr>
              </thead>
              <tbody>
                {_.map(lstReport, (item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.staff_code}</td>
                      <td>{item.staff_name}</td>
                      <td>{item.position_name}</td>
                      <td style={{ textAlign: "right" }}>
                        {" "}
                        {FormatMoney(item.ch_db_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ph_db_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.gv_db_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ch_l1_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ph_l1_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.gv_l1_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ch_l2_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ph_l2_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.gv_l2_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ch_l3_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.ph_l3_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.gv_l3_monney)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.total_money)}
                      </td>
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

TienThuThuatPhauThuat.propTypes = {};

export default TienThuThuatPhauThuat;
