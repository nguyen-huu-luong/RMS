"use client"
import { EllipsisOutlined, InfoCircleOutlined, PlusCircleOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Input, MenuProps, Modal, Space, Tooltip, Form, Select, InputNumber } from "antd";
import React, { useState } from "react";
import { AddCustomerForm } from "../AddCustomerForm";
import { createStyles, useTheme } from 'antd-style';

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


interface CustomerActionBarProps {
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

export const CustomerActionBar: React.FC<CustomerActionBarProps> = (props) => {
    const [open, setOpen] = useState(false);
    const [create_group, setCreateGroup] = useState(false);
    const { styles } = useStyle();
    const [form_group] = Form.useForm();

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };


    const handleCancel = () => {
        setOpen(false);
    };

    const handleCreateGroup = (values: any) => {

    };

    const showCreateGroup = () => {
        setCreateGroup(true);
    };

    const cancelCreateGroup = () => {
        setCreateGroup(false);
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
                        <p>Selected {props.dataSelected?.length} customer</p>
                        <Button>Send Email</Button>
                        <Button>Send SMS</Button>
                        <Button onClick={showCreateGroup}>Create Group</Button>
                        <Button icon={<EllipsisOutlined />} />
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
            title="Add new customer"
            open={open}
            onOk={handleOk}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            footer={null}
        >
            <AddCustomerForm afterSubmit={handleOk} afterCancel={handleCancel} />
        </Modal>


        <Modal
            title="Create new group"
            open={create_group}
            onCancel={cancelCreateGroup}
            footer={null}
        >
            <Form form={form_group} name="form_group" variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleCreateGroup}>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Name" name="group_name" required rules={[{ required: true, message: 'Please input the group name !' }]}>
                            <Input placeholder='Group name' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label="Description" name="desc" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                            <Input placeholder='Group description' />
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Type" name="type" required rules={[{ required: true, message: 'Please select the group type !' }]}>
                            <Select>
                                <Select.Option value="newsletter">Newsletter</Select.Option>
                                <Select.Option value="email">Email</Select.Option>
                                <Select.Option value="welcome">Welcome</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                    <Form.Item label="Count" name="count" required rules={[{ required: true, message: 'Please input the count !' }]}>
                            <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                    </div>
                </div>


                <Form.Item>
                    <div className='flex justify-end space-x-2'>
                        <Button type="default" htmlType="reset" onClick={cancelCreateGroup}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>


    </main >
}
