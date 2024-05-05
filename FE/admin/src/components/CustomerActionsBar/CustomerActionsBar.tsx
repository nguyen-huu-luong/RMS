"use client"
import { EllipsisOutlined, InfoCircleOutlined, PlusCircleOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Input, MenuProps, Modal, Space, Tooltip, Form, Select, InputNumber } from "antd";
import React, { useState } from "react";
import { AddCustomerForm } from "../AddCustomerForm";
import { createStyles, useTheme } from 'antd-style';
import { SendEmailModal } from "../Modals/SendEmailModal";
import { SendSMSModal } from "../Modals/SendSMSModal";
import { CustomModal } from "../Modals/MyCustomModal";

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
    const { styles } = useStyle();
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const handleCreateGroup = (values: any) => {

    };

    const showCreateGroup = () => {
        // setCreateGroup(true);
    };

    const cancelCreateGroup = () => {
        // setCreateGroup(false);
    };

    const  handleDeleteCustomers =  () => {
        
    }


    return <main className="bg-white w-full py-2 px-3 my-2 rounded-md border">
        <Flex>
            {
                (props.dataSelected && props.dataSelected?.length > 0) ?
                    <Space>
                        <p>Selected {props.dataSelected?.length} customer</p>
                        <Button className="bg-primary" type="primary" onClick={showCreateGroup}>Create Group</Button>
                        <SendEmailModal emailLists={props.dataSelected.map((item) => item.email)}/>
                        {/* <Button icon={<EllipsisOutlined />} /> */}
                        <Button danger onClick={handleDeleteCustomers}>Delete {props.dataSelected.length} customers</Button>
                    </Space> :
                    <Space>
                        <Input
                            placeholder="Enter keywork to search...."
                            prefix={<SearchOutlined className="site-form-item-icon px-2 text-gray-500" />}
                            className="flex items-center"
                        />
                    </Space>

            }
        </Flex>
    </main >
}
