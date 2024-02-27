import React from "react";
import { DatePicker, DatePickerProps } from "antd";
import styled from 'styled-components';
import Dayjs from "dayjs"

const StyledDatePicker = styled(DatePicker)`

`;

const RMSDatePicker: React.FC<DatePickerProps> = (props) => {
    return (
      <DatePicker {...props} />
    );
}

export default RMSDatePicker;