import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Input, Radio, Space, Descriptions } from "antd";

function Quiz(props) {
  const [value, setValue] = useState(1);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          <Radio value={1}>Option A</Radio>
          <Radio value={2}>Option B</Radio>
          <Radio value={3}>Option C</Radio>
          <Radio value={4}>Option D</Radio>
        </Space>
      </Radio.Group>
    </>
  );
}

Quiz.defaultProps = {
  columns: [],
};

export default Quiz;
