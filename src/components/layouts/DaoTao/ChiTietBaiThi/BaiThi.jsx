import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Button, Descriptions, PageHeader, Layout } from "antd";
import Quiz from "./Quiz";
const { Header, Footer, Sider, Content } = Layout;

function BaiThi(props) {
  const { initialMinute = 10, initialSeconds = 20 } = props;
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <>
      <div>Dashboard</div>
      {/* <Layout>
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            // title="Title"
            // subTitle=""
          >
            <div>
              <Descriptions size="default" column={0.5}>
                <Descriptions.Item label="Tên bài test ">
                  <b>Bài test số 1</b>
                </Descriptions.Item>
                <Descriptions.Item label="Người hướng dẫn ">
                  <b>Admin</b>
                </Descriptions.Item>
                <Descriptions.Item label="Nội dung bài test ">
                  Giới thiệu bài test số 1
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian làm bài ">
                  <b>60 phút</b>
                </Descriptions.Item>
                <Descriptions.Item label="Số lượng câu hỏi ">
                  <b>60 câu</b>
                </Descriptions.Item>
              </Descriptions>
              <Button key="1" type="primary">
                Bắt đầu
              </Button>
            </div>
          </PageHeader>
        </div>
        <Layout>
          <PageHeader ghost={false} onBack={() => window.history.back()}>
            <Descriptions size="default" column={2}>
              <Descriptions.Item>
                <b>Bài test số 1</b>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian ">
                <div>
                  {minutes === 0 && seconds === 0 ? null : (
                    <h1>
                      {" "}
                      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </h1>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>
            <Quiz></Quiz>
          </PageHeader>
       
        </Layout>
      </Layout> */}
    </>
  );
}

BaiThi.defaultProps = {
  columns: [],
};

export default BaiThi;
