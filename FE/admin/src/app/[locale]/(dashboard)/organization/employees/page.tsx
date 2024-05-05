"use client";
import React, { useState } from "react";
import { type TableProps, type GetProp, Form, Upload, Button, Select, message, Flex, Space, Input } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import TableRender, { FilterItemType } from "@/components/TableComponents";
import fetchClient from "@/lib/fetch-client";
import { SendEmailModal } from "@/components/Modals/SendEmailModal";
import { CreateTargetListModal } from "@/components/Modals/CreateTargetListModal";
import { useRouter } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import moment from "moment";

type ColumnsType<T> = TableProps<T>["columns"];
interface DataType {
	key: React.Key;
	id: number;
	fullname: string;
	phone: string;
	email: string;
	role: string;
	createdAt: string;
}


const EmployeeListPages: React.FC = () => {
	const [selectedRows, setSelectedRows] = useState<DataType[]>([])
	const [reload, setReload] = useState(false)
	const router = useRouter()

	const [form_create] = useForm()
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
			render(value, record, index) {
				return <span className="link cursor-pointer text-primary" onClick={() => router.push(`employees/${record.id}`)}>{value}</span>
			},
		},
		{
			title: "Phone number",
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},

		{
			title: "Role",
			dataIndex: "role",
			key: "role",
		},
		{
			title: "CreatedAt",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text) => moment(text).format("HH:mm DD:MM:YYYY")
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
			key: "6",
			title: "CreatedAt",
			fieldName: "createdAt",
			type: "date"
		},
	];

	const onSelectedRows = {
		handle: (selecteds: DataType[]) => setSelectedRows(selecteds),
		render: () => (
			<main className="bg-white w-full py-2 px-3 my-2 rounded-md border">
				<Flex>
					{(selectedRows && selectedRows.length > 0) ?
						<Space>
							<p>Selected {selectedRows.length} Employees</p>
							{/* <Button icon={<EllipsisOutlined />} /> */}
							<Button danger onClick={handleDeleteEmplyees}>Delete {selectedRows.length} records</Button>
						</Space>
						:
						<Space>
							<Input
								placeholder="Enter keywork to search...."
								prefix={<SearchOutlined className="site-form-item-icon px-2 text-gray-500" />}
								className="flex items-center"
							/>
						</Space>
					}
				</Flex>
			</main >
		)
	}

	const handleDeleteEmplyees = async () => {
		try {
			const result = await fetchClient({
				url: "/employees",
				method: "DELETE",
				body: {
					ids: selectedRows.map(item => item.id)
				}
			})

			setReload(!reload)
		} catch (error) {
			message.error("Đã xảy ra lỗi")
			throw error
		}
	}

	return (
		<TableRender<DataType>
			columns={columns}
			url="/employees"
			createModalTitle="Add new employee"
			reload={reload}
			onSelected={onSelectedRows}
			filterItems={filterItems}
		/>

	);
};

export default EmployeeListPages;