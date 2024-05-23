"use client";
import React, { useState } from "react";
import { type TableProps, type GetProp, Form, Upload, Button, Select, Flex, Space, Input, message } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import TableRender, { FilterItemType } from "@/components/TableComponents";
import fetchClient from "@/lib/fetch-client";
import { SendEmailModal } from "@/components/Modals/SendEmailModal";
import { CreateTargetListModal } from "@/components/Modals/CreateTargetListModal";
import { useRouter } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import { CreateNewLeadModal } from "@/components/Modals/CreateNewLeadModal";
import { AxiosError } from "axios";
import moment from "moment";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

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
	const t_general = useTranslations("General")
	const t_customer = useTranslations("Customer")
	const [selectedRows, setSelectedRows] = useState<DataType[]>([])
	const [reload, setReload] = useState(false)
	const router = useRouter()
	const {data} = useSession()
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
			render: (text, row) => <Link style={{ color: "#4A58EC" }} href={`/leads/${row.id}`}>{text}</Link>,
			// ...getColumnSearchProps("fullname"),
		},
		{
			title: t_general("phone"),
			dataIndex: "phone",
			key: "phone",
			// sorter: (a, b) => a.age - b.age,
		},
		{
			title: t_general("email"),
			dataIndex: "email",
			key: "email",
		},
		{
			title: t_general("type"),
			dataIndex: "type",
			key: "type",
		},
		{
			title: t_general("birthday"),
			dataIndex: "birthday",
			key: "birthday",
			render: (text, _) => text ? moment(text).format("DD-MM-YYYY") : "None"
		},
		{
			title: t_general("score"),
			dataIndex: "score",
			key: "score",
		},
		{
			title: t_general("age"),
			dataIndex: "age",
			key: "age",
			render: (text, row) => <span>{getAge(row.birthday)}</span>
		},
		{
			title: t_general("created_at"),
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text) => moment(text).format("HH:mm DD-MM-YYYY")
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
			title: t_general("phone"),
			fieldName: "email",
			type: "input"
		},
		{
			key: "4",
			title: t_general("birthday"),
			fieldName: "birthday",
			type: "date"
		},
		// {
		// 	key: "5",
		// 	title: "Group",
		// 	fieldName: "group",
		// 	type: "select",
		// 	options: [
		// 		{
		// 			label: "Group 1",
		// 			value: 1
		// 		},
		// 		{
		// 			label: "Group 2",
		// 			value: 2
		// 		},
		// 		{
		// 			label: "Group ",
		// 			value: 3
		// 		},
		// 	]
		// },
		{
			key: "6",
			title: t_general("created_at"),
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

			// message.success("Create new target list successfull")
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
							<p>Selected {selectedRows.length} {t_customer('lead')}</p>
							<CreateTargetListModal onOk={handleCreateTargetlist} triggerText="Create targetlist" />
							<SendEmailModal emailLists={selectedRows.map((item) => item.email)} />
							{/* <Button icon={<EllipsisOutlined />} /> */}
							<Button danger onClick={handleDeleteCustomers}>{t_general("delete")} {selectedRows.length} {t_customer('lead')}</Button>
						</Space>
						:
						<Space>
							<Input
								placeholder={t_general("search_placeholder")}
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

	const handleCreateLead = async (values: any) => {
		try {
			const  result = await fetchClient({
				method: "POST",
				url: "/customers", 
				body: {
					data: {
						...values,
						convertDate: new Date(),
                        type: "lead",
						creatorId: data?.user.id
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
            queryStr="type=lead"
			createModalTitle="Add new lead"
			reload={reload}
			onSelected={onSelectedRows}
			createModal={<CreateNewLeadModal formControl={form_create} onCreate={handleCreateLead} />}
			filterItems={filterItems}
		/>
	);
};

export default CustomerListPages;