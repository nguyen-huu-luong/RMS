import { ExpandAltOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Space } from "antd"
import { createStyles } from "antd-style";
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import Link from "next/link";
import TableRender from "../TableComponents";

interface IAddTargetlistToCampaignModal {
    excludeIds?: number[]
    onOk?: (values: any) => void,
    onCreate?: () => void,
}

interface DataType {
    key?: React.Key;
    id: number;
    name: string;
    description: string;
    type: string;
    count: number;
}

export const AddTargetlistToCampaignModal: React.FC<IAddTargetlistToCampaignModal> = (props) => {
    const [open, setOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<DataType[]>([]);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async (values: any) => {
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
            dataIndex: "name",
            key: "name",
            render: (text, row, record) => <Link href={`marketing/targetlists/${row.id}`}>{text}</Link>
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "count",
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
            setSelectedRows(selectedRows)
        },
    };

    const onSelectedRows = {
        handle: (selecteds: DataType[]) => setSelectedRows(selecteds),
        render: () => <p>Selected {selectedRows.length} targetList</p>
    }

    return <>
        <p onClick={showModal}>Select</p>
        <CustomModal
            title="Add targetlist to campaign"
            open={open}
            okText="Select"
            okButtonProps={{ className: "bg-primary" }}
            onCancel={handleCancel}
            onOk={handleOk}
            width={1200}
        >
           {open && <TableRender<DataType>
                columns={columns}
                url="/targetlists"
                onSelected={onSelectedRows}
                excludeDataHasIds={props.excludeIds}
                formCreateElement={
                    <>
                        <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the group name !' }]}>
                            <Input placeholder='Group name' />
                        </Form.Item>
                        <Form.Item label="Description" name="description" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                            <TextArea placeholder='Group description' />
                        </Form.Item>
                    </>
                }
            />}
        </CustomModal>
    </ >
}