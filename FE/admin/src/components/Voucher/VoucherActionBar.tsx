"use client";
import {
    EllipsisOutlined,
    InfoCircleOutlined,
    PlusCircleOutlined,
    SearchOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Button,
    Dropdown,
    Flex,
    Input,
    MenuProps,
    Modal,
    Space,
    Tooltip,
} from "antd";
import React, { useState } from "react";
import { createStyles, useTheme } from "antd-style";
import { AddVoucherForm } from "./AddVoucherForm";
import { useTranslations } from "next-intl";

const useStyle = createStyles(({ token }) => ({
    "my-modal-body": {},
    "my-modal-mask": {},
    "my-modal-header": {},
    "my-modal-footer": {},
    "my-modal-content": {},
}));

interface VoucherActionBarProps {
    dataSelected?: Array<any>;
    fetchData: any;
}

export const VoucherActionBar: React.FC<VoucherActionBarProps> = (props) => {
    const [open, setOpen] = useState(false);
    const { styles } = useStyle();
    const t = useTranslations('Voucher')
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setOpen(false);
        setTimeout(async () => {
            await props.fetchData();
        }, 500);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const classNames = {
        body: styles["my-modal-body"],
        mask: styles["my-modal-mask"],
        header: styles["my-modal-header"],
        footer: styles["my-modal-footer"],
        content: styles["my-modal-content"],
    };

    const modalStyles = {
        header: {
            borderRadius: 0,
            borderBottom: "1px solid #ccc",
            paddingBottom: 4,
            marginBottom: 24,
        },
        body: {
            borderRadius: 5,
        },
        footer: {
            borderTop: "1px solid #ccc",
            paddingTop: 16,
        },
        content: {
            padding: 20,
        },
    };

    return (
        <main className='bg-white w-full py-2 px-3 rounded-md border'>
            <Flex>
                {props.dataSelected && props.dataSelected?.length > 0 ? (
                    // <Space>
                    //     <p>Selected {props.dataSelected?.length} vouchers</p>
                    //     <Button icon={<EllipsisOutlined />} />
                    // </Space>
                    <></>
                ) : (
                    <Space>
                        <Input
                            placeholder='Enter keywork to search....'
                            prefix={
                                <SearchOutlined className='site-form-item-icon px-2 text-gray-500' />
                            }
                            className='flex items-center'
                        />
                    </Space>
                )}

                <Space className='ms-auto'>
                    <Button icon={<PlusCircleOutlined />} onClick={showModal}>
                        {t('new')}
                    </Button>
                </Space>
            </Flex>

            <Modal
                classNames={classNames}
                styles={modalStyles}
                title={t('add-new-voucher')}
                open={open}
                onOk={handleOk}
                okType='primary'
                okButtonProps={{ className: "bg-primary" }}
                cancelText='Cancel'
                onCancel={handleCancel}
                footer={null}
            >
                <AddVoucherForm
                    afterSubmit={handleOk}
                    afterCancel={handleCancel}
                />
            </Modal>
        </main>
    );
};
