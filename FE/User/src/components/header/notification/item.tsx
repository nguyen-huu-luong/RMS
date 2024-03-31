"use client";
import React from "react";
import {
    CarOutlined,
    FileDoneOutlined,
    FileOutlined,
    FireOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Steps, ConfigProvider, Modal } from "antd";
import moment from "moment";

const Item = ({
    params,
}: {
    params: {
        orderId: number;
        step: number;
        status: boolean;
        time: string;
    };
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const items: any = [
        [
            {
                title: "Pending",
                status: "finish",
                icon: <FileOutlined />,
            },
            {
                title: "Preparing",
                status: "process",
                icon: <LoadingOutlined />,
            },
            {
                title: "Delivering",
                status: "wait",
                icon: <CarOutlined />,
            },
            {
                title: "Done",
                status: "wait",
                icon: <FileDoneOutlined />,
            },
        ],
        [
            {
                title: "Pending",
                status: "finish",
                icon: <FileOutlined />,
            },
            {
                title: "Preparing",
                status: "finish",
                icon: <FireOutlined />,
            },
            {
                title: "Delivering",
                status: "process",
                icon: <LoadingOutlined />,
            },
            {
                title: "Done",
                status: "wait",
                icon: <FileDoneOutlined />,
            },
        ],
        [
            {
                title: "Pending",
                status: "finish",
                icon: <FileOutlined />,
            },
            {
                title: "Preparing",
                status: "finish",
                icon: <FireOutlined />,
            },
            {
                title: "Delivering",
                status: "finish",
                icon: <CarOutlined />,
            },
            {
                title: "Done",
                status: "finish",
                icon: <FileDoneOutlined />,
            },
        ],
        [
            {
                title: "Pending",
                status: "error",
                icon: <FileOutlined />,
            },
            {
                title: "Preparing",
                status: "wait",
                icon: <FireOutlined />,
            },
            {
                title: "Delivering",
                status: "wait",
                icon: <CarOutlined />,
            },
            {
                title: "Done",
                status: "wait",
                icon: <FileDoneOutlined />,
            },
        ],
    ];
    const items_text: any = [
        "has been accepted and preparing by chefs",
        "is now delivering",
        "has been delivered",
        "has been rejected",
    ];
    return (
        <>
            <div
                className={`p-2 w-full rounded-lg ${
                    params.status
                        ? "bg-slate-100 hover:bg-slate-200"
                        : "hover:bg-slate-50"
                } h-auto hover:cursor-pointer transition-all duration-300 flex flex-row items-center justify-between gap-2 font-normal`}
                onClick={showModal}
            >
                <div
                    className={`w-60 h-16 text-wrap overflow-hidden ${
                        params.status ? "font-semibold" : ""
                    }`}
                >
                    Order #{params.orderId} {items_text[params.step]}!
                </div>
                <div className='text-sm w-20 whitespace-nowrap overflow-hidden flex flex-row justify-center items-center'>
                    {moment(params.time).format("LT")}
                </div>
            </div>
            <Modal
                title={`Order ${params.orderId}`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <div className='p-4 flex flex-col justify-start gap-4'>
                    <div className=''>
                        Order #{params.orderId} {items_text[params.step]}!
                    </div>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: "#EA6A12",
                                colorPrimaryBorder: "rgb(251, 146, 60)",
                                colorSplit: "rgb(255, 247, 237)",
                                fontWeightStrong: 600,
                            },
                        }}
                    >
                        <Steps items={items[params.step]} />
                    </ConfigProvider>
                </div>
            </Modal>
        </>
    );
};

export default Item;
