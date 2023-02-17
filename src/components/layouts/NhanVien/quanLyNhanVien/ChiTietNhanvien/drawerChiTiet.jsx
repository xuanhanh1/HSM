import {
  Col,
  Descriptions,
  Divider,
  Drawer,
  Image,
  Row,
  Space,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import callApi from "../../../../../config/configApi";
import { FormatDate } from "../../../../controller/Format";
import ChucDanhKhoaHocDetail from "./Detail/ChucDanhKhoaHocDetail";
import DangChinhQuyen from "./Detail/DangChinhQuyen";
import DaoTaoBoiDuongDetail from "./Detail/DaoTaoBoiDuongDetail";
import DaoTaoChuyenMonDetail from "./Detail/DaoTaoChuyenMonDetail";
import NhaODetail from "./Detail/keKhaiTaiSanDetail/nhaODetail";
import QuyenSuDungDatDetail from "./Detail/keKhaiTaiSanDetail/quyenSuDungDatDetail";
import TaiSanKhacDetail from "./Detail/keKhaiTaiSanDetail/taiSanKhacDetail";
import LyLuanChinhTriDetail from "./Detail/LyLuanChinhTriDetail";
import NgoaiNguDetail from "./Detail/ngoaiNguDetail";
import PhuCapDetail from "./Detail/PhuCapDetail";
import QuanHeGiaDinhDetail from "./Detail/QuanHeGiaDinhDetail";
import QuaTrinhCongTac from "./Detail/QuaTrinhCongTac";
import QuyHoachCanBoDetail from "./Detail/QuyHoachCanBoDetail";
import ThiDuaKhenThuongDetail from "./Detail/ThiDuaKhenThuongDetail";
import ThongTinHopDongDetail from "./Detail/ThongTinHopDongDetail";
import ThongTinKyLuatDetail from "./Detail/thongTinKyLuatDetail";
import ThongTinLuongDetail from "./Detail/ThongTinLuong";
import ThongTinNhanVienDetail from "./Detail/ThongTinNhanVien";
import TinHocDetail from "./Detail/tinHocDetail";
import TinHoc from "./Detail/tinHocDetail";

function DrawerChiTiet(props) {
  const { isVisible, setVisible, objView, columns, columnContracts } = props;
  // console.log("🚀 ~ DrawerChiTiet ~ objView", objView)
  const { TabPane } = Tabs;
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };
  useEffect(() => {
    callApi(`odata/StaffInfors?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log(res);
        setData(...res.data.value);
      }
    );
  }, []);

  return (
    <Drawer
      title={`Thông tin chi tiết của nhân viên ${objView.code} - ${objView.name}`}
      placement="right"
      width={"90vw"}
      onClose={onClose}
      visible={isVisible}
      maskClosable={false}
    >
      <div className="drawer-chitiet" style={{ marginBottom: "40px" }}>
        <Space size={12}>
          <Image
            width={150}
            height={150}
            // src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            src=""
          />
          <Descriptions
            bordered
            size="small"
            style={{
              marginBottom: "10px",
              marginTop: "10px",
              marginLeft: "30px",
            }}
          >
            <Descriptions.Item label={"Mã nhân viên"} span={2.5}>
              <b>{objView.code}</b>
            </Descriptions.Item>
            <Descriptions.Item label={"Mã số hiệu"} span={2.5}>
              <b>{objView.number_sign}</b>
            </Descriptions.Item>
            <Descriptions.Item label={"Mã kế toán"} span={2.5}>
              <b>{objView.codekt}</b>
            </Descriptions.Item>
            <Descriptions.Item label={"Mã Hsoft"} span={2.5}>
              <b>{objView.codehis}</b>
            </Descriptions.Item>
            <Descriptions.Item label={"Họ và tên"} span={2.5}>
              <b>{objView.name}</b>
            </Descriptions.Item>
            <Descriptions.Item label={"Số Điện thoại"} span={2.5}>
              <b>{objView.phone}</b>
            </Descriptions.Item>
            <Descriptions.Item label={"Ngày tuyển dụng"} span={2.5}>
              <b>
                {data?.recruited_date ? FormatDate(data?.recruited_date) : ""}
              </b>
            </Descriptions.Item>
            <Descriptions.Item label={"Ngày vào cơ quan"} span={2.5}>
              <b>
                {data?.offical_recruited_date
                  ? FormatDate(data?.offical_recruited_date)
                  : ""}
              </b>
            </Descriptions.Item>
            <Descriptions.Item label={"Tên tài khoản"} span={2.5}>
              <b>{objView.user_name}</b>
            </Descriptions.Item>
            <Descriptions.Item label={"Chức vụ"} span={2.5}>
              <b>{objView.position_name}</b>
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Tabs defaultActiveKey="1" tabPosition={"left"}>
            <TabPane tab={t("Thông tin nhân viên")} key="1">
              <ThongTinNhanVienDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("TtLuong")} key="2">
              <ThongTinLuongDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("phucap")} key="3">
              <PhuCapDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("ChucVuDangDoanChinhQuyen")} key="4">
              <DangChinhQuyen objView={objView} />
            </TabPane>
            <TabPane tab={t("QuaTrinhNhanVienCongTac")} key="5">
              <QuaTrinhCongTac objView={objView} />
            </TabPane>
            <TabPane tab={t("daotaochuyemon")} key="6">
              <DaoTaoChuyenMonDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("THhiDuaKhenThuong")} key="7">
              <ThiDuaKhenThuongDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("TTKL")} key="8">
              <ThongTinKyLuatDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("NNTH")} key="9">
              <NgoaiNguDetail objView={objView} />
              <Divider></Divider>
              <TinHocDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("LLCT")} key="10">
              <LyLuanChinhTriDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("CDKH")} key="11">
              <ChucDanhKhoaHocDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("TTHD")} key="12">
              <ThongTinHopDongDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("QHGD")} key="13">
              <QuanHeGiaDinhDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("KKTS")} key="14">
              <NhaODetail objView={objView} />
              <Divider></Divider>
              <QuyenSuDungDatDetail objView={objView} />
              <Divider />
              <TaiSanKhacDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("QHCB")} key="15">
              <QuyHoachCanBoDetail objView={objView} />
            </TabPane>
            <TabPane tab={t("DTBD")} key="16">
              <DaoTaoBoiDuongDetail objView={objView} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Drawer>
  );
}

DrawerChiTiet.defaultProps = {};

export default DrawerChiTiet;
