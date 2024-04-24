import { Button, Form, Input, Modal, Space } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import Link from "next/link";
import TableRender from "../TableComponents";
import TimeFormatter from "../TimeFormatter";

interface IChooseTemplateModal {
    onOk?: (record: DataType) => void,
    onCreate?: () => void,
}

interface DataType {
    key?: React.Key;
    id: number;
    name: string;
    createdAt: string
}

export const ChooseTemplateModal: React.FC<IChooseTemplateModal> = (props) => {
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = (record: DataType) => {
        props.onOk && props.onOk(record)
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const columns: ColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, row, record) => 
                    (<p className="link text-primary" onClick={() => handleOk(row)}>{text}</p>)
        },

        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, row, record) => <TimeFormatter time={text} />
        },
    ];

    return <>
        <Button onClick={showModal}>Select</Button>
        <CustomModal
            title="Add targetlist to campaign"
            open={open}
            onCancel={handleCancel}
            width={600}
            footer={null}
        >
           {open && <TableRender<DataType>
                columns={columns}
                url="/message-templates"
            />}
        </CustomModal>
    </ >
}