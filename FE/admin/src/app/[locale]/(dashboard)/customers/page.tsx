"use client";
import React, { useState } from "react";
import { type TableProps, type GetProp, Form, Upload, Button, Select, message, Flex, Space, Input } from "antd";
import { CustomerActionBar } from "@/components";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import RMSInput from "@/components/inputs/RMSInput";
import RMSDatePicker from "@/components/inputs/RMSDatePicker";
import TableRender, { FilterItemType } from "@/components/TableComponents";
import fetchClient from "@/lib/fetch-client";
import { SendEmailModal } from "@/components/Modals/SendEmailModal";
import { CreateTargetListModal } from "@/components/Modals/CreateTargetListModal";
import { useRouter } from "next/navigation";
import { CreateCustomerForm } from "@/components/CreateCustomerForm";
import { useForm } from "antd/es/form/Form";
import { CreateNewCustomerModal } from "@/components/Modals/CreateNewCustomerModal";
import { AxiosError } from "axios";
import TimeFormatter from "@/components/TimeFormatter";
import moment from "moment";
import Link from "next/link";

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
	score: number;
	age: number;
	address: string;
	// updatedAt: Date ;
}

function getAge(birthDateString: string): number {
    const birthDate = new Date(birthDateString);
    const currentDate = new Date();
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

const CustomerListPages: React.FC = () => {
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
			render: (text, row) => <Link style={{ color: "#4A58EC" }} href={`/${row.id}`}>{text}</Link>,
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
			render: (text, _) => moment(text).format("DD-MM-YYYY")
		},
		{
			title: "Score",
			dataIndex: "score",
			key: "score",
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
			render: (text, row) => <span>{getAge(row.birthday)}</span>
		},
		{
			title: "CreatedAt",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text) => moment(text).format("HH:mm DD-MM-YYYY")
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

	const handleCreateTargetlist = async (values: any) => {
		console.log(values)
		try {
			const result = await fetchClient({
				method: "POST",
				url: "/targetlists",
				body: {
					...values,
					clientIds: selectedRows.map(item => item.id)
				}
			})

			message.success("Create new target list successfull")
			console.log(result)
			router.push(`marketing/targetlists/${result.data.id}`)
		} catch (error) {
			message.error("Faild to create new target list")
			throw error;
		}
	}


	const onSelectedRows = {
		handle: (selecteds: DataType[]) => setSelectedRows(selecteds),
		render: () => (
			<main className="bg-white w-full py-2 px-3 my-2 rounded-md border">
				<Flex>
					{(selectedRows && selectedRows.length > 0) ?
						<Space>
							<p>Selected {selectedRows.length} customer</p>
							<CreateTargetListModal onOk={handleCreateTargetlist} triggerText="Create targetlist" />
							<SendEmailModal emailLists={selectedRows.map((item) => item.email)} />
							{/* <Button icon={<EllipsisOutlined />} /> */}
							<Button danger onClick={handleDeleteCustomers}>Delete {selectedRows.length} customers</Button>
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

	const handleDeleteCustomers = async () => {
		try {
			const result = await fetchClient({
				url: "/customers",
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

	const handleCreateCustomer = async (values: any) => {
		try {
			const  result = await fetchClient({
				method: "POST",
				url: "/customers", 
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
						form_create.setFields([{name: "email", errors: ["Email đã tồn tại"]}])
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
			url="/customers"
			createModalTitle="Add new customer"
			reload={reload}
			onSelected={onSelectedRows}
			createModal={<CreateNewCustomerModal formControl={form_create} onCreate={handleCreateCustomer} />}
			filterItems={filterItems}
		/>

	);
};

export default CustomerListPages;