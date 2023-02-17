import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useLoading } from "../index";
import logo from "../../../../src/common/assets/images/favicon.ico.jpg";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import DrawerUser from "./DrawerUser/drawerUser";
import { Route, Link, Switch, useHistory, useLocation } from "react-router-dom";

import routes from "../../../common/routes/index";
import "./index.css";
import _ from "lodash";
import ErrorPage from "../../../common/errorPage/errorPage";
import { getMenusByUser } from "../../../redux/actions/Menu";
import Dashboard from "../DanhMuc/DashBoard/dashboard";
const { Header, Content } = Layout;
const DropdownWrapper = (child) => {
  if (child == 0) {
    return <div></div>;
  }
  return (
    <div className="DropDownWrapper">
      <ul>
        {_.map(child, (item, index) => {
          return (
            <Link to={item.ROUTE} key={index}>
              <li>
                <a
                  style={{
                    color:
                      window.location.pathname === item.ROUTE ? "#EE202A" : "",
                  }}
                >
                  <i className={`fa ${item.ICON}`} /> {item.TEN_MENU}
                </a>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

function Main(props) {
  let location = useLocation();
  const [isClicked, setClicked] = useState(false);
  const [vibDrawerUser, setVibDrawerUser] = useState(false);
  const lstMenu = useSelector((state) =>
    _.sortBy(state.MenuReducers.lstMenu, "THUTU")
  );

  const lstChildMenu = useSelector((state) => state.MenuReducers.lstChildMenu);
  const [isRoutes, setRoutes] = useState([]);
  const [isHeaderLoading, setHeaderLoading] = useLoading(lstMenu);
  const dispatch = useDispatch();
  const history = useHistory();
  const nhanVienInfor = JSON.parse(window.localStorage.getItem("infoNV"));
  useEffect(() => {
    if (nhanVienInfor.TEN_BV !== null) {
      document.title =
        "HSM - Quản lý nhân sự và thanh toán cá nhân - Tekmedi | " +
        nhanVienInfor.TEN_BV;
      document.title = "HSM - Quản lý nhân sự và thanh toán cá nhân - Tekmedi";
    }
    dispatch(getMenusByUser());

    getInforIpClient();
  }, []);
  const RedireactDashboard = () => {
    history.push("/");
  };

  const getInforIpClient = () => {
    fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => {
        window.localStorage.setItem("infoIP", JSON.stringify(data));
      });
  };
  useEffect(() => {
    if (!_.isEmpty(lstChildMenu)) {
      let arr = _.filter(routes, (x) =>
        _.some(lstChildMenu, (y) => y?.ROUTE === x.path)
      );
      arr.push(
        ...[
          {
            path: "/error-page",
            exact: false,
            main: ({ history }) => (
              <>
                <ErrorPage history={history} />
              </>
            ),
          },
          {
            path: "/",
            exact: false,
            main: ({ history }) => (
              <>
                <Dashboard history={history} />
              </>
            ),
          },
        ]
      );
      setRoutes(arr);
      if (!_.some(arr, (x) => x.path === window.location.pathname)) {
        history.push("/error-page");
      }
    }
  }, [lstChildMenu]);

  return (
    <div>
      <Layout className="layout">
        <Header>
          <div className="_Header">
            <nav>
              <div className="d-flex align-items-center">
                <div className="__NavBarLogo">
                  <a onClick={() => RedireactDashboard()}>
                    <h1 className="___textLogo">
                      <div className="d-flex-center">
                        <img src={logo} /> <span>Tek.HSM</span>
                      </div>
                    </h1>
                  </a>
                </div>
                <div className={isHeaderLoading ? "spin-center" : null}>
                  <Spin spinning={isHeaderLoading}>
                    <ul
                      className={isClicked ? "nav-links active" : "nav-links"}
                    >
                      {_.map(lstMenu, (item, index) => {
                        return (
                          <Dropdown overlay={DropdownWrapper(item.CHILDREN)}>
                            <li>
                              {item.CHILDREN.length > 0 ? (
                                <span
                                  className={
                                    "/" +
                                      window.location.pathname.split("/")[1] ===
                                    item.ROUTE
                                      ? "active"
                                      : null
                                  }
                                >
                                  <span className="material-icons md-16">
                                    {item.ICON}&nbsp;
                                  </span>
                                  {item.TEN_MENU}&nbsp;
                                  {item.CHILDREN.length > 0 ? (
                                    <DownOutlined style={{ fontSize: 10 }} />
                                  ) : null}
                                </span>
                              ) : (
                                <Link to={item.ROUTE}>
                                  <span className="material-icons md-16">
                                    {item.ICON}&nbsp;
                                  </span>
                                  {item.TEN_MENU}{" "}
                                </Link>
                              )}
                            </li>
                          </Dropdown>
                        );
                      })}
                    </ul>
                  </Spin>
                </div>
              </div>
              <div className="_infoBar">
                {/* <PBHNotification /> */}
                <p
                  onClick={() => setVibDrawerUser(true)}
                  className="div-username"
                >
                  <UserOutlined style={{ fontSize: "20px" }} />
                  <span>&nbsp; {nhanVienInfor.name}</span>
                </p>
              </div>
            </nav>
          </div>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Switch location={location}>
            {isRoutes.length > 0 &&
              isRoutes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                  />
                );
              })}
          </Switch>
        </Content>
      </Layout>
      <DrawerUser isVisible={vibDrawerUser} onClose={setVibDrawerUser} />
    </div>
  );
}
export default Main;
