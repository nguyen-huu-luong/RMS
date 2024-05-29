"use client";
import Message from "@/components/chat/message";
import moment from "moment";
import { SendOutlined } from "@ant-design/icons";

import useAnonymousSocket from "@/anonymous";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { message } from "antd";
import SendStatus from "@/components/chat/send_status";
export default function Chat() {
    const socket = useAnonymousSocket();
    const t = useTranslations("Chat");
    const [sending, setSending] = useState<boolean>(false);
    const [data, setData] = useState<any>({
        channel: 1,
        message: [
            {
                id: 1,
                content: t("Welcome1"),
                status: "Not seen",
                createdAt: new Date(),
                updatedAt: new Date(),
                clientId: null,
                employeeId: 1,
                channelId: 1,
            },
            {
                id: 2,
                content: t("Welcome2"),
                status: "Not seen",
                createdAt: new Date(),
                updatedAt: new Date(),
                clientId: null,
                employeeId: 1,
                channelId: 1,
            },
            {
                id: 3,
                content: t("Welcome3"),
                status: "Not seen",
                createdAt: new Date(),
                updatedAt: new Date(),
                clientId: null,
                employeeId: 1,
                channelId: 1,
            },
        ],
    });
    const [value, setValue] = useState("");

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (
            channelId: string,
            message: string,
            employeeId: string
        ) => {
            setData((prevData: any) => ({
                ...prevData,
                message: [
                    ...prevData.message,
                    {
                        content: message,
                        createdAt: new Date(),
                        clientId: null,
                        employeeId: employeeId,
                    },
                ],
            }));
        };

        socket.on("message:send:fromStaff", handleNewMessage);
        socket.on("connect_error", (error: any) => {
            console.log(error);
        });
        return () => {
            socket.off("message:send:fromStaff", handleNewMessage);
        };
    }, [socket]);
    const send = async (e: any) => {
        e.preventDefault();
        try {
            if (value != "") {
                e.preventDefault();
                setSending(true);
                setValue("");
                setData((prevData: any) => ({
                    ...prevData,
                    message: [
                        ...prevData.message,
                        {
                            content: value,
                            createdAt: new Date(),
                            clientId: 1,
                            status: "Not seen",
                        },
                    ],
                }));
                const response = await socket.emitWithAck(
                    "anonymousclient:message:send",
                    value,
                    Cookies.get("socketId")
                        ? Cookies.get("socketId")
                        : socket.id
                );
                if (!response.status) {
                    message.error("Sending message failed!");
                }
                setSending(false);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    if (!socket) return <Loading />;
    return (
        <div
            className={`w-full h-[500px] bg-white border-primary rounded-md border-2 border-opacity-25 flex flex-col justify-between overflow-hidden shadow-lg`}
        >
            <div className='header h-10 w-full text-white bg-primary items-center flex flex-row justify-between p-2 font-bold border-b-white border-b-2'>
                <span>{t("Chat")}</span>
            </div>
            <div className='body w-full grow font-normal text-sm overflow-auto max-h-full flex flex-col justify-start gap-2 px-2 py-2'>
                {data.message.map((item: any, index: number) => {
                    const hasPreviousMessage = index > 0;
                    const currentTime = moment(item.createdAt);
                    const previousTime = hasPreviousMessage
                        ? moment(data.message[index - 1].createdAt)
                        : null;
                    const display =
                        hasPreviousMessage &&
                        currentTime.diff(previousTime, "minutes") >= 10;
                    const lastMessage =
                        index == data.message.length - 1 &&
                        item.clientId != null;
                    return (
                        <>
                            <Message
                                params={{
                                    content: item.content,
                                    client:
                                        item.clientId == null ? false : true,
                                    time: item.createdAt,
                                }}
                            />
                        </>
                    );
                })}
                {sending && <SendStatus />}
            </div>
            <div className='footer h-10 w-full bg-primary-100 items-center flex flex-row justify-between p-2 font-medium text-base'>
                <input
                    id='message'
                    value={value}
                    onChange={(e) => {
                        setValue(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => (e.key === "Enter" ? send(e) : {})}
                    className='chat bg-primary-100 w-full h-full border-0 focus:outline-none px-2 py-2'
                    placeholder={t("Enter")}
                ></input>
                <span className='text-primary' onClick={(e) => send(e)}>
                    <SendOutlined
                        style={{
                            fontSize: "1.4rem",
                        }}
                        className='hover:cursor-pointer'
                    />{" "}
                </span>
            </div>
        </div>
    );
}
