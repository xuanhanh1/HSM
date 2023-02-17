import React from "react";
import { Avatar, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import DataGrid, {
  Column,
  Editing,
  Selection,
  Scrolling,
  Lookup,
  RowDragging,
  KeyboardNavigation,
  MasterDetail,
  Export,
  FilterRow,
  SearchPanel,
  Paging,
  Button,
  TotalItem,
  Summary,
  ColumnChooser,
  Pager,
} from "devextreme-react/data-grid";
import _ from "lodash";
import { Template } from "devextreme-react/core/template";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "./index.css";

// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";

class DataGridCustom extends React.Component {
  constructor(props) {
    super(props);
    this.dataGridRef = React.createRef();
    this.selectorRef = React.createRef(null);
    // this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
    this.dataGrid = null;
  }
  state = {
    selectedItemKeys: [],
  };
  selectionChanged = (data) => {
    this.props.selectionChanged(data.selectedRowKeys);
  };
  valueChange = (data) => {
    if (data.length > 0 && !_.isEmpty(data[0].data)) {
      setTimeout(() => {
        this.props.handleRowChange(data);
      }, 100);
    }
    if (data.length > 0 && data[0].type == "remove") {
      setTimeout(() => {
        this.props.handleRowChange(data);
      }, 100);
    }
  };

  componentDidUpdate = (prevProps) => {
    if (!_.isEqual(this.props.data, prevProps.data)) {
      // this.dataGridRef.current.instance.clearSelection();
      return true;
    }
  };

  clearSelection = () => {
    this.dataGridRef.current.instance.clearSelection();
  };

  printDataGrid() {
    this.props.onPrintChange(true);
  }
  handleRowClick = (e) => {
    if (this.selectorRef.current === e.dataIndex) {
      this.clearSelection();
      this.selectorRef.current = null;
    } else {
      this.selectorRef.current = e.dataIndex;
    }
  };
  render() {
    const {
      column,
      data,
      dataKey,
      disabled,
      enableMD,
      componentMD,
      exportExcel = true,
      showColumnLines = true,
      allowDeleting = false,
      // focusNewRow,
      showColumnHeaders = true,
      showFilterRow = false,
      allowView = false,
      viewObj,
      showPager = false,
      selectionMode = "single",
      exportSampleFile = false,
      infoText = "",
    } = this.props;
    return (
      <div id="data-grid-demo">
        <DataGrid
          id="gridContainer"
          dataSource={data}
          keyExpr={dataKey}
          selection={{ mode: selectionMode }}
          hoverStateEnabled={true}
          // showRowLines={true}
          showBorders={true}
          onSelectionChanged={this.selectionChanged}
          onRowClick={this.handleRowClick}
          disabled={disabled}
          columnAutoWidth={false}
          allowColumnReordering={true}
          allowColumnResizing={true}
          showColumnLines={showColumnLines}
          // selectedRowKeys={""}
          // onToolbarPreparing={
          //   !_.isUndefined(this.props.onPrintChange)
          //     ? this.onToolbarPreparing
          //     : () => {}
          showColumnHeaders={showColumnHeaders}
          noDataText={"Không có dữ liệu"}
          ref={this.dataGridRef}
        >
          {/* <Scrolling columnRenderingMode="virtual" /> */}
          <KeyboardNavigation
            editOnKeyPress={true}
            enterKeyAction={"moveFocus"}
            enterKeyDirection={"row"}
          />
          <FilterRow
            visible={showFilterRow}
            applyFilter={{
              key: "auto",
              name: "Immediately",
            }}
          />
          <SearchPanel
            visible={exportExcel}
            width={240}
            placeholder="Tìm kiếm..."
          />
          <Export
            enabled={exportExcel}
            fileName={`File-${moment().format("L")}`}
            allowExportSelectedData={exportSampleFile}
            texts={{
              exportAll: "Xuất excel",
              exportSelectedRows: "Xuất file mẫu",
            }}
          />
          <Paging enabled={true} pageSize={20} />
          {/* <Scrolling mode="virtual" /> */}
          {showPager ? (
            <Pager
              visible={true}
              allowedPageSizes={true}
              displayMode={"full"}
              showInfo={true}
              infoText={infoText}
              // infoText="Có: {2} dòng"
            />
          ) : null}
          <Editing
            mode="cell"
            allowUpdating={true}
            onChangesChange={this.valueChange}
            allowDeleting={allowDeleting}
            useIcons={true}
            texts={{
              confirmDeleteMessage: "Bạn có chắc chắn muốn xóa ?",
            }}
          />
          <MasterDetail enabled={enableMD} component={componentMD} />

          <Column
            allowEditing={false}
            caption="Mã nhân viên"
            dataField="staff_code"
            width="5vw"
          />
          <Column
            allowEditing={false}
            caption="Họ tên"
            dataField="staff_name"
            width="10vw"
          />
          <Column
            allowEditing={false}
            caption="Ngày thường"
            dataField="count_day"
          />
          <Column allowEditing={false} caption="Ngày nghỉ">
            <Column
              allowEditing={false}
              dataField="exceed_maternity_day_off"
              caption="Bù"
            />
            <Column
              allowEditing={false}
              dataField="compensatory_leave"
              caption="Hưởng BHXH"
            />
            <Column
              allowEditing={false}
              dataField="unpaid_day_off"
              caption="Không lương"
            />
            <Column
              allowEditing={false}
              dataField="insurance_day_off"
              caption="Thai sản VQK"
            />
            <Column
              allowEditing={false}
              dataField="sick_day_off"
              caption="Ốm"
            />
            <Column
              allowEditing={false}
              dataField="study_day_off"
              caption="Đi học"
            />
          </Column>
          <Column allowEditing={false} caption="Trực 8/24">
            <Column
              allowEditing={false}
              dataField="weekday_8h_duty"
              caption="Thường"
              format="fixedPoint"
            />
            <Column
              allowEditing={false}
              dataField="weekend_8h_duty"
              caption="T7,CN"
            />
            <Column
              allowEditing={false}
              dataField="holiday_8h_duty"
              caption="Lễ,tết"
            />
            <Column
              allowEditing={false}
              dataField="night_8h_duty"
              caption="Đêm"
            />
          </Column>
          <Column allowEditing={false} caption="Trực 12/24">
            <Column
              allowEditing={false}
              dataField="weekday_12h_duty"
              caption="Thường"
              format="fixedPoint"
            />
            <Column
              allowEditing={false}
              dataField="weekend_12h_duty"
              caption="T7,CN"
            />
            <Column
              allowEditing={false}
              dataField="holiday_12h_duty"
              caption="Lễ,tết"
            />
            <Column
              allowEditing={false}
              dataField="night_12h_duty"
              caption="Đêm"
            />
          </Column>
          <Column allowEditing={false} caption="Trực 16/24">
            <Column
              allowEditing={false}
              dataField="weekday_16h_duty"
              caption="Thường"
              format="fixedPoint"
            />
            <Column
              allowEditing={false}
              dataField="weekend_16h_duty"
              caption="T7,CN"
            />
            <Column
              allowEditing={false}
              dataField="holiday_16h_duty"
              caption="Lễ,tết"
            />
            <Column
              allowEditing={false}
              dataField="night_16h_duty"
              caption="Đêm"
            />
          </Column>
          <Column allowEditing={false} caption="Trực 24/24">
            <Column
              allowEditing={false}
              dataField="weekday_24h_duty"
              caption="Thường"
              format="fixedPoint"
            />
            <Column
              allowEditing={false}
              dataField="weekend_24h_duty"
              caption="T7,CN"
            />
            <Column
              allowEditing={false}
              dataField="holiday_24h_duty"
              caption="Lễ,tết"
            />
            <Column
              allowEditing={false}
              dataField="night_24h_duty"
              caption="Đêm"
            />
          </Column>
          <Column
            type="buttons"
            visible={allowView || allowDeleting}
            caption={"Thao tác"}
          >
            <Button name="delete" />
            <Button
              onClick={(e) => viewObj(e.row.data)}
              visible={allowView}
              //text="Chi tiết"
              render={() => {
                return (
                  <Tooltip
                    title="Chi tiết"
                    placement="left"
                    color={"#282c3480"}
                    className="icon-viewDetail"
                  >
                    <EyeOutlined
                      style={{
                        fontSize: "14px",
                        cursor: "pointer",
                        padding: "2px 10px",
                      }}
                    />
                  </Tooltip>
                );
              }}
            />
          </Column>
        </DataGrid>
      </div>
    );
  }
}

export default DataGridCustom;
