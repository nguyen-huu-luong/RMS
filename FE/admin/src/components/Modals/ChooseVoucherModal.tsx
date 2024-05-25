import { Button, Form, Input, Modal, Space, message } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import Link from "next/link";
import TableRender from "../TableComponents";
import { CreateTargetListModal } from "./CreateTargetListModal";
import fetchClient from "@/lib/fetch-client";
import { useTranslations } from "next-intl";


interface DataType {
    id: number,
    name: string,
    description: string,
    promo_code: string,
    status: String,
    type: string,
    amount: number,
    begin: string
}

interface IChooseVoucherModal {
    excludeIds?: number[]
    onOk?: (value: any) => void,
    onCreate?: () => void,
    triggerText?: string
}
export const ChooseVoucherModal: React.FC<IChooseVoucherModal> = (props) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<DataType[]>([])
    // const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
    const t = useTranslations("Voucher");

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async (value: DataType) => {
        props.onOk && props.onOk({id: value.id, name: value.name})
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const columns: ColumnsType<DataType> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: t('name'),
            dataIndex: "name",
            key: "name",
            render: (text, row) => <span className="link text-primary" onClick={() => handleOk(row)}>{text}</span>
        },
        {
            title: t('description'),
            dataIndex: "description",
            key: "description",
        },
        {
            title: t('promo-code'),
            dataIndex: "promo_code",
            key: "promo_code",
        },
        {
            title: t('type'),
            dataIndex: "type",
            key: "type",
        },
        {
            title: t('amount'),
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: t('status'),
            // dataIndex: "",
            // key: ""
            render: (text, row) => {
                if (new Date(row.begin).getTime() - new Date().getTime() > 0) {
                    return t("_status.can-use")
                } 
                return t("_status.expired")
            } 
        }
        
    ];


    return <>
        <Button onClick={showModal}>{props.triggerText || "Select"}</Button>
        <CustomModal
            title="Choose voucher"
            open={open}
            okText="Select"
            okButtonProps={{ className: "bg-primary"}}
            onCancel={handleCancel}
            // onOk={handleOk}
            width={1000}
            footer={null}
        >
            {open && <TableRender<DataType>
                data={data}
                setData={setData}
                columns={columns}
                url="/vouchers"
                rowSelection={false}
                // onSelected={onSelectedRows}
                // excludeDataHasIds={props.excludeIds}
                // createModal={<CreateTargetListModal
                //     onOk={handleCreateTargetlist}
                // />}
                // createModalTitle="Create new targetlist"
            />}
        </CustomModal>
    </ >
}