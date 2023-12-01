"use client";
import React, { useState } from "react";
import { Button, ConfigProvider, Divider, Radio, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { variables } from "@/app";
import { render } from "react-dom";
import {  FieldTimeOutlined, InfoCircleFilled, InfoOutlined, MailFilled, MailOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";

interface DataType {
	key: React.Key;
	name: string;
	age: number;
	address: string;
}

const columns: ColumnsType<DataType> = [
	{
		title: <><MailFilled /> Name</>,
		dataIndex: "name",
		render: (text: string) => <Link href="email/:key/" className="">{text}</Link>,

	},
    {
        title: <><InfoCircleFilled className="text-blue-500"/> Description</>,
        dataIndex: "address",
    },
	{
		title: <><FieldTimeOutlined />Created at</>,
		dataIndex: "age",
	},
];

const data: DataType[] = [
	{
		key: "1",
		name: "John Brown",
		age: 32,
		address: "New York No. 1 Lake Park",
	},
	{
		key: "2",
		name: "Jim Green",
		age: 42,
		address: "London No. 1 Lake Park",
	},
	{
		key: "3",
		name: "Joe Black",
		age: 32,
		address: "Sydney No. 1 Lake Park",
	},
	{
		key: "4",
		name: "Disabled User",
		age: 99,
		address: "Sydney No. 1 Lake Park",
	},
];

// rowSelection object indicates the need for row selection
const rowSelection = {
	onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
		console.log(
			`selectedRowKeys: ${selectedRowKeys}`,
			"selectedRows: ",
			selectedRows
		);
	},
	getCheckboxProps: (record: DataType) => ({
		disabled: record.name === "Disabled User", // Column configuration not to be checked
		name: record.name,
	}),
};

const EmailTemplate: React.FC = () => {
	return (
		<ConfigProvider
			theme={{
				components: {
					Table: {
						headerBg: variables.backgroundSecondaryColor,
						footerBg: "#fff",
					},
				},
			}}
		>
			<Table
				rowSelection={{
					...rowSelection,
				}}
				columns={columns}
				pagination={{
                    className: "bg-white rounded px-4 py-2",
					showTotal: (total) => `Total ${total} items`,
					position: [ "bottomCenter", "bottomRight"],
					showSizeChanger: true,
					// showQuickJumper: true
				}}
				dataSource={data}
			/>
		</ConfigProvider>
	);
};

export default EmailTemplate;
