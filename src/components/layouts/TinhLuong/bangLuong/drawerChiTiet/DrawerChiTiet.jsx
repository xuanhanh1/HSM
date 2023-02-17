import React, { useState, useEffect } from "react";
import {
  Drawer,
  Row,
  Col,
  Descriptions,
  Button,
  Checkbox,
  Tabs,
  Space,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { callApi, _ } from "../../../index";
import { createTypesDepartment } from "../../../../../redux/actions/DanhMuc";
import { t } from "i18next";
import { FormatMoney } from "../../../../controller/Format";
import TienTruc from "./TienTruc";
import LuongCoBan from "./luongCoBan";
import LuongDacThu from "./luongDacThu";
import LuongThuThuat from "./luongThuThuat";
import LuongPhauThuat from "./luongPhauThuat";
import ThuNhapTangThem from "./thuNhapTangThem";
const { TabPane } = Tabs;
function DrawerChiTiet(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const dispatch = useDispatch();
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  // }, []);
  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };
  console.log(objView);
  return (
    <>
      <Drawer
        title={`Thông tin chi tiết bảng lương`}
        placement="right"
        width={"50vw"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <div className="drawer-chitiet" style={{ marginBottom: "40px" }}>
          <Space size={12}>
            <Descriptions
              bordered
              size="small"
              style={{
                marginBottom: "10px",
                marginTop: "10px",
                marginLeft: "30px",
              }}
            >
              <Descriptions.Item label={"Mã cán bộ"} span={2.5}>
                <b>{objView.staff_code}</b>
              </Descriptions.Item>
              <Descriptions.Item label={"Tên cán bộ"} span={2.5}>
                <b>{objView.staff_name}</b>
              </Descriptions.Item>
              <Descriptions.Item label={"Mã số thuế"} span={2.5}>
                <b>{objView.number_sign}</b>
              </Descriptions.Item>
              <Descriptions.Item label={"Tổng tiền lương"} span={2.5}>
                <b>
                  {FormatMoney(
                    objView.fixed_salary_money +
                      objView.overtime_salary_money +
                      objView.special_salary_money +
                      objView.surgical_salary_money +
                      objView.minorsurgical_salary_money +
                      objView.extra_salary_money
                  )}
                </b>
              </Descriptions.Item>
              <Descriptions.Item label={"Thuế thu nhập cá nhân"} span={2.5}>
                <b>{FormatMoney(objView.codehis)}</b>
              </Descriptions.Item>
              <Descriptions.Item label={"Tổng cộng"} span={2.5}>
                <b>{FormatMoney(objView.total_income)}</b>
              </Descriptions.Item>
              <Descriptions.Item label={"Số tài khoản"} span={2.5}>
                <b>{objView.bank_account_number}</b>
              </Descriptions.Item>
              <Descriptions.Item label={"Ngân hàng"} span={2.5}>
                <b>{objView.bank_name}</b>
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </div>
        <Row gutter={[16, 16]}>
          <Tabs defaultActiveKey="1" tabPosition={"left"}>
            <TabPane tab={t("Lương cơ bản")} key="1">
              <LuongCoBan objEdit={objView} />
            </TabPane>
            <TabPane tab={t("Lương đặc thù")} key="2">
              <LuongDacThu objEdit={objView} />
            </TabPane>
            <TabPane tab={t("Lương thủ thuật")} key="3">
              <LuongThuThuat objEdit={objView} />
            </TabPane>
            <TabPane tab={t("Lương phẩu thuật")} key="4">
              <LuongPhauThuat objEdit={objView} />
            </TabPane>
            <TabPane tab={t("Tiền trực thêm giờ")} key="5">
              <TienTruc objEdit={objView} />
            </TabPane>
            <TabPane tab={t("Thu nhập tăng thêm")} key="6">
              <ThuNhapTangThem objEdit={objView} />
            </TabPane>
          </Tabs>
        </Row>
      </Drawer>
    </>
  );
}

DrawerChiTiet.defaultProps = {};

export default DrawerChiTiet;
