import { PageHeader } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestions, deleteQuestion } from "../../../../redux/actions/TaiLieu";
import { DataGrid, ToolBar, _ } from "../../index";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
import openNotificationWithIcon from "../../../../common/notification/notification"

function NganHangCauHoi(props) {
  const { columns } = props;
  const { t } = useTranslation();
  const [isObjEdit, setObjEdit] = useState({});
  const dispatch = useDispatch();
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
    delete: false
  });
  const lstQuestions = useSelector(
    (state) => state.TaiLieuReducer.lstQuestions
  );

  useEffect(() => {
    dispatch(getAllQuestions());
  }, [isStatusModal.isVisible]);

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };
  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  const selectedRow = ([params]) => {
    const obj = _.find(lstQuestions, (x) => x.id === params);
    console.log("object ", obj);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    let result = dispatch(deleteQuestion(params.id));
    if (result) {
      openNotificationWithIcon("success", "Xóa câu hỏi thành công");
    } else {
      openNotificationWithIcon("error", "Xóa câu hỏi không thành công");
    }
  };

  return (
    <div className="ngan-hang-cau-hoi">
      <PageHeader className="site-page-header" title={t("NganHangCH")} />
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />
      <div className="gridView" style={{ height: "calc(100vh - 175px)" }}>
        <DataGrid
          column={columns}
          data={lstQuestions}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          setOpenDrawer={setOpenDrawer}
        />
      ) : null}

    </div>
  );
}

NganHangCauHoi.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
NganHangCauHoi.defaultProps = {
  columns: [
    {
      caption: "Câu hỏi",
      dataField: "name",
      type: 0,
      width: "",
    },
    {
      caption: "Đáp án ",
      dataField: "answerA",
      type: 0,
    },
    {
      caption: "Đáp án ",
      dataField: "answerB",
      type: 0,
    },
    {
      caption: "Đáp án ",
      dataField: "answerC",
      type: 0,
    },
    {
      caption: "Đáp án đúng",
      dataField: "correct_answer",
      type: 0,
    },
    {
      caption: "Ngày tạo",
      dataField: "create_date",
      type: 0,
      width: "",
      format: "date",
    },
    {
      caption: "Người tạo",
      dataField: "personCreate",
      type: 0,
      width: "",
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
      width: "",
    },
  ],
};
export default NganHangCauHoi;
