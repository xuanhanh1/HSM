import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { callApi, _ } from "../../index";
import { Notification } from "../../index";
import { useSelector } from "react-redux";
import { toUpperPropertyName } from "../../../controller/Format";
import {
  BrowserRouter as Redirect,
  Route,
  Link,
  Switch,
} from "react-router-dom";
import moment from "moment";

const TT_BV = [
  "Chờ nhà cung cấp xác nhận",
  "Đã hủy phiếu gọi hàng",
  "Nhà cung cấp gửi thông tin xác nhận",
  "Hoàn thành",
  "Đã xác nhận giao hàng",
];
const TT_NCC = [
  "Danh sách chờ xác nhận đơn hàng",
  "Danh sách bệnh viện hủy đơn hàng",
  "Danh sách đã xác nhận đơn hàng",
  "Danh sách gọi hàng hoàn thành",
  "Danh sách bệnh viện xác nhận giao hàng",
];
const checkAccountNoti = (BENHVIENID, SUPPLIER_ID) => {
  if (BENHVIENID !== null && SUPPLIER_ID === null) {
    // la benh vien
    return true;
  }
  if (SUPPLIER_ID !== null && BENHVIENID === null) {
    // la nha cung cap
    return false;
  }
};
function PBHNotification(props) {
  const [notiList, setNotiList] = useState([]);
  const connection = useSelector((state) => state.UsersReducers.connection);
  const nhanVienInfor = JSON.parse(window.localStorage.getItem("infoNV"));
  useEffect(() => {
    //get all notification
    callApi("odata/Notifications", "GET")
      .then((res) => {
        if (res.data.length > 0) {
          if (
            checkAccountNoti(
              nhanVienInfor.BENHVIENID,
              nhanVienInfor.SUPPLIER_ID
            )
          ) {
            //benh vien
            let noti = res.data.filter((item) => {
              if (
                item.TrangThai_BenhVien === TT_BV[0] ||
                item.TrangThai_BenhVien === TT_BV[2] ||
                item.TrangThai_BenhVien === TT_BV[3]
              ) {
                return item;
              }
            });
            setNotiList(noti);
          } else {
            //nha cung cap
            let noti = res.data.filter((item) => {
              if (
                (item.NCC_Id === nhanVienInfor.SUPPLIER_ID &&
                  item.TrangThai_NCC === TT_NCC[0]) ||
                item.TrangThai_NCC === TT_NCC[1] ||
                item.TrangThai_NCC === TT_NCC[4]
              ) {
                return item;
              }
            });
            setNotiList(noti);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on(
            `ReceiveNotification_${nhanVienInfor.Id}`, //lấy notification theo mã nhân viên
            (notiViewModel) => {
              console.log(notiViewModel);
              let noti = toUpperPropertyName(notiViewModel);
              const newNoti = { ...noti, Id: noti.ID };
              const newNotiList = [newNoti, ...notiList];
              setNotiList(newNotiList);
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [notiList]);

  const handleNotiClick = (noti) => {
    // gui api update lại trạng thái seen
    if (!noti.Seen) {
      callApi(`odata/Notifications?key=${noti.Id}`, "PUT")
        .then((res) => {
          const data = [...notiList].map((x) => {
            if (x.Id === noti.Id) {
              x.Seen = true;
            }
            return x;
          });
          setNotiList(data);
        })
        .catch((err) => {
          Notification("error", err.response.data);
        });
    }
  };
  const menu = (
    <div className="pbh-noti">
      {notiList.length > 0 ? (
        <Menu>
          {notiList.map((item, index) => (
            <Menu.Item
              key={item?.Id}
              className="item-noti"
              style={{
                height: "auto",
                padding: "10px 10px",
                borderRadius: "10px",
              }}
              onClick={() => handleNotiClick(item)}
            >
              <Link
                to={
                  checkAccountNoti(
                    nhanVienInfor.BENHVIENID,
                    nhanVienInfor.SUPPLIER_ID
                  )
                    ? "/hop-dong/phieu-yeu-cau-goi-hang"
                    : "/nha-cung-cap/phieu-goi-hang"
                }
              >
                <Badge dot={!item?.Seen}>
                  <div style={{ cursor: "pointer" }}>
                    <p className="donvitao-noti">{`${item?.Ten_NCC}`}</p>

                    {item?.Ten_TrangThai ? (
                      <p className="content-noti">
                        Nội dung:{" "}
                        {checkAccountNoti(
                          nhanVienInfor.BENHVIENID,
                          nhanVienInfor.SUPPLIER_ID
                        )
                          ? item?.TrangThai_BenhVien
                          : item?.TrangThai_NCC}
                      </p>
                    ) : null}
                    <p className="time-noti">
                      {moment(
                        moment(item?.CreateDate).format("YYYY-MM-DD HH:mm:ss")
                      ).fromNow()}
                    </p>
                  </div>
                </Badge>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      ) : null}
    </div>
  );
  return (
    <p>
      <Badge
        count={_.filter(notiList, (x) => !x?.Seen).length}
        overflowCount={9}
        offset={[-1, 2]}
        size="small"
        style={{
          animation:
            _.filter(notiList, (x) => !x?.seen).length === 0
              ? ""
              : "tada 3.5s ease infinite",
        }}
      >
        <Dropdown overlay={menu} trigger={["hover"]}>
          <BellOutlined style={{ fontSize: "20px", padding: "8px" }} />
        </Dropdown>
      </Badge>
    </p>
  );
}

export default PBHNotification;
