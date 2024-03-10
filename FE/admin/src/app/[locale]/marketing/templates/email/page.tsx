"use client";
import React, { useEffect, useRef, useState } from "react";
import {
	ConfigProvider,
	Table,
} from "antd";
import type { TableProps, GetProp } from "antd";
import { variables } from "@/app";
import type {
	Key,
	SortOrder,
} from "antd/es/table/interface";
import { CustomerActionBar, CustomerFilterBar } from "@/components";
import Link from "next/link";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
	GetProp<TableProps, "pagination">,
	boolean
>;

interface DataType {
	key: React.Key;
	id: number;
	name: string;
	type: string;
	createdAt: string;
	updatedAt: Date;
}

type ErrorType = {
	isError: boolean;
	title: string;
	message: string;
};

type SorterParams = {
	field?: Key | readonly Key[];
	order?: SortOrder;
};

interface TableParams {
	pagination?: TablePaginationConfig;
	sorter?: SorterParams;
	filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const EmailTemplate: React.FC = () => {
	const [data, setData] = useState<DataType[]>();
	const [loading, setLoading] = useState(false);
	const [selectedCustomers, setSelectedCustomers] = useState<DataType[]>();
	const [tableParams, setTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		filters: {},
		sorter: {
			field: "id",
			order: "ascend",
		},
	});
	const [error, setError] = useState<ErrorType>({
		isError: false,
		message: "",
		title: "",
	});

	// rowSelection object indicates the need for row selection
	const rowSelection = {
		onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
			console.log(
				`selectedRowKeys: ${selectedRowKeys}`,
				"selectedRows: ",
				selectedRows
			);
			setSelectedCustomers(selectedRows)

			console.log(selectedCustomers)
		},
	};
	const columns: ColumnsType<DataType> = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "CreatedAt",
			dataIndex: "createdAt",
			key: "createdAt",
		},

		{
			title: "UpdatedAt",
			dataIndex: "updatedAt",
			key: "updatedAt",
		},
	];

	const fetchData = () => {
		setLoading(true);
		try {
			let filterQueriesStr = "";
			for (const key in tableParams.filters) {
				filterQueriesStr = `${filterQueriesStr}&${key}=${tableParams.filters[key]}`;
			}
			let sortQueries =
				tableParams.sorter?.field && tableParams.sorter?.order
					? `&sort=${tableParams.sorter?.field}&order=${tableParams.sorter?.order === "ascend" ? "asc" : "desc"
					}`
					: "";
			fetch(
				`http://localhost:3003/api/message-templates/all?page=${tableParams.pagination?.current}
							&pageSize=${tableParams.pagination?.pageSize}${sortQueries}`,
				{
					headers: {
						Authorization:
							"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiTWFyaW9fS29zc0B5YWhvby5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTcwODM1NjUwNCwiZXhwIjoxNzE0MzU2NTA0fQ.naMCtTR_QKTwTMkqjIL6QaMNnbZdOk7wzuojI_H5RNc",
					},
				}
			)
				.then((res) => res.json())
				.then((results) => {
					const data = results.data.map((item: any) => ({
						...item,
						key: item.id,
						fullname: `${item.firstname} ${item.lastname}`,
					}));
					setData(data);
					setLoading(false);
					setTableParams({
						...tableParams,
						pagination: {
							...tableParams.pagination,
							pageSize: results.pageSize,
							current: results.page,
							total: results.totalCount,
						},
					});
				})
				.catch((error) => {
					console.log(error);
					setError({
						isError: true,
						title: error?.name || "Something went wrong!",
						message: error?.message || "Unknown error",
					});
				});
		} catch (error: any) {
			console.log(error);
			setError({
				isError: true,
				title: error?.name || "Something went wrong!",
				message: error?.message || "Unknown error",
			});
		}
	};

	useEffect(() => {
		fetchData();
	}, [JSON.stringify(tableParams)]);

	const handleTableChange: TableProps["onChange"] = (
		pagination,
		filters,
		sorter,
		extra
	) => {
		console.log(pagination, filters, sorter, extra);
		if (Array.isArray(sorter)) {
			const firstSorter = sorter[0];
			console.log("Sorter is array");
			setTableParams(prev => ({
				...prev,
				pagination,
				filters,
				sorter: {
					field: firstSorter?.field || prev.sorter?.field,
					order: firstSorter?.order || prev.sorter?.order,
				},
			}));
		} else {
			console.log("Sorter is not an array");

			setTableParams(prev => ({
				pagination,
				filters,
				sorter: {
					field: sorter?.field || prev.sorter?.field,
					order: sorter?.order || prev.sorter?.order,
				},
			}));
		}
	};
	const handleCloseError = () => {
		console.log(error);
		setError({ isError: false, title: "", message: "" });
	};

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
					showTotal: (total: number) => `Total ${total} items`,
					position: ["bottomCenter", "bottomRight"],
					showSizeChanger: true,
					showQuickJumper: true,
					total: tableParams.pagination?.total,
					pageSize: tableParams.pagination?.pageSize,
				}}
				loading={loading}
				dataSource={data}
				onChange={handleTableChange}
			/>
		</ConfigProvider>
	);
};

export default EmailTemplate;
