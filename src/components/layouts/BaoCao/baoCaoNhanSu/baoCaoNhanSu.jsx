import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { PageHeader, Row, Col, Button, Spin, Descriptions } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  DatePicker,
  moment,
  Select,
  _,
  callApi,
  Notification,
} from "../../index";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  FormatMoney,
  FormatDate,
  setValueReactFormHook,
} from "../../../controller/Format";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import font from "../../../controller/font";
import fontBold from "../../../controller/font-bold";
import { trangThaiNhanVien } from "../../../controller/DataSample";
import "./index.css";

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

  doc.setFont("Amiri-bold");
  doc.setFontSize(14);
  doc.text(
    `${objHeader.DETAIL ? "Thông tin chi tiết nhân viên" : ""}`,
    150,
    85,
    null,
    null,
    "center"
  );
  doc.setFontSize(9);
  doc.setFont("Amiri");
  doc.text(
    `Khoa/Phòng: ${objHeader.DEPARTMENT}`,
    150,
    35,
    null,
    null,
    "center"
  );
  doc.setFontSize(9);
  doc.setFont("Amiri");
  doc.text(`Nhân viên: ${objHeader.STAFF}`, 150, 40, null, null, "center");
  // doc.text(
  //   `Tên nhà cung cấp: ${objHeader.SUPPLIER_NAME}`,
  //   150,
  //   45,
  //   null,
  //   null,
  //   "center"
  // );
};

