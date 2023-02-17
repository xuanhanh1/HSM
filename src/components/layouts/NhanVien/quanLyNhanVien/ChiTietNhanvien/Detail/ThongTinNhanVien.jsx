import React, { useState, useEffect } from "react";
import { Descriptions, Tabs, Image, Space, Divider } from "antd";

import {
  FormatDateTime,
  FormatDate,
  FormatMoney,
} from "../../../../../controller/Format";
import {
  callApi,
  _,
  DataGridOdata,
  moment,
  Select,
  DataGrid,
} from "../../../../index";

function ThongTinNhanVienDetail(props) {
  const { objView } = props;
  const [userInform, setUserInform] = useState({});
  useEffect(() => {
    callApi(`odata/StaffInfors?$filter=staff_id eq ${objView.id}`, "GET").then(
      (res) => {
        console.log(res);
        setUserInform(...res.data.value);
      }
    );
  }, []);
  return (
    <>
      <Divider orientation="left" orientationMargin={10}>
        Thông tin cá nhân
      </Divider>

      <Descriptions
        bordered
        size="small"
        style={{ marginBottom: "10px", marginTop: "10px" }}
      >
        <Descriptions.Item label={"Mã nhân viên"} span={1.5}>
          <b>{objView?.code}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Số hiệu cán bộ"} span={1.5}>
          <b>{objView?.code}</b>
        </Descriptions.Item>

        <Descriptions.Item label={"Họ và tên"} span={1.5}>
          <b>{objView?.name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Họ và tên khác"} span={1.5}>
          <b>{userInform?.other_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày sinh"} span={1.5}>
          <b>
            {_.isNull(userInform?.date_of_birth)
              ? ""
              : FormatDate(moment(userInform?.date_of_birth))}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Giới tính"} span={1.5}>
          <b>{userInform?.sex_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Khoa/phòng"} span={1.5}>
          <b>{objView?.department_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Trạng thái"} span={1.5}>
          <b>{userInform?.staff_status_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Loại cán bộ"} span={1.5}>
          <b>{userInform?.staff_type_name}</b>
        </Descriptions.Item>

        <Descriptions.Item label={"Dân tộc"} span={1.5}>
          <b>{userInform?.ethnic_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Tôn giáo"} span={1.5}>
          <b>{userInform?.religion_name}</b>
        </Descriptions.Item>

        <Descriptions.Item label={"Số CMND/CCCD"} span={1.5}>
          <b>{userInform?.identify}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày cấp CMND/CCCD"} span={1.5}>
          <b>
            {_.isNull(userInform?.date_of_issue)
              ? ""
              : FormatDate(userInform?.date_of_issue)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Nơi cấp CMND/CCCD"} span={1.5}>
          <b>{userInform?.place_of_issue}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Email"} span={1.5}>
          <b>{userInform?.email}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Số điện thoại"} span={1.5}>
          <b>{userInform?.phone}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Trình độ phổ thông"} span={1.5}>
          <b>{userInform?.general_education_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Mã số thuế"} span={1.5}>
          <b>{userInform?.tax_code}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Nơi sinh"} span={1.5}>
          <b>
            {userInform?.place_of_birth_district_name},
            {userInform?.place_of_birth_province_name},
            {userInform?.place_of_birth_ward_name}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Quê quán"} span={1.5}>
          <b>
            {userInform?.place_of_origin_district_name},
            {userInform?.place_of_origin_province_name},
            {userInform?.place_of_origin_ward_name}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Hộ khẩu thường trú"} span={1.5}>
          <b>
            {userInform?.place_of_residence_district_name},
            {userInform?.place_of_residence_province_name},
            {userInform?.place_of_residence_ward_name}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Nơi ở hiện tại"} span={1.5}>
          <b>
            {userInform?.place_of_current_district_name},
            {userInform?.place_of_current_province_name},
            {userInform?.place_of_current_ward_name}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Địa chỉ"} span={1.5}>
          <b>{userInform?.address}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Hình thức tuyển dụng"} span={1.5}>
          <b>{userInform?.recruitment_form_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Cơ quan tuyển dụng"} span={1.5}>
          <b>{userInform?.recruitment_agency}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Nghề nghiệp"} span={1.5}>
          <b>{userInform?.job_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Công việc chính"} span={1.5}>
          <b>{userInform?.main_work}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Sở trường công tác"} span={1.5}>
          <b>{userInform?.forte_work}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày vào Đảng"} span={1.5}>
          <b>
            {_.isNull(userInform?.party_date)
              ? ""
              : FormatDate(userInform?.party_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày vào Đảng chính thức"} span={1.5}>
          <b>
            {_.isNull(userInform?.offical_party_date)
              ? ""
              : FormatDate(userInform?.offical_party_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Số thẻ Đảng"} span={1.5}>
          <b>{userInform?.party_number}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày nhập ngũ "} span={1.5}>
          <b>
            {_.isNull(userInform?.enlistment_date)
              ? ""
              : FormatDate(userInform?.enlistment_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày xuất ngũ"} span={1.5}>
          <b>
            {_.isNull(userInform?.demobilization_date)
              ? ""
              : FormatDate(userInform?.demobilization_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Quân hàm cao nhất"} span={1.5}>
          <b>{userInform?.highest_rank_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Hạng thương binh"} span={1.5}>
          <b>{userInform?.wounded_soldier_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Nhóm gia đình chính sách"} span={1.5}>
          <b>{userInform?.family_type_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Chiều cao"} span={1.5}>
          <b>{userInform?.height}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Cân nặng"} span={1.5}>
          <b>{userInform?.weight}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Nhóm máu"} span={1.5}>
          <b>{userInform?.blood_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Sức khỏe"} span={1.5}>
          <b>{userInform?.health_type_name}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Số bảo hiểm xã hội"} span={1.5}>
          <b>{userInform?.social_insurance_number}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Số thẻ bảo hiểm y tế"} span={1.5}>
          <b>{userInform?.health_insurance_number}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Nơi cấp BHXH"} span={1.5}>
          <b>{userInform?.social_insurance_place_issue}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày nghỉ hưu"} span={1.5}>
          <b>
            {_.isNull(userInform?.retire_date)
              ? ""
              : FormatDate(userInform?.retire_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày nghỉ việc"} span={1.5}>
          <b>
            {_.isNull(userInform?.quit_date)
              ? ""
              : FormatDate(userInform?.quit_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày chuyển công tác"} span={1.5}>
          <b>
            {_.isNull(userInform?.transfer_date)
              ? ""
              : FormatDate(userInform?.transfer_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày từ trần"} span={1.5}>
          <b>
            {_.isNull(userInform?.death_date)
              ? ""
              : FormatDate(userInform?.death_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Ngày hết hạn hợp đồng"} span={1.5}>
          <b>
            {_.isNull(userInform?.contract_expiry_date)
              ? ""
              : FormatDate(userInform?.contract_expiry_date)}
          </b>
        </Descriptions.Item>
        <Descriptions.Item label={"Lịch sử bản thân"} span={3}>
          <b>{userInform?.self_history}</b>
        </Descriptions.Item>
        <Descriptions.Item label={"Nhận xét, đánh giá của đơn vị"} span={3}>
          <b>{userInform?.comment}</b>
        </Descriptions.Item>
        {/* ----------------------------------------------------------------------------------------------- */}
      </Descriptions>
    </>
  );
}

export default ThongTinNhanVienDetail;
