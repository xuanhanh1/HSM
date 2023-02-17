import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import callApi from "../../../../../../../config/configApi";
import Input from "../../../../../../../common/control/componentsForm/Input";
import { useForm } from "react-hook-form";
import Select from "../../../../../../../common/control/componentsForm/Select";
import { _, DataGrid } from "../../../../../index";

const { TabPane } = Tabs;

const arrOption = [];
const selectRating = () => {
  callApi("odata/AvailableCatalogs/Ratings").then((res) => {
    arrOption.push(...res.data);
    return res;
  });
};
selectRating();

const TrucTiep = (props) => {
  const { columns, month } = props;
  const { t } = useTranslation();

  const [lstTrucTiep, setTrucTiep] = useState([]);
  const [lstNv, setLstNv] = useState([]);
  const [isObjEdit, setObjEdit] = useState({});
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (month !== undefined) {
      const monthFilter =
        month.month() + 1 < 10 ? "0" + (month.month() + 1) : month.month() + 1;
      const yearFilter = month.year();
      callApi(
        `odata/AddExtraSalarys?$Expand=list_extrasalary_staffs&$Filter=formula_name ne 'Gián tiếp' and month eq '${monthFilter}' and year eq '${yearFilter}'`
      ).then((res) => {
        console.log(res);
        setTrucTiep(res.data.value);
      });
    }
  }, [month]);
  const callDataForDataGrid = async (id) => {
    const data = await id;
    console.log(id);
    return [];
  };
  const handleRowChange = (e, val) => {
    let diem = arrOption.filter((item) => item.id === e[0].data.rating_id);
    const newArr = val.list_extrasalary_staffs.map((item) => {
      if (item.id === e[0].key) {
        return {
          ...item,
          rating_id: diem[0].id,
          rating_mark: diem[0].coef,
          mark: item.position_mark + item.degree_mark + diem[0].coef,
        };
      } else {
        return item;
      }
    });
    // console.log(newArr);
    // console.log(val);
    const newLstTrucTiep = lstTrucTiep.map((item) => {
      if (item.id === val.id) {
        return {
          ...item,
          list_extrasalary_staffs: newArr,
        };
      }
      return item;
    });
    // console.log(newLstTrucTiep);
    setTrucTiep(newLstTrucTiep);
  };
  const selectedRow = ([params], val) => {
    console.log("select");
    // const obj = _.find(val.list_extrasalary_staffs, (x) => x.id === params);
    // setObjEdit(obj);
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" tabPosition={"left"}>
        {lstTrucTiep.map((val, idx) => {
          return (
            <TabPane tab={t(`${val.department_name}`)} key={idx}>
              <Row gutter={[8, 0]}>
                <Col span={15}>
                  <Input
                    label="Công thức"
                    defaultValue={val.extra_salary_type_name}
                    disabled
                  />
                </Col>
                {/* <Col span={3}>
                  <Input
                    label="Tổng điểm thi đua"
                    defaultValue={val.sum_mark}
                    disabled
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  />
                </Col> */}
                <Col span={3}>
                  <Input
                    label="Tổng tiền"
                    defaultValue={val.sum_extra_salary}
                    disabled
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  />
                </Col>
                <Col span={3}>
                  <Input
                    label="Số nhân viên"
                    defaultValue={val.sum_staff}
                    disabled
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  />
                </Col>
              </Row>
              <div
                className="gridView"
                style={{ height: "calc(100vh - 175px)" }}
              >
                <DataGrid
                  column={columns}
                  data={val.list_extrasalary_staffs}
                  // data={callDataForDataGrid(val.department_id)}
                  // allowView={true}
                  dataKey={"id"}
                  // selectionChanged={false}
                  // handleRowChange={(e) => handleRowChange(e, val)}
                  selectionChanged={selectedRow}
                  // showFilterRow={true}

                  // viewObj={handleOpenDrawer1}
                />
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

TrucTiep.propTypes = {
  columns: PropTypes.array,
};
TrucTiep.defaultProps = {
  columns: [
    {
      caption: "Mã NV",
      dataField: "staff_code",
      type: 0,
    },
    {
      caption: "Tên NV",
      dataField: "staff_name",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "position_name",
      type: 0,
    },
    {
      caption: "Tỉ lệ",
      dataField: "rate",
      type: 0,
    },
    {
      caption: "Tiền được nhận",
      dataField: "total_salary",
      type: 0,
    },
  ],
};

export default TrucTiep;
