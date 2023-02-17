import "antd/dist/antd.css";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Login from "../src/components/layouts/Login/login";
import Main from "../src/components/layouts/Main/main";
import "./App.css";
import T from "./common/language/i18n/i18n";
import ResetPassword from "./components/layouts/Login/ResetPassword/resetPassword";
import "./HSM.css";
import { setStatusLoginWithToken } from "./redux/actions/Users";
function App() {
  const [isLogin, setLogin] = useState(false);
  const language = useSelector((state) => state.UsersReducers.language);
  const loginSuccess = useSelector((state) => state.UsersReducers.loginSuccess);
  const dispatch = useDispatch();
  const token = JSON.parse(window.localStorage.getItem("token"));
  useEffect(() => {
    const token = JSON.parse(window.localStorage.getItem("token"));
    const isNV = JSON.parse(window.localStorage.getItem("infoNV"));

    if (!_.isNull(token)) {
      dispatch(setStatusLoginWithToken(true, token, isNV));
    }
  }, []);
  let match = useRouteMatch();
  useEffect(() => {
    T(language);
  }, [language]);

  return (
    <div className="App">
      {window.location.pathname === "/Account/ResetPassword" ? (
        <Switch>
          <Route>
            <ResetPassword></ResetPassword>
          </Route>
        </Switch>
      ) : _.isEmpty(token) ? (
        <Login />
      ) : (
        <Main />
      )}
    </div>
  );
}

export default App;
