import { Button, Form, Input, Modal, Space } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import Link from "next/link";
import TableRender, { FilterItemType } from "../TableComponents";

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
    group: number;
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
            render: (text, row, record) => <Link href={`/${props.type}s/${row.id}`}>{row.firstname + " " + row.lastname}</Link>,
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
        }
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
                // excludeDataHasIds={}
                filterItems={filterItems}
                
                // formCreateElement={
                //     <>
                //         <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the group name !' }]}>
                //             <Input placeholder='Group name' />
                //         </Form.Item>
                //         <Form.Item label="Description" name="description" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                //             <TextArea placeholder='Group description' />
                //         </Form.Item>
                //     </>
                // }
            />}
        </CustomModal>
    </ >
}