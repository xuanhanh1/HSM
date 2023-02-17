import React, { useState, useEffect } from "react";
import { useLocalStorage, Input, Notification, callApi, _ } from "../../index";
import { Col } from "antd";
import CardsCountUp from "./cardsCountUp";
import {
  AuditOutlined,
  ContainerOutlined,
  FileDoneOutlined,
  ExceptionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import img1 from "../../../../../src/common/assets/images/prm.jpg";
import img2 from "../../../../../src/common/assets/images/prm2.png";
import img3 from "../../../../../src/common/assets/images/prm3.png";
import img4 from "../../../../../src/common/assets/images/prm4.jpg";
function OverviewCard(props) {
  const [data, setData] = useState({});
  useEffect(() => {
    callApi("odata/Staffs", "GET")
      .then((res) => {
        setData({
          dang_cong_tac: _.countBy(
            res.data.value,
            (item) => item.staff_status_name === "Đang công tác"
          ).true,
          thoi_viec: _.countBy(
            res.data.value,
            (item) => item.staff_status_name === "Thôi việc"
          ).true,
          chuyen_cong_tac: _.countBy(
            res.data.value,
            (item) => item.staff_status_name === "Chuyển công tác"
          ).true,
          khac: _.countBy(
            res.data.value,
            (item) => item.staff_status_name === null
          ).true,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);
  return (
    <React.Fragment>
      <Col span={6}>
        <CardsCountUp
          data={data.dang_cong_tac}
          content={"Cán bộ"}
          title={"Tổng số nhân sự đang công tác"}
          color={"#00aeff"}
          icon={<UserOutlined />}
          img={
            <img
              src={img1}
              style={{
                height: "100px",
                position: "absolute",
                bottom: "-30px",
                right: "-20px",
                opacity: "0.7",
              }}
            />
          }
        />
      </Col>
      <Col span={6}>
        <CardsCountUp
          data={data.thoi_viec}
          content={"Cán bộ"}
          title={"Tổng số nhân sự thôi việc"}
          color={"#19E6A0"}
          icon={<UserOutlined />}
          img={
            <img
              src={img2}
              style={{
                height: "100px",
                position: "absolute",
                bottom: "-30px",
                right: "-20px",
                opacity: "0.7",
              }}
            />
          }
        />
      </Col>
      <Col span={6}>
        <CardsCountUp
          data={data.chuyen_cong_tac}
          content={"Cán bộ"}
          title={"Tổng số nhân sự chuyển công tác"}
          color={"#FEB830"}
          icon={<UserOutlined />}
          img={
            <img
              src={img3}
              style={{
                height: "100px",
                position: "absolute",
                bottom: "-30px",
                right: "-20px",
                opacity: "0.7",
              }}
            />
          }
        />
      </Col>
      <Col span={6}>
        <CardsCountUp
          data={data.khac}
          content={"Cán bộ"}
          title={"Tổng số nhân sự khác"}
          color={"#EE202A"}
          icon={<UserOutlined />}
          img={
            <img
              src={img4}
              style={{
                height: "100px",
                position: "absolute",
                bottom: "-30px",
                right: "-20px",
                opacity: "0.7",
              }}
            />
          }
        />
      </Col>
    </React.Fragment>
  );
}

export default OverviewCard;
