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
import fetchClient from "@/lib/fetch-client";
import { useTranslations } from "next-intl";

const Item = ({
    params,
    setChild,
    mutate,
}: {
    params: {
        id: number;
        orderStatus: number;
        content: number;
        status: boolean;
        createdAt: string;
    };
    setChild: any;
    mutate: any;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const t = useTranslations("Noti");
    const showModal = async () => {
        setChild(true);
        setIsModalOpen(true);
        await fetchClient({
            url: `/notifications/${params.id}`,
            method: "PUT",
        });
        setTimeout(async () => {
            await mutate();
        }, 1000);
    };

    const handleOk = () => {
        setChild(false);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setChild(false);
        setIsModalOpen(false);
    };
    const items: any = [
        [
            {
                title: t("Pending"),
                status: "error",
                icon: <FileOutlined />,
            },
            {
                title: t("Preparing"),
                status: "wait",
                icon: <FireOutlined />,
            },
            {
                title: t("Delivering"),
                status: "wait",
                icon: <CarOutlined />,
            },
            {
                title: t("Done"),
                status: "wait",
                icon: <FileDoneOutlined />,
            },
        ],
        [
            {
                title: t("Pending"),
                status: "finish",
                icon: <FileOutlined />,
            },
            {
                title: t("Delivering"),
                status: "process",
                icon: <LoadingOutlined />,
            },
            {
                title: t("Delivering"),
                status: "wait",
                icon: <CarOutlined />,
            },
            {
                title:  t("Done"),
                status: "wait",
                icon: <FileDoneOutlined />,
            },
        ],
        [
            {
                title: t("Pending"),
                status: "finish",
                icon: <FileOutlined />,
            },
            {
                title: t("Delivering"),
                status: "finish",
                icon: <FireOutlined />,
            },
            {
                title: t("Delivering"),
                status: "process",
                icon: <LoadingOutlined />,
            },
            {
                title:  t("Done"),
                status: "wait",
                icon: <FileDoneOutlined />,
            },
        ],
        [
            {
                title: t("Pending"),
                status: "finish",
                icon: <FileOutlined />,
            },
            {
                title: t("Delivering"),
                status: "finish",
                icon: <FireOutlined />,
            },
            {
                title: t("Delivering"),
                status: "finish",
                icon: <CarOutlined />,
            },
            {
                title:  t("Done"),
                status: "finish",
                icon: <FileDoneOutlined />,
            },
        ],
    ];
    const items_text: any = [t("Text1"), t("Text2"), t("Text3"), t("Text4")];
    const status_splitter: any = (orderStatus: string) => {
        const order = orderStatus.split("-");
        return [parseInt(order[0]), parseInt(order[1])];
    };
    return (
        <>
            <div
                className={`p-2 w-full rounded-lg ${
                    !params.status
                        ? "bg-slate-100 hover:bg-slate-200"
                        : "hover:bg-slate-50"
                } h-auto hover:cursor-pointer transition-all duration-300 flex flex-row items-center justify-between gap-2 font-normal`}
                onClick={showModal}
            >
                <div
                    className={`w-60 h-16 text-wrap overflow-hidden ${
                        !params.status ? "font-semibold" : ""
                    }`}
                >
                    Order #{status_splitter(params.orderStatus)[0]}{" "}
                    {items_text[status_splitter(params.orderStatus)[1]]}!
                </div>
                <div className='text-sm w-20 whitespace-nowrap overflow-hidden flex flex-row justify-center items-center'>
                    {moment(params.createdAt).format("LT")}
                </div>
            </div>
            <Modal
                title={`Order ${status_splitter(params.orderStatus)[0]}`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <div className='p-4 flex flex-col justify-start gap-4'>
                    <div className=''>
                        Order #{status_splitter(params.orderStatus)[0]}{" "}
                        {items_text[status_splitter(params.orderStatus)[1]]}!
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
                        <Steps
                            items={
                                items[status_splitter(params.orderStatus)[1]]
                            }
                        />
                    </ConfigProvider>
                </div>
            </Modal>
        </>
    );
};

export default Item;
