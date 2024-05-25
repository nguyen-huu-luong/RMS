import { Button, Form, Input, Modal, Space, message } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import Link from "next/link";
import TableRender from "../TableComponents";
import { CreateTargetListModal } from "./CreateTargetListModal";
import fetchClient from "@/lib/fetch-client";


interface DataType {
    key?: React.Key;
    id: number;
    name: string;
    description: string;
    type: string;
    count: number;
}

interface IAddTargetlistToCampaignModal {
    excludeIds?: number[]
    onOk?: (values: DataType[]) => void,
    onCreate?: () => void,
    triggerText?: string
}
export const AddTargetlistToCampaignModal: React.FC<IAddTargetlistToCampaignModal> = (props) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<DataType[]>([])
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
            render: (text, row, record) => <Link href={`/targetlists/${row.id}`}>{text}</Link>
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

    const onSelectedRows = {
        handle: (selecteds: DataType[]) => setSelectedRows(selecteds),
        render: () => <p>Selected {selectedRows.length} targetList</p>
    }

    const handleCreateTargetlist = async (values: any) => {
        try {
            const result = await fetchClient({
                method: "POST",
                url: "/targetlists",
                body: {
                    ...values
                }
            })
            // setReload(!reload)
        //    const  newData = [...data, result.data]
           setData(prev => ([...prev, result.data]))
        } catch (error) {
            message.error("Đã xảy ra lỗi")
            throw error
        }
    }

    return <>
        <Button onClick={showModal}>{props.triggerText || "New"}</Button>
        <CustomModal
            title="Add targetlist to campaign"
            open={open}
            okText="Select"
            okButtonProps={{ className: "bg-primary"}}
            onCancel={handleCancel}
            onOk={handleOk}
            width={1000}
        >
            {open && <TableRender<DataType>
                data={data}
                setData={setData}
                columns={columns}
                url="/targetlists"
                onSelected={onSelectedRows}
                excludeDataHasIds={props.excludeIds}
                createModal={<CreateTargetListModal
                    onOk={handleCreateTargetlist}
                />}
                createModalTitle="Create new targetlist"
            />}
        </CustomModal>
    </ >
}