import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Session } from "next-auth/core/types";
import { redirect } from "next/navigation";
import React from "react";
import {
    CarOutlined,
    FileDoneOutlined,
    FileOutlined,
    FireOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { Steps, ConfigProvider } from "antd";

const Profile: React.FC = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect(`/${"en"}/signin`);
    }
    const items: any = [
        [
            {
                title: "Pending",
                status: "finish",
                subTitle: '00:11',
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
    return (
        <>
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
                <Steps items={items[0]} />
                <Steps items={items[1]} />
                <Steps items={items[2]} />
                <Steps items={items[3]} />{" "}
            </ConfigProvider>
        </>
    );
};

export default Profile;
