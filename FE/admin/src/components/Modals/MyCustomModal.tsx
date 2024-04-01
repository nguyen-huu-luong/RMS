"use client"
import { EllipsisOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Input, MenuProps, Modal, ModalProps, Popconfirm, Space, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { AddCustomerForm } from "../AddCustomerForm";
import { createStyles } from 'antd-style';
import axios from "axios";
import Link from "next/link";

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
export interface ICustomModal extends ModalProps {

}

export const CustomModal: React.FC<ICustomModal> = (props) => {
    const { styles } = useStyle();

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

    return (<Modal
        {...props}
        styles={{...modalStyles, ...props.styles}}
        classNames={{...classNames, ...props.classNames}}
    >
        {props.children}
    </Modal>)
}
