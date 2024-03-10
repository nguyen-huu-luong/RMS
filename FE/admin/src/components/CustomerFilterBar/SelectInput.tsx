"use client"
import React from 'react';
import { Button, Select } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';


// export interface ISelectInputProps {
// 	options: 
// }

export const SelectInput: React.FC = () => {
	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
	};

	return (<main>
		<div className='flex justify-start items-center my-1'>
			<span className='me-3'>Title</span>
			<Button icon={<CloseCircleFilled />} danger type='link' className='p-0 m-0 flex align-center h-auto' />
		</div>
		<Select
			defaultValue="lucy"
			style={{ width: 200 }}
			onChange={handleChange}
			options={[
				{
					label: 'Manager',
					options: [
						{ label: 'Jack', value: 'jack' },
						{ label: 'Lucy', value: 'lucy' },
					],
				},
				{
					label: 'Engineer',
					options: [{ label: 'yiminghe', value: 'Yiminghe' }],
				},
			]}
		/>
	</main>)

}


