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

const GianTiep = (props) => {
  const { columns, month } = props;
  const { t } = useTranslation();
  const [lstAllKhoaPhong, setLstAllKhoaPhong] = useState([]);
  const [lstGianTiep, setGianTiep] = useState([]);
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
    callApi("odata/Departments").then((res) => {
      setLstAllKhoaPhong(res.data.value);
    });
  }, []);
  useEffect(() => {
    if (month !== undefined) {
      const monthFilter =
        month.month() + 1 < 10 ? "0" + (month.month() + 1) : month.month() + 1;
      const yearFilter = month.year();
      callApi(
        `odata/AddExtraSalarys?$Expand=list_extrasalary_staffs&$Filter=formula_name eq 'Gián tiếp' and month eq '${monthFilter}' and year eq '${yearFilter}'`
      ).then((res) => {
        console.log(res);

        setGianTiep(res.data.value);
        sendData(res.data.value);
      });
    }
  }, [month]);
  const sendData = (data) => {
    props.sendDataGT(data);
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
    const newLstGianTiep = lstGianTiep.map((item) => {
      if (item.id === val.id) {
        return {
          ...item,
          list_extrasalary_staffs: newArr,
        };
      }
      return item;
    });
    // console.log(newLstGianTiep);
    setGianTiep(newLstGianTiep);
    sendData(newLstGianTiep);
  };
  const selectedRow = ([params], val) => {
    const obj = _.find(val.list_extrasalary_staffs, (x) => x.id === params);
    setObjEdit(obj);
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" tabPosition={"left"}>
        {/* {lstAllKhoaPhong &&
          lstAllKhoaPhong.map((item, idx) => {
            let ct = "";
            let diem_td = 0;
            let tong_tien = 0;
            let snv = 0;
            const arr = lstGianTiep.filter((val) => {
              ct = val.formula_name;
              diem_td = val.sum_mark;
              tong_tien = val.sum_extra_salary;
              snv = val.sum_staff;
              return item.id === val.department_id;
            });
            return (
              <TabPane tab={t(`${item.name}`)} key={idx}>
                <Row gutter={[8, 0]}>
                  <Col span={12}>
                    <Input label="Công thức" defaultValue={ct} disabled />
                  </Col>
                  <Col span={4}>
                    <Input
                      label="Tổng điểm thi đua"
                      defaultValue={diem_td}
                      disabled
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      label="Tổng tiền"
                      defaultValue={tong_tien}
                      disabled
                    />
                  </Col>
                  <Col span={4}>
                    <Input label="Số nhân viên" defaultValue={snv} disabled />
                  </Col>
                </Row>
                <div
                  className="gridView"
                  style={{ height: "calc(100vh - 175px)" }}
                >
                  <DataGrid
                    column={columns}
                    data={arr[0]?.list_extrasalary_staffs}
                    // allowView={true}
                    dataKey={"id"}
                    handleRowChange={(e) => handleRowChange(e, arr)}
                    selectionChanged={(e) => selectedRow(e, arr)}
                    // showFilterRow={true}

                    // viewObj={handleOpenDrawer1}
                  />
                </div>
              </TabPane>
            );
          })} */}
        {lstGianTiep.map((val, idx) => {
          // console.log(val);
          return (
            <TabPane tab={t(`${val.department_name}`)} key={idx}>
              <Row gutter={[8, 0]}>
                <Col span={12}>
                  <Input
                    label="Công thức"
                    defaultValue={val.extra_salary_type_name}
                    disabled
                  />
                </Col>
                <Col span={4}>
                  <Input
                    label="Tổng điểm thi đua"
                    defaultValue={val.sum_mark}
                    disabled
                  />
                </Col>
                <Col span={4}>
                  <Input
                    label="Tổng tiền"
                    defaultValue={val.sum_extra_salary}
                    disabled
                  />
                </Col>
                <Col span={4}>
                  <Input
                    label="Số nhân viên"
                    defaultValue={val.sum_staff}
                    disabled
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
                  // allowView={true}
                  dataKey={"id"}
                  handleRowChange={(e) => handleRowChange(e, val)}
                  selectionChanged={(e) => selectedRow(e, val)}
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

GianTiep.propTypes = {
  columns: PropTypes.array,
};
GianTiep.defaultProps = {
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
      caption: "Điểm chức vụ",
      dataField: "position_mark",
      type: 0,
    },
    {
      caption: "Điểm trình độ",
      dataField: "degree_mark",
      type: 0,
    },

    {
      caption: "Xếp loại",
      dataField: "rating_id",
      type: 2,
      dataSource: {
        data: arrOption,
        valueExpr: "id",
        displayExpr: "name",
      },
    },
    {
      caption: "Điểm xếp loại",
      dataField: "rating_mark",
      type: 0,
    },
    {
      caption: "Tổng điểm",
      dataField: "mark",
      type: 0,
      customCellRender: (item) => {
        const total =
          item.data.position_mark +
          item.data.degree_mark +
          item.data.rating_mark;
        return (
          <span
            style={{
              color: `${total >= 0 ? "#19b159" : "rgba(219,4,15,.5)"} `,
              fontWeight: "bold",
              textAlign: "right",
              display: "block",
            }}
          >
            {total}
          </span>
        );
      },
    },
    {
      caption: "Số ngày làm việc",
      dataField: "count_day",
      type: 0,
    },
  ],
};

export default GianTiep;
