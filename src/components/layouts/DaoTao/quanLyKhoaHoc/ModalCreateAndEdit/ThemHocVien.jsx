import React, { useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Row, Col, Tabs, Button } from "antd";
import { useForm } from "react-hook-form";
import TreeView from "devextreme-react/tree-view";
import {
  _,
} from "../../../index";

function renderTreeViewItem(item) {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <p style={{ color: "black", paddingRight: "100px", display: "block" }}>
        Tên nhân viên:  <b>{item.staff_name}</b> -
      </p>
      <span >
        Mã nhân viên:  <b style={{ color: "green" }}>{item.code}</b>
      </span>
    </div>
  );
}

function ThemHocVien(props) {
  const { lstStudents, dataHV, setDataHV } = props
  const {
    formState: { errors },
  } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [valueSearch, setValueSearch] = useState();
  const [lstAll, setLstAll] = useState(lstStudents);
  const ref = useRef();
  //refresh ô search
  const handleChangeKeySearch = (e) => {
    setValueSearch(e.target.value)
    if (e.target.value === "") {
      setLstAll(lstStudents)
    }
  };

  const handleSearch = () => {
    const keySearch = ref.current.value;
    const arr = [];
    const filterData = () => {
      lstStudents &&
        lstStudents.filter((val) => {
          let position = _.toLower(val.staff_name).indexOf(
            _.toLower(keySearch)
          );
          if (position !== -1) {
            const newVal = {
              ...val,
            };
            arr.push(newVal);
          }
        });
      setLstAll(arr);
    };
    filterData();
  };

  const onSelectionMenu = ({ component }) => {
    let arrParent = [];
    let arrParentMenu = [];
    const treeView = component;
    const selectedItem = treeView.getSelectedNodes().map((node) => {
      let parent = _.isNull(node.itemData) ? {} : node.itemData;
      if (!_.isEmpty(parent)) {
        if (!_.some(arrParent, (item) => item.MENUID === parent.Id)) {
          arrParent.push(node);
        }
        if (parent.Id === node.itemData.Id) {
          arrParentMenu.push(parent);
        }
        return node;
      }
      return {};
    });
    let newIsLstPickMenu = [
      ..._.filter(selectedItem, (x) => !_.isEmpty(x)).map((item) => {
        return {
          student_id: item.key,
        };
      }),
    ];
    setDataHV(newIsLstPickMenu)
  };

  return (
    <div className="them-hoc-vien">
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            display: "flex",
            width: "100%",
          }}
        >
          <Col span={8}>
            <label style={{ marginBottom: "10px", fontSize: "17px" }}>Tìm kiếm học viên</label>
            <input
              name={"student_name"}
              ref={ref}
              onChange={handleChangeKeySearch}
              value={valueSearch}
            />
          </Col>
          <Col span={6}>
            <Button
              icon={<SearchOutlined />}
              loading={isLoading}
              type="primary"
              style={{
                marginTop: 22,
                marginLeft: 22,
                color: "white",
                fontSize: "12px",
              }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
        </div>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <text style={{ color: "blue" }}>* DANH SÁCH HỌC VIÊN</text>
          <TreeView
            id="treeview"
            width="64vw"
            height="60vh"
            items={lstAll}
            selectNodesRecursive={true}
            selectByClick={true}
            showCheckBoxesMode="selectAll"
            selectionMode={"multiple"}
            onSelectionChanged={onSelectionMenu}
            itemRender={renderTreeViewItem}
          />
        </Col>
      </Row>
    </div>
  );
}

ThemHocVien.propTypes = {};

export default ThemHocVien;
