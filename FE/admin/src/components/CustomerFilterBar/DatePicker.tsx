"use client"
import React from 'react';
import { Button, DatePicker, Space } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { CloseCircleFilled } from '@ant-design/icons';


const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
};

const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value);
};

export const MyDatePicker: React.FC = () => (
    <main>
        <div className='flex justify-start items-center my-1'>
			<span className='me-3'>Title</span>
			<Button icon={<CloseCircleFilled />} danger type='link' className='p-0 m-0 flex align-center h-auto' />
		</div>
        <Space direction="vertical" size={12}>
            <DatePicker  onChange={onChange} placeholder='Start date' onOk={onOk} />
            <DatePicker  onChange={onChange} placeholder='end date' onOk={onOk} />
        </Space>
    </main>

);
