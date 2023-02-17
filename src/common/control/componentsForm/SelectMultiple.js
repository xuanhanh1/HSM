import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "@hookform/error-message";
import _ from "lodash";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import callApi from "../../../config/configApi";
/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - register react-form-hooks
 * @param {bool} required - (*) red in label
 * @param {array} arrayItem - array render select option
 * @param {string} valueOpt - string value option when selected
 * @param {string} nameOpt - string name show option
 * @param {bool} optNull - option empty when start
 */
const { Option } = Select;
function SelectFieldMultiple(props) {
  const { label, name, required = false, options, control, errors } = props;
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <label className={required ? "label-require" : ""}>{t(label)}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => {
          return (
            <Select
              rules={{ required: required }}
              style={{ width: 500 }}
              defaultValue={[]}
              onChange={onChange}
              mode="multiple"
              value={[...value]}
              tokenSeparators={[" ", ","]}
            >
              {options &&
                options.map((item, idx) => {
                  return (
                    <Option key={idx} value={item.id}>
                      <span style={{ color: "#1890ff", fontWeight: "500" }}>
                        {item.name}
                      </span>
                    </Option>
                  );
                })}
            </Select>
          );
        }}
      />
      {required ? (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p style={{ color: "red", fontSize: 10 }}>
              Vui lòng chọn thông tin {t(label)}
            </p>
          )}
        />
      ) : (
        <></>
      )}
    </React.Fragment>
  );
}

SelectFieldMultiple.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  isValid: PropTypes.bool,
  errorMessage: PropTypes.string,
  arrayItem: PropTypes.array,
  valueOpt: PropTypes.string,
  nameOpt: PropTypes.string,
  optNull: PropTypes.bool,
};

export default React.memo(SelectFieldMultiple);
