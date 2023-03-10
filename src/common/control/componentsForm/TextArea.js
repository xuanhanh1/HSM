import React from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - register react-form-hooks
 * @param {string} defaultValue - default value for the input
 * @param {bool} required - (*) red in label
 */
function TextAreaField(props) {
  const {
    label,
    type,
    name,
    errorMessage,
    isValid,
    defaultValue,
    require,
    required,
    disabled,
  } = props;
  const { t } = useTranslation();
  return (
    <>
      <label className={require ? "label-require" : ""}>{t(label)}</label>
      <textarea
        {...name}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
      />
    </>
  );
}

TextAreaField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  require: PropTypes.bool,
  defaultValue: PropTypes.string,
};
TextAreaField.defaultProps = {
  label: "",
  type: "text",
  name: "",
  required: false,
  defaultValue: "",
};
export default TextAreaField;
