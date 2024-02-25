"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, ConfigProvider, InputRef, Radio, Table, Input, Space, Checkbox, Select, Row, Alert } from "antd";
import type { TableProps, GetProp, TableColumnType } from 'antd';
import { variables } from "@/app";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { FilterConfirmProps, FilterValue, SorterResult } from 'antd/es/table/interface';
import { CustomerActionBar, CustomerFilterBar } from "@/components";
import Link from "next/link";


type ColumnsType<T> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

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

interface TableParams {
	pagination?: TablePaginationConfig;
	field?: any;
	order?: any;
	filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const getRandomuserParams = (params: TableParams) => ({
	results: params.pagination?.pageSize,
	page: params.pagination?.current,
	...params,
});

type ErrorType = {
	isError: boolean
	title: string
	message: string,
}

const EmailTemplate: React.FC = () => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);
	const [data, setData] = useState<DataType[]>();
	const [loading, setLoading] = useState(false);
	const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
	const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
	const [tableParams, setTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0
		},
		filters: {},
		field: "",
		order: "asc"
	});
	const [error, setError] = useState<ErrorType>({
		isError: false,
		message: "",
		title: ""
	})
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
	const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
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
		onFilter: (value: any, record: any) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes((value as string).toLowerCase()),
		onFilterDropdownOpenChange: (visible: any) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text: string) =>
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
			title: "ID",
			dataIndex: "id",
			key: "id",
			sorter: (a, b) => a.id - b.id,
		},
		{
			title: "Fullname",
			dataIndex: 'fullname',
			key: 'fullname',
			render: text => <a>{text}</a>,
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
			sorter: (a: any, b: any) => a - b,
			...getColumnSearchProps('createdAt'),
		},
		// {
		// 	title: 'Last updated',
		// 	dataIndex: 'updatedAt',
		// 	key: 'updatedAt',
		// 	// ...getColumnSearchProps('updatedAt'),
		// }
	];

	const fetchData = () => {
		setLoading(true);
		try {
			let filterQueriesStr = ""
			for (const key in tableParams.filters) {
				filterQueriesStr = `${filterQueriesStr}&${key}=${tableParams.filters[key]}`
			}
			let sortQueries = (tableParams.field && tableParams.order) ? `&sort=${tableParams.field}&order=${tableParams.order === "ascend" ? "asc" : "desc"}` : "";
			fetch(`http://localhost:3003/api/customers/all?page=${tableParams.pagination?.current}
							&pageSize=${tableParams.pagination?.pageSize}${sortQueries}`, {
				headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiTWFyaW9fS29zc0B5YWhvby5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTcwODM1NjUwNCwiZXhwIjoxNzE0MzU2NTA0fQ.naMCtTR_QKTwTMkqjIL6QaMNnbZdOk7wzuojI_H5RNc' }
			})
				.then((res) => res.json())
				.then((results) => {
					const data = results.data.map((item: any) => ({ ...item, key: item.id, fullname: `${item.firstname} ${item.lastname}` }))
					setData(data);
					setLoading(false);
					setTableParams({
						...tableParams,
						pagination: {
							...tableParams.pagination,
							pageSize: results.pageSize,
							current: results.page,
							total: results.totalCount,
							// 200 is mock data, you should read it from server
							// total: data.totalCount,
						},
					});
				})
				.catch(error => {
					console.log(error)
					setError({
						isError: true,
						title: error?.name || "Something went wrong!",
						message: error?.message || "Unknown error"
					})
				})
		} catch (error: any) {
			console.log(error)
			setError({
				isError: true,
				title: error?.name || "Something went wrong!",
				message: error?.message || "Unknown error"
			})
		};
	};

	useEffect(() => {
		fetchData();
	}, [JSON.stringify(tableParams)]);

	const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
		if (Array.isArray(sorter)) {
			const firstSorter = sorter[0];
			setTableParams(prevParams => ({
				...prevParams,
				pagination,
				filters,
				field: firstSorter?.field?.toString(), // Ensure field is a string
				order: firstSorter?.order
			}));
		} else {
			setTableParams(prevParams => ({
				...prevParams,
				pagination,
				filters,
				field: sorter?.field?.toString(), // Ensure field is a string
				order: sorter?.order
			}));
		}
	};

	const handleSortFieldChange = (key: string) => {
		console.log(key, tableParams)
		setTableParams(prev => ({ ...prev, field: key }))
		console.log(tableParams)
	}

	const handleClearFilter = () => {

	}

	const handleClearAll = () => {

	}

	const handleCloseError = () => {
		console.log(error)
		setError({isError: false, title: "", message: ""})
	}

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
			{/* <CustomerFilterBar /> */}
			{/* <CustomerActionBar /> */}
			{error.isError && <Alert
				message={error.title}
				description={error.message}
				type="error"
				showIcon
				onClose={handleCloseError}
				closeIcon
			/>}
			<div className="border bg-white shadow mb-2 p-3">
				<div style={{ marginBottom: 16 }} className="flex items-center gap-2">
					<p>Sort by: </p>
					<Select
						// style={{ width: '20%' }}
						placeholder="Columns"
						value={tableParams.field}
						onChange={handleSortFieldChange}
						options={columns.map(item => ({ value: item.key, label: item.title }))}
					/>

					<p>Filter: </p>
					<Select
						style={{ width: '20%' }}
						placeholder="tags"
						mode="multiple"
						onChange={handleSortFieldChange}
						options={columns.map(item => ({ value: item.key, label: item.title }))}
					/>
				</div>
				<Space>
					<Button onClick={handleClearFilter}>Clear filters</Button>
					<Button onClick={handleClearAll}>Clear filters and sorters</Button>
					<Space className="ms-auto">
						<input type="checkbox" name="apply-mode" id="apply-mode" />
						<label htmlFor="apply-mode">Apply filters only in current page</label>
					</Space>
				</Space>
			</div>

			<Table
				rowSelection={{
					...rowSelection,
				}}
				columns={columns}
				pagination={{
					className: "bg-white rounded px-4 py-2",
					showTotal: (total: number) => `Total ${total} items`,
					position: ["bottomCenter", "bottomRight"],
					showSizeChanger: true,
					showQuickJumper: true,
					total: tableParams.pagination?.total,
					pageSize: tableParams.pagination?.pageSize
				}}
				loading={loading}
				dataSource={data}
				onChange={handleTableChange}
			/>

		</ConfigProvider>
	);
};

export default EmailTemplate;
