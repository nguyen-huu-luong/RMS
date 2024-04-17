"use client";
import React, { useState } from "react";
import { type TableProps, type GetProp, Form, Upload, Button, Select } from "antd";
import { CustomerActionBar } from "@/components";
import TableRender, { FilterItemType } from "@/components/TableComponents";
import { UploadOutlined } from "@ant-design/icons";
import RMSInput from "@/components/inputs/RMSInput";
import RMSDatePicker from "@/components/inputs/RMSDatePicker";

type ColumnsType<T> = TableProps<T>["columns"];
interface DataType {
	key: React.Key;
	id: number;
	phone: string;
	fullname: string;
	email: string;
	createdAt: string;
	birthday: string;
	source: string;
	group: string[];
	score: number;
	age: number;
	address: string;
	// updatedAt: Date ;
}


const CustomerListPages: React.FC = () => {
	const [selectedRows, setSelectedRows] = useState<DataType[]>([])
	const columns: ColumnsType<DataType> = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Fullname",
			dataIndex: "fullname",
			key: "fullname",
			render: (text, row) => <a style={{ color: "#4A58EC" }} href={`./customers/${row.id}`}>{text}</a>,
			// ...getColumnSearchProps("fullname"),
		},
		{
			title: "Phone number",
			dataIndex: "phone",
			key: "phone",
			// sorter: (a, b) => a.age - b.age,
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Source",
			dataIndex: "source",
			key: "source",
		},
		{
			title: "Birthday",
			dataIndex: "birthday",
			key: "birthday",
		},
		{
			title: "Score",
			dataIndex: "score",
			key: "score",
		},
		{
			title: "Group",
			dataIndex: "group",
			key: "group",
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
		},
		{
			title: "CreatedAt",
			dataIndex: "createdAt",
			key: "createdAt",
		},
	];

	const filterItems: FilterItemType[] = [
		{
			key: "1",
			title: "Firstname",
			fieldName: "firstname",
			type: "input"
		},
		{
			key: "8",
			title: "Lastname",
			fieldName: "lastname",
			type: "input"
		},
		{
			key: "2",
			title: "Phone number",
			fieldName: "phone",
			type: "input"
		},
		{
			key: "3",
			title: "Email",
			fieldName: "email",
			type: "input"
		},
		{
			key: "4",
			title: "Birthday",
			fieldName: "birthday",
			type: "date"
		},
		{
			key: "5",
			title: "Group",
			fieldName: "group",
			type: "select",
			options: [
				{
					label: "Group 1",
					value: 1
				},
				{
					label: "Group 2",
					value: 2
				},
				{
					label: "Group ",
					value: 3
				},
			]
		},
		{
			key: "6",
			title: "CreatedAt",
			fieldName: "createdAt",
			type: "date"
		},
	];


	const onSelectedRows = {
		handle: (selecteds: DataType[]) => setSelectedRows(selecteds),
		render: () => <CustomerActionBar dataSelected={selectedRows} />
	}
	const normFile = (e: any) => {
		console.log('Upload event:', e);
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};
	return (
		<TableRender<DataType>
			columns={columns}
			url="/customers"
			onSelected={onSelectedRows}
			formCreateElement={
				<>
					<Form.Item
						name="upload-avatar"
						label="Avatar"
						valuePropName="fileList"
						getValueFromEvent={normFile}
					>
						<Upload name="avatar" action="/upload.do" listType="picture">
							<Button icon={<UploadOutlined />} />
						</Upload>
					</Form.Item>

					<div className="flex space-x-2">
						<div className='w-full'>
							<Form.Item label="Firstname" name="firstname" required>
								<RMSInput placeholder='Firstname' />
							</Form.Item>
						</div>
						<div className='w-full'>
							<Form.Item label="Lastname" name="lastname" required>
								<RMSInput placeholder='Lastname' />
							</Form.Item>
						</div>
					</div>

					<div className="flex space-x-2">
						<div className='w-full'>
							<Form.Item label="Phone" name="phone" required>
								<RMSInput placeholder='Phone' />
							</Form.Item>
						</div>
						<div className='w-full'>
							<Form.Item label="Email" name="email">
								<RMSInput placeholder='Email' />
							</Form.Item>
						</div>
					</div>

					<div className="flex space-x-2">
						<div className='w-full'>
							<Form.Item label="Birthday">
								<RMSDatePicker className='w-full' />
							</Form.Item>
						</div>
						<div className='w-full'>
							<Form.Item label="Source">
								<Select>
									<Select.Option value="demo">Demo</Select.Option>
								</Select>
							</Form.Item>
						</div>
					</div>

					<div className="flex space-x-2">
						<div className='w-full'>
							<Form.Item label="Source">
								<Select>
									<Select.Option value="demo">Demo</Select.Option>
								</Select>
							</Form.Item>
						</div>

							<Form.Item label="Source">
								<Select>
									<Select.Option value="demo">Demo</Select.Option>
								</Select>
							</Form.Item>

						<div className='w-full'>
							<Form.Item label="Source">
								<Select>
									<Select.Option value="demo">Demo</Select.Option>
								</Select>
							</Form.Item>
						</div>
					</div>
				</>
			}
			filterItems={filterItems}
		/>

	);
};

export default CustomerListPages;