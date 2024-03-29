"use client"
import { EllipsisOutlined, InfoCircleOutlined, PlusCircleOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Input, MenuProps, Modal, Space, Tooltip } from "antd";
import React, { useState } from "react";
import { createStyles, useTheme } from 'antd-style';
import { AddEmployeeForm } from "./AddEmployeeForm";
import { SendEmailModal } from "./Modals/SendEmailModal";
import { SendSMSModal } from "./Modals/SendSMSModal";
import { FaTrash } from "react-icons/fa";

const useStyle = createStyles(({ token }) => ({
    'my-modal-body': {
    },
    'my-modal-mask': {

    },
    'my-modal-header': {
    },
    'my-modal-footer': {
    },
    'my-modal-content': {
    },
}));


interface IEmployeeActionBarProps {
    dataSelected?: Array<any>
}

const items: MenuProps['items'] = [
    {
        label: <a href="https://www.antgroup.com">1st menu item</a>,
        key: '0',
    },
    {
        label: <a href="https://www.aliyun.com">2nd menu item</a>,
        key: '1',
    },
    {
        type: 'divider',
    },
    {
        label: '3rd menu item',
        key: '3',
    },
];

export const EmployeeActionBar: React.FC<IEmployeeActionBarProps> = (props) => {
    const [open, setOpen] = useState(false);
    const { styles } = useStyle();

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };


    const classNames = {
        body: styles['my-modal-body'],
        mask: styles['my-modal-mask'],
        header: styles['my-modal-header'],
        footer: styles['my-modal-footer'],
        content: styles['my-modal-content'],
    };

    const modalStyles = {
        header: {
            borderRadius: 0,
            borderBottom: "1px solid #ccc",
            paddingBottom: 4,
            marginBottom: 24
        },
        body: {
            borderRadius: 5,
        },
        footer: {
            borderTop: '1px solid #ccc',
            paddingTop: 16
        },
        content: {
            padding: 20
        },
    };

    return <main className="bg-white w-full py-2 px-3 rounded-md border">
        <Flex>
            {
                (props.dataSelected && props.dataSelected?.length > 0) ?
                    <Space>
                        <p>Selected {props.dataSelected?.length} employee</p>
                        <Button icon={<FaTrash />} danger>Delete</Button>
                    </Space> :
                    <Space>
                        <Input
                            placeholder="Enter keywork to search...."
                            prefix={<SearchOutlined className="site-form-item-icon px-2 text-gray-500" />}
                            className="flex items-center"
                        />
                    </Space>
            }

            <Space className="ms-auto">
                <Button icon={<PlusCircleOutlined />} onClick={showModal}>
                    New
                </Button>
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Button icon={<EllipsisOutlined />} />

                </Dropdown>
            </Space>
        </Flex>

        <Modal
            classNames={classNames}
            styles={modalStyles}
            title="Add new employee"
            open={open}
            onOk={handleOk}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            footer={null}
        >
            <AddEmployeeForm afterSubmit={handleOk} afterCancel={handleCancel} />
        </Modal>

    </main >
}
