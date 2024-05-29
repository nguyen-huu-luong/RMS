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
import { CreateaEmployeeModal } from "@/components/Modals/CreateNewEmployeeModal";
import { AxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";

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
	const t_general: any = useTranslations("General")
	const t_customer: any = useTranslations("Customer")
	const t_employee: any = useTranslations("Employee")
	const [form_create] = useForm()
	const columns: ColumnsType<DataType> = [
		{
			title: t_general("id"),
			dataIndex: "id",
			key: "id",
		},
		{
			title: t_general("fullname"),
			dataIndex: "fullname",
			key: "fullname",
			render(value, record, index) {
				return <span className="link cursor-pointer text-primary" onClick={() => router.push(`employees/${record.id}`)}>{value}</span>
			},
		},
		{
			title: t_general("phone"),
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: t_general("email"),
			dataIndex: "email",
			key: "email",
		},

		{
			title: t_employee('role'),
			dataIndex: "role",
			key: "role",
		},
		{
			title: t_general("created_at"),
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text) => moment(text).format("HH:mm DD:MM:YYYY")
		},
	];

	const filterItems: FilterItemType[] = [
		{
			key: "1",
			title: t_general("firstname"),
			fieldName: "firstname",
			type: "input"
		},
		{
			key: "8",
			title: t_general("lastname"),
			fieldName: "lastname",
			type: "input"
		},
		{
			key: "2",
			title: t_general("phone"),
			fieldName: "phone",
			type: "input"
		},
		{
			key: "3",
			title: t_general("email"),
			fieldName: "email",
			type: "input"
		},
		{
			key: "4",
			title: t_general("birthday"),
			fieldName: "birthday",
			type: "date"
		},
		{
			key: "6",
			title: t_general("created_at"),
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
							<p>{t_general("selected")} {selectedRows.length} {t_employee('employee')}</p>
							{/* <Button icon={<EllipsisOutlined />} /> */}
							<Button danger onClick={handleDeleteEmployees}>{t_general("delete")} {selectedRows.length} {t_employee('employee')}</Button>
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

	const handleDeleteEmployees = async () => {
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

	const handleCreateEmployee = async (values: any) => {
		try {
			const  result = await fetchClient({
				method: "POST",
				url: "/employees", 
				body: {
					data: {
						...values
					}
				}
			})
			setReload(!reload) ;
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response)  {
					const {code, name, message} = error?.response.data
					if (name  === "Conflict") {
						form_create.setFields([{name: "username", errors: ["Username đã tồn tại"]}])
					} else {
						message.error("From Server: ", message)
					}
				}
				throw error
			} else {
				message.error("Đã xãy ra lỗi")
				throw error
			}
		}
	}	



	return (
		<TableRender<DataType>
			columns={columns}
			url="/employees"
			createModalTitle="Add new employee"
			createModal = {<CreateaEmployeeModal formControl={form_create} onCreate={handleCreateEmployee}/>}
			reload={reload}
			onSelected={onSelectedRows}
			filterItems={filterItems}
		/>

	);
};

export default EmployeeListPages;