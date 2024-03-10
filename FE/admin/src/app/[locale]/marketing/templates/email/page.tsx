"use client";
import React, { useRef, useState } from "react";
import { Button, ConfigProvider, Divider, InputRef, Radio, Table, Input, Space } from "antd";
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { variables } from "@/app";
import { render } from "react-dom";
import { FieldTimeOutlined, InfoCircleFilled, InfoOutlined, MailFilled, MailOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { FilterConfirmProps } from 'antd/es/table/interface';

interface DataType {
	key: React.Key;
	name: string;
	age: number;
	address: string;
}

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
type DataIndex = keyof DataType;

const EmailTemplate: React.FC = () => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);
	const handleSearch = (
		selectedKeys: string[],
		confirm: (param?: FilterConfirmProps) => void,
		dataIndex: DataIndex,
	) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setSearchText('');
	};
	const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							setSearchText((selectedKeys as string[])[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Filter
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes((value as string).toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	const columns: ColumnsType<DataType> = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '30%',
			...getColumnSearchProps('name'),
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
			width: '20%',
			...getColumnSearchProps('age'),
			sorter: (a, b) => a.age - b.age,
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
			...getColumnSearchProps('address'),
			sorter: (a, b) => a.address.length - b.address.length,
			sortDirections: ['descend', 'ascend'],
		},
	];


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
					position: ["bottomCenter", "bottomRight"],
					showSizeChanger: true,
					// showQuickJumper: true
				}}
				dataSource={data}
			/>
		</ConfigProvider>
	);
};

export default EmailTemplate;
