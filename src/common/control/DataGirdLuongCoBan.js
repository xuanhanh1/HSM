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
import config from "devextreme/core/config";
import { FormatMoney } from "../../components/controller/Format";

config({
  defaultCurrency: "VND",
});

class DataGridLuongCoBan extends React.Component {
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
    // this.props.selectionChanged(data.selectedRowKeys);
    if(this.props.selectionMode === "multiple") {
      console.log("data ", data.selectedRowsData);
      this.props.selectionChanged(data.selectedRowsData)
    } else {
      this.props.selectionChanged(data.selectedRowKeys);
    }
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
      showPager = false,
      viewObj,
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
          noDataText={"Kh??ng c?? d??? li???u"}
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
            placeholder="T??m ki???m..."
          />
          <Export
            enabled={exportExcel}
            fileName={`File-${moment().format("L")}`}
            allowExportSelectedData={exportSampleFile}
            texts={{
              exportAll: "Xu???t excel",
              exportSelectedRows: "Xu???t file m???u",
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
              // infoText="C??: {2} d??ng"
            />
          ) : null}
          <Editing
            mode="cell"
            allowUpdating={true}
            onChangesChange={this.valueChange}
            allowDeleting={allowDeleting}
            useIcons={true}
            texts={{
              confirmDeleteMessage: "B???n c?? ch???c ch???n mu???n x??a ?",
            }}
          />
          <MasterDetail enabled={enableMD} component={componentMD} />

          <Column
            allowEditing={false}
            caption="M?? NV"
            dataField="staff_code"
            width="4vw"
          />
          <Column
            allowEditing={false}
            caption="H??? t??n"
            dataField="staff_name"
            width="8vw"
          />
          <Column
            allowEditing={false}
            caption="Khoa/ph??ng"
            dataField="department_name"
            width="5vw"
          />
          <Column
            allowEditing={false}
            caption="Ch???c v???"
            dataField="position_name"
            width="5vw"
          />
          <Column allowEditing={false} caption="L????ng c?? b???n">
            <Column
              allowEditing={false}
              dataField="salary_coef"
              caption="H??? s??? "
              width="3vw"
            />
            <Column
              allowEditing={false}
              dataField="salary_money"
              caption="Ti???n"
              format="currency"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.salary_money)}</span>;
              }}
            />
          </Column>
          <Column allowEditing={false} caption="Ph??? c???p th??m ni??n v?????t khung">
            <Column
              allowEditing={false}
              dataField="seniority_coef"
              caption="H??? s???"
              width="3vw"
            />
            <Column
              allowEditing={false}
              dataField="seniority_money"
              caption="Ti???n"
              format="currency"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.seniority_money)}</span>;
              }}
            />
          </Column>
          <Column allowEditing={false} caption="Ph??? c???p ch???c v???">
            <Column
              allowEditing={false}
              dataField="position_coef"
              caption="H??? s???"
              width="3vw"
            />
            <Column
              allowEditing={false}
              dataField="position_money"
              caption="Ti???n"
              format="currency"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.position_money)}</span>;
              }}
            />
          </Column>
          <Column allowEditing={false} caption="Ph??? c???p tr??ch nhi???m c??ng vi???c">
            <Column
              allowEditing={false}
              dataField="responsibility_coef"
              caption="H??? s???"
              width="3vw"
            />
            <Column
              allowEditing={false}
              dataField="responsibility_money"
              caption="Ti???n"
              format="currency"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.responsibility_money)}</span>;
              }}
            />
          </Column>
          <Column allowEditing={false} caption="Ph??? c???p ??u ????i">
            <Column
              allowEditing={false}
              dataField="favour_coef"
              caption="H??? s???"
              width="3vw"
            />
            <Column
              allowEditing={false}
              dataField="favour_money"
              caption="Ti???n"
              format="currency"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.favour_money)}</span>;
              }}
            />
          </Column>
          <Column allowEditing={false} caption="Ph??? c???p ?????c h???i">
            <Column
              allowEditing={false}
              dataField="toxic_coef"
              caption="H??? s???"
              width="3vw"
            />
            <Column
              allowEditing={false}
              dataField="toxic_money"
              caption="Ti???n"
              format="currency"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.toxic_money)}</span>;
              }}
            />
          </Column>
          <Column
            allowEditing={false}
            dataField="total_salary"
            caption="T???ng thu nh???p l????ng"
            format="currency"
            cellRender={(e) => {
              return <span>{FormatMoney(e.data.total_salary)}</span>;
            }}
          />
          <Column
            allowEditing={false}
            dataField="salary_deduction"
            caption="Ti???n ngh??? tr??? l????ng"
            format="currency"
            cellRender={(e) => {
              return <span>{FormatMoney(e.data.salary_deduction)}</span>;
            }}
          />
          <Column
            allowEditing={false}
            dataField="toxic_deduction"
            caption="Ti???n ngh??? tr??? ?????c h???i"
            format="currency"
            cellRender={(e) => {
              return <span>{FormatMoney(e.data.toxic_deduction)}</span>;
            }}
          />
          <Column
            allowEditing={false}
            dataField="favour_deduction"
            format="currency"
            caption="Ti???n ngh??? tr??? ??u ????i"
            cellRender={(e) => {
              return <span>{FormatMoney(e.data.favour_deduction)}</span>;
            }}
          />
          <Column
            allowEditing={false}
            dataField="real_salary"
            format="currency"
            caption="Ti???n l????ng"
            cellRender={(e) => {
              return <span>{FormatMoney(e.data.real_salary)}</span>;
            }}
          />
          <Column allowEditing={false} caption="Tr??? ph??">
            <Column
              allowEditing={false}
              dataField="social_insurance_fee"
              format="currency"
              caption="BHXH"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.social_insurance_fee)}</span>;
              }}
            />
            <Column
              allowEditing={false}
              dataField="health_insurance_fee"
              format="currency"
              caption="BHYT"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.health_insurance_fee)}</span>;
              }}
            />
            <Column
              allowEditing={false}
              dataField="unemployment_insurance_fee"
              format="currency"
              caption="BHTN"
              cellRender={(e) => {
                return (
                  <span>{FormatMoney(e.data.unemployment_insurance_fee)}</span>
                );
              }}
            />
            <Column
              allowEditing={false}
              dataField=" labor_union_fee"
              format="currency"
              caption="c??ng ??o??n"
              cellRender={(e) => {
                return <span>{FormatMoney(e.data.labor_union_fee)}</span>;
              }}
            />
          </Column>
          <Column
            allowEditing={false}
            dataField="fixed_salary_received"
            format="currency"
            caption="Th???c l??nh"
            cellRender={(e) => {
              return <span>{FormatMoney(e.data.fixed_salary_received)}</span>;
            }}
          />
          <Column
            type="buttons"
            visible={allowView || allowDeleting}
            caption={"Thao t??c"}
          >
            <Button name="delete" />
            <Button
              onClick={(e) => viewObj(e.row.data)}
              visible={allowView}
              //text="Chi ti???t"
              render={() => {
                return (
                  <Tooltip
                    title="Chi ti???t"
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

export default DataGridLuongCoBan;
