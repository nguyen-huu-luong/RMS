import { Button, Form, Input, Modal, Space, Tooltip } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import Table, { ColumnsType } from "antd/es/table";
import Link from "next/link";
import TableRender, { FilterItemType } from "../TableComponents";
import LinkWithRef from "next-intl/link";

interface IAddClientToTargetListModal {
	excludeIds?: number[],
	type: "customer" | "lead",
	onOk?: (values: any) => void,
}

interface DataType {
	key?: React.Key;
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	Group: {
		id: number,
		name: string,
		description: string
	}
	createdAt: string
}

export const AddClientToTargetListModal: React.FC<IAddClientToTargetListModal> = (props) => {
	const [open, setOpen] = useState(false);
	const [selectedRows, setSelectedRows] = useState<DataType[]>([]);

	const showModal = () => {
		setOpen(true);
	};

	const handleOk = async () => {
		props.onOk && props.onOk(selectedRows)
		setOpen(false);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const columns: ColumnsType<DataType> = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Name",
			dataIndex: "fullname",
			key: "fullname",
			render: (text, row, record) => <LinkWithRef href={`/${props.type}s/${row.id}`}>{row.firstname + " " + row.lastname}</LinkWithRef>,
			align: "center"

		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			align: "center"
		},
		{
			title: "Phone",
			dataIndex: "phone",
			key: "phone",
			align: "center"
		},
	];

	const getColor = (num: number) => {
		const color = ["#FF69B4", "#1E90FF", "#FFD700", "#00FF00", "#FF4500", "#9400D3",
			"#FF69B4", "#1E90FF", "#FFD700", "#00FF00", "#FF4500", "#9400D3"]

		return color[num]
	}

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
			key: "6",
			title: "CreatedAt",
			fieldName: "createdAt",
			type: "date"
		},
	];

	if (props.type === "customer") {
		filterItems.push({
			key: "5",
			title: "Group",
			fieldName: "group",
			type: "select",
			options: [
				{
					label: "Group 0",
					value: 1
				},
				{
					label: "Group 1",
					value: 2
				},
				{
					label: "Group 2",
					value: 3
				},
				{
					label: "Group 3",
					value: 4
				},
				{
					label: "Group 4",
					value: 5
				},
				{
					label: "Group 5",
					value: 6
				},
				{
					label: "Group 6",
					value: 7
				},
			]
		})

		columns.push({
			title: "Group",
			dataIndex: "group",
			key: "group",
			render: (text, row) => row.Group ? (<Tooltip title={row.Group.description || ""}>
				<span className="px-2 py-1 rounded-xl text-white" style={{ background: getColor(row.Group.id) }}>{row.Group.name}</span>
			</Tooltip>) : "Unknown"
		})
	}

	const onSelectedRows = {
		handle: (selecteds: DataType[]) => setSelectedRows(selecteds),
		render: () => <p>Selected {selectedRows.length} targetList</p>
	}

	return <>
		<Button onClick={showModal}>Select</Button>
		<CustomModal
			title={`Add ${props.type} to targetlist`}
			open={open}
			okText="Select"
			okButtonProps={{ className: "bg-primary" }}
			onCancel={handleCancel}
			onOk={handleOk}
			width={1200}
		>
			{open && <TableRender<DataType>
				columns={columns}
				url="/customers"
				queryStr={`type=${props.type}`}
				onSelected={onSelectedRows}
				filterItems={filterItems}
			/>
			}
		</CustomModal>
	</ >
}