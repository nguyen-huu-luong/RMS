"use client";
import React, { useRef, useState } from "react";
import { Button, ConfigProvider, InputRef, Radio, Table, Input, Space } from "antd";
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { variables } from "@/app";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { CustomerActionBar, CustomerFilterBar } from "@/components";

interface DataType {
	key: React.Key;
	id: number;
	phone: string;
	fullname: string;
	email: string;
	createdAt: string,
	birthday: string;
	source: string;
	group: string[];
	score: number;
	age: number;
	address: string;
	// updatedAt: Date ;
}


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
	const data: DataType[] = [
		{
			key: (1).toString(),
			id: 1,
			fullname: "John Brown",
			email: "minhvuonglht@gmail.com",
			phone: "0397638114",
			createdAt: (new Date()).toDateString(),
			birthday: new Date(Date.now() - 86400 * 22).toDateString(),
			source: "website",
			age: 22,
			group: ["abc", "fdfa"],
			score: 700,
			address: "New York No. 1 Lake Park",
			// updatedAt: new Date(),
		}
	]

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
			disabled: record.fullname === "", // Column configuration not to be checked
			name: record.fullname,
		}),
	};
	const columns: ColumnsType<DataType> = [
		{
			title: "Fullname",
			dataIndex: 'fullname',
			key: 'fullname',
			...getColumnSearchProps('fullname'),
		},
		{
			title: 'Phone number',
			dataIndex: 'phone',
			key: 'phone',
			...getColumnSearchProps('phone'),
			// sorter: (a, b) => a.age - b.age,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			...getColumnSearchProps('email'),
		},
		{
			title: 'Source',
			dataIndex: 'source',
			key: 'source',
			...getColumnSearchProps('source'),
		},
		{
			title: 'Birthday',
			dataIndex: 'birthday',
			key: 'birthday',
			...getColumnSearchProps('birthday'),
		},
		{
			title: 'Score',
			dataIndex: 'score',
			key: 'score',
			...getColumnSearchProps('score'),
		},
		{
			title: 'Group',
			dataIndex: 'group',
			key: 'group',
			...getColumnSearchProps('group'),
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
			...getColumnSearchProps('age'),
		},
		{
			title: 'CreatedAt',
			dataIndex: 'createdAt',
			key: 'createdAt',
			...getColumnSearchProps('createdAt'),
		},
		// {
		// 	title: 'Last updated',
		// 	dataIndex: 'updatedAt',
		// 	key: 'updatedAt',
		// 	// ...getColumnSearchProps('updatedAt'),
		// }
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
			<CustomerFilterBar />
			<CustomerActionBar />
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
					showQuickJumper: true
				}}
				dataSource={data}
			/>
		</ConfigProvider>
	);
};

export default EmailTemplate;
