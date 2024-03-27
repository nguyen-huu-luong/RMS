import React from "react";
import { Input, InputProps } from "antd";
import styled from 'styled-components';

const StyledInput = styled(Input)`
  background-color: #F6FAFD;
  border-color: #ccc;
`;

const RMSInput: React.FC<InputProps> = (props) => {
    return <StyledInput {...props} />;
}

export default RMSInput;