import React, { useState, useEffect } from "react";
import { Drawer, Row, Col, Descriptions, Button, Checkbox } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { callApi, _ } from "../../../../index";
import { FormatDate } from "../../../../../controller/Format";
function DrawerThongTinLuong(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };
  return (
    <>
      <Drawer
        title={`Chi tiết thông tin lương`}
        placement="right"
        width={"800px"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Descriptions size="small" bordered>
              <Descriptions.Item label="Kiểu nâng lương" span={1.5}>
                <b>{objView.salary_increase_type_name}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Kiểu bảng lương" span={1.5}>
                <b>{objView.salary_sheet_type_name}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Số quyết định" span={1.5}>
                <b>{objView.decision_number}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày ký" span={1.5}>
                <b>
                  {objView.signing_date ? FormatDate(objView.signing_date) : ""}
                </b>
              </Descriptions.Item>
              <Descriptions.Item label="Người ký" span={1.5}>
                <b>{objView.signer}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hưởng" span={1.5}>
                <b>
                  {objView.benefit_date ? FormatDate(objView.benefit_date) : ""}
                </b>
              </Descriptions.Item>
              <Descriptions.Item label="Tập sự" span={1.5}>
                <b>{objView.is_probationary ? "Tập sự" : "Không tập sự"}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Chức danh nghề nghiệp" span={1.5}>
                <b>{objView.career_title_name}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày giữ nghạch" span={1.5}>
                <b>
                  {objView.career_start_date
                    ? FormatDate(objView.career_start_date)
                    : ""}
                </b>
              </Descriptions.Item>
              <Descriptions.Item label="Bậc lương" span={1.5}>
                <b>{objView.salary_level}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Hệ số lương" span={1.5}>
                <b>{objView.salary_coef}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Vượt khung" span={1.5}>
                <b>
                  {objView.is_seniority ? "Vượt khung" : "Không vượt khung"}
                </b>
              </Descriptions.Item>
              <Descriptions.Item label="Hệ số thâm niêm vượt khung" span={1.5}>
                <b>{objView.seniority_coef}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Hệ số chức vụ" span={1.5}>
                <b>{objView.position_coef}</b>
              </Descriptions.Item>
              <Descriptions.Item
                label="Hệ số trách nghiệm công việc"
                span={1.5}
              >
                <b>{objView.responsibility_coef}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Hệ số ưu đãi" span={1.5}>
                <b>{objView.favour_coef}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Hệ số độc hại" span={1.5}>
                <b>{objView.toxic_coef}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Hệ số đặc thù" span={1.5}>
                <b>{objView.special_coef}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Điểm chức vụ" span={1.5}>
                <b>{objView.position_mark}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Điểm trình độ" span={1.5}>
                <b>{objView.degree_mark}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Điểm phân loại" span={1.5}>
                <b>{objView.classify_mark}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Tiền công đoàn" span={1.5}>
                <b>{objView.labor_union_fee}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian nâng" span={1.5}>
                <b>{objView.salary_increase_time}</b>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Drawer>
    </>
  );
}

DrawerThongTinLuong.defaultProps = {};

export default DrawerThongTinLuong;