const BaoCaoNhanSu = (props) => {
  const { columnInfor } = props;
  const nvInfor = JSON.parse(window.localStorage.getItem("infoNV"));
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { setValue, control, watch } = useForm();
  const [renderPdf, setRenderPdf] = useState();
  const [loading, setLoading] = useState(false);
  const [lstStaff, setLstStaff] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [staffInfor, setStaffInfor] = useState([]);
  const [infor, setInfor] = useState([]);
  const [lstDepartments, setLstDepartments] = useState([]);
  const refInfor = useRef();

  useEffect(() => {
    callApi(`odata/Staffs`, "GET").then((res) => {
      setAllStaff(res.data.value);
    });
  }, []);
  useEffect(() => {
    callApi(`odata/Departments`, "GET").then((res) => {
      setLstDepartments(res.data.value);
    });
  }, []);
  useEffect(() => {
    callApi(`odata/AvailableCatalogs/StaffStatuss`, "GET").then((res) => {
      setValue("status_name", res.data[2].id);
    });
  }, []);

  const handleSearch = async () => {
    let code = watch().code;
    let status_name = watch().status_name;
    let department_name = watch().department_name;

    setLstStaff();
    setStaffInfor();
    if (_.isEmpty(department_name)) {
      if (!_.isEmpty(code)) {
        setLoading(true);
        let filter = `$filter=id eq ${code}`;
        let filterInfor = `$filter=staff_id eq ${code}`;
        await callApi(`odata/Staffs?${filter}`, "GET").then((res) => {
          setLstStaff(res.data.value);
        });
        callApi(`odata/StaffInfors?${filterInfor}`, "GET").then((res) => {
          setStaffInfor(res.data.value);
          setLoading(false);
        });
        setValue("code", "");
      } else {
        Notification("warning", "Vui lòng chọn khoa phòng");
      }
    } else {
      let filterDepartment = `$filter=department_id eq ${department_name} and `;
      let filterStatus = status_name ? `staff_status_id eq ${status_name}` : "";
      let result = filterDepartment.concat(filterStatus);
      callApi(`odata/Staffs?${result}`).then((res) => {
        setLstStaff(res.data.value);
        setLoading(false);
      });
      setValue("department_name", "");
    }
  };
  useEffect(() => {
    handlePrint();
  }, [lstStaff]);
  useEffect(() => {
    handlePrint();
  }, [staffInfor]);

  const handlePrint = async () => {
    var doc = new jsPDF("l", "", "a4");
    doc.addFileToVFS("Amiri-Regular.ttf", font);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.addFileToVFS("Amiri-Regular-bold.ttf", fontBold);
    doc.addFont("Amiri-Regular-bold.ttf", "Amiri-bold", "normal");
    doc.setFont("Amiri");
    headerPDF(doc, {
      COMPANY: `Bệnh viện Thống Nhất`,
      ADDRESS: ` 1 Lý Thường Kiệt, Phường 7, Tân Bình, Thành phố Hồ Chí Minh`,
      TITLE: `DANH SÁCH NHÂN SỰ`,
      STAFF: lstStaff && lstStaff.length === 1 ? lstStaff[0].name : "Tất cả",
      DEPARTMENT: !_.isEmpty(lstStaff) ? lstStaff[0].department_name : "",
      DETAIL: staffInfor ? true : false,
    });

    doc.autoTable({
      startY: 50,
      headStyles: {
        fillColor: [208, 215, 222],
        textColor: 0,
        font: "Amiri-bold",
      },
      columnStyles: {
        2: { cellWidth: 40 },
      },
      html: "#table",
      useCss: true,
      styles: {
        font: "Amiri",
        fontStyle: "normal",
      },
      margin: [10, 10, 10, 10],
    });
    doc.autoTable({
      startY: 90,
      headStyles: {
        fillColor: [208, 215, 222],
        textColor: 0,
        font: "Amiri-bold",
      },

      html: "#table_1",
      useCss: true,
      styles: {
        font: "Amiri",
        fontStyle: "normal",
      },
      margin: [10, 10, 10, 10],
    });
    if (!_.isEmpty(lstStaff)) {
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
        title={"Báo cáo danh sách nhân sự"}
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
              arrayItem={lstDepartments}
              valueOpt="id"
              nameOpt="name"
            />
          </Col>
          <Col span={4}>
            <Select
              control={control}
              label="Trạng thái nhân viên"
              name="status_name"
              arrayItem={`odata/AvailableCatalogs/StaffStatuss`}
              valueOpt="id"
              nameOpt="name"
            />
          </Col>
          <Col span={4}>
            <Select
              control={control}
              label="Mã nhân viên"
              name="code"
              arrayItem={allStaff}
              valueOpt="id"
              nameOpt="code"
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
          {_.isEmpty(lstStaff) ? (
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
            <>
              <table id="table" style={{ display: "none" }}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã cán bộ</th>
                    <th>Họ và tên</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>Điện thoại</th>
                    <th>Email</th>
                    <th>Địa chỉ</th>
                    <th>Ngày vào ngành</th>
                    <th>Chức vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(lstStaff, (item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{FormatDate(moment(item.date_of_birth))}</td>
                        <td>{item.sex_name}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td>{item.address}</td>
                        <td>{FormatDate(moment(item.start_date))}</td>
                        <td>{item.position_name}</td>
                      </tr>
                    );
                  })}
                  {lstStaff && lstStaff.length > 1 ? (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", fontWeight: "700" }}
                      >
                        Tổng nhân viên{" "}
                      </td>
                      <td className="end-td">
                        {lstStaff ? lstStaff.length : ""}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>

              <table id="table_1" style={{ display: "none" }}>
                {!_.isEmpty(staffInfor) &&
                  _.map(staffInfor, (item, index) => {
                    return (
                      <>
                        <th key={index}>Thông tin chi tiết</th>
                        <tr>
                          <th>Họ và tên khác:</th>
                          <td>{item.other_name}</td>
                          <th>Cơ quan tuyển dụng:</th>
                          <td>{item.recruitment_agency}</td>
                        </tr>
                        <tr>
                          <th>Loại cán bộ:</th>
                          <td>{item.staff_type_name}</td>
                          <th>Mã số thuế:</th>
                          <td>{item.tax_code}</td>
                        </tr>
                        <tr>
                          <th>Dân tộc:</th>
                          <td>{item.ethnic_name}</td>
                          <th>Tôn giáo:</th>
                          <td>{item.religion_name}</td>
                        </tr>
                        <tr>
                          <th>Cân nặng:</th>
                          <td>{item.weight}</td>
                          <th>Chiều cao:</th>
                          <td>{item.height}</td>
                        </tr>
                        <tr>
                          <th>Sức khỏe:</th>
                          <td>{item.health_type_name}</td>
                          <th>Nhóm máu:</th>
                          <td>{item.health_insurance_number}</td>
                        </tr>
                        <tr>
                          <th>Số bảo hiểm xã hội:</th>
                          <td>{item.social_insurance_number}</td>
                          <th>Số thẻ bảo hiểm y tế:</th>
                          <td>{item.health_insurance_number}</td>
                        </tr>
                        <tr>
                          <th>Trạng thái công tác:</th>
                          <td>{item.staff_status_name}</td>
                          <th>Loại hợp đồng:</th>
                          <td>{item.staff_type_name}</td>
                        </tr>
                        <tr>
                          <th>Số CMND:</th>
                          <td>{item.identify}</td>
                          <th>Ngày cấp:</th>
                          <td>
                            {item.date_of_issue
                              ? FormatDate(moment(item.date_of_issue))
                              : null}
                          </td>
                        </tr>
                        <tr>
                          <th>Nơi cấp:</th>
                          <td>
                            {item.place_of_issue ? item.place_of_issue : ""}
                          </td>
                          <th>Trình độ phổ thông:</th>
                          <td> {item.general_education_name}</td>
                        </tr>

                        <tr>
                          <th>Ngày tuyển dụng:</th>
                          <td>
                            {item.recruited_date
                              ? FormatDate(moment(item.recruited_date))
                              : ""}
                          </td>
                          <th>Ngày vào làm:</th>
                          <td>
                            {item.offical_recruited_date
                              ? FormatDate(moment(item.offical_recruited_date))
                              : ""}
                          </td>
                        </tr>

                        <tr>
                          <th>Lịch sử bản thân:</th>
                          <td>{item.self_history}</td>
                          <th>Nhận xét đánh giá đơn vị:</th>
                          <td>{item.comment}</td>
                        </tr>
                      </>
                    );
                  })}
              </table>
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};

BaoCaoNhanSu.propTypes = {
  columnInfor: PropTypes.array,
};
BaoCaoNhanSu.defaultProps = {
  columnInfor: [
    {
      header: "TT BV",
      dataKey: "medicalsupplies_codeBV",
    },
    {
      header: "Mã BYT",
      dataKey: "medicalsupplies_codeBYT",
    },
    {
      header: "Tên danh mục BYT",
      dataKey: "medicalsupplies_nameBYT",
    },
  ],
};

export default BaoCaoNhanSu;
