"use client";
import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
import TimeStamp from "./timestamp";
import Message from "./message";
import Status from "./status";
import styles from "@/app/styles.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment";
import useSocket from "@/socket";
import fetchClient from "@/lib/fetch-client";
import Loading from "../loading";

const ChatBox = ({ params }: { params: { show: boolean; setShow: any } }) => {
    const socket = useSocket();
    const [inputFocused, setInputFocused] = useState(false);
    const [data, setData] = useState<any>(null);
    const [index, setIndex] = useState<number>(1);
    const { data: session, status } = useSession();
    const [value, setValue] = useState("");
    const router = useRouter();
    const fetchData = useCallback(async () => {
        try {
            const fetchedData = await fetchClient({
                url: `/channels/messages?index=${!index ? 1 : index}`,
                data_return: true,
            });
            if (index == 1) {
                setData(fetchedData);
            } else {
                setData((prevData: any) => ({
                    ...prevData,
                    message: [...fetchedData.message, ...prevData.message],
                }));
                scrollToTop();
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }, [status, index]);

    const scrollToBottom = () => {
        const messageBody = document.getElementById("messageBody");
        messageBody?.scrollTo({
            top: messageBody.scrollHeight + 10,
            behavior: "smooth",
        });
    };

    const scrollToTop = () => {
        const messageBody = document.getElementById("messageBody");
        messageBody?.scrollTo({ top: 20, behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [params.show]);
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") router.push("/signin");
        fetchData();
    }, [status, index]);

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
            scrollToBottom();
        };

        const handleSeenMessage = (channelId: any) => {
            console.log(data);
            if (!data) {
                return;
            }
            const newData = { ...data };
            const lastMessage = newData.message[newData.message.length - 1];
            if (lastMessage.status === "Not seen") {
                lastMessage.status = "Seen";
                setData(newData);
            }
        };

        socket.on("message:send:fromStaff", handleNewMessage);
        socket.on("message:read:fromStaff", handleSeenMessage);
        socket.on("connect_error", (error: any) => {
            console.log(error);
        });
        return () => {
            socket.off("message:send:fromStaff", handleNewMessage);
            socket.off("message:read:fromStaff", handleSeenMessage);
        };
    }, [socket]);

    const handleFocus = () => {
        viewMessage();
        setInputFocused(true);
    };

    const handleBlur = () => {
        setInputFocused(false);
    };

    const send = async (e: any) => {
        e.preventDefault();
        try {
            if (value != "") {
                e.preventDefault();
                await fetchClient({
                    url: `/channels`,
                    method: "POST",
                    body: {
                        content: value,
                        status: "Not seen",
                    },
                });
                setValue("");
                setData((prevData: any) => ({
                    ...prevData,
                    message: [
                        ...prevData.message,
                        {
                            content: value,
                            createdAt: new Date(),
                            clientId: session?.user.id,
                            status: "Not seen",
                        },
                    ],
                }));
                socket.emit(
                    "client:message:send",
                    data.channel,
                    value,
                    session?.user.id
                );
                scrollToBottom();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    const viewMessage = async () => {
        await fetchClient({ url: `/channels`, method: "put", body: {} });
        socket.emit("client:message:read", data.channel);
        setValue("");
        scrollToBottom();
    };
    if (!data) return;
    return (
        <div
            id='chat-popup'
            className={`${styles.chat} w-64 h-80 bg-white border-primary rounded-md border-2 border-opacity-25 flex flex-col justify-between overflow-hidden shadow-lg fixed bottom-5 right-5 z-50`}
        >
            <div className='header h-10 w-full text-white bg-primary items-center flex flex-row justify-between p-2 font-bold border-b-white border-b-2'>
                <span>Live chat</span>
                <span onClick={() => params.setShow(false)}>
                    <FullscreenExitOutlined
                        style={{
                            fontSize: "1.4rem",
                        }}
                        className='hover:cursor-pointer'
                    />
                </span>
            </div>
            <div
                id='messageBody'
                className='body w-full grow font-normal text-sm overflow-auto max-h-full flex flex-col justify-start gap-2 px-2 py-2'
            >
                <button onClick={() => setIndex((index) => index + 1)}>
                    {" "}
                    Load more{" "}
                </button>
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
                            {(display || index == 0) && (
                                <TimeStamp time={item.createdAt} />
                            )}
                            <Message
                                params={{
                                    content: item.content,
                                    client:
                                        item.clientId == null ? false : true,
                                    time: item.createdAt,
                                }}
                            />
                            {lastMessage && (
                                <Status read={item.status != "Not seen"} />
                            )}
                        </>
                    );
                })}
            </div>
            <div className='footer h-10 w-full bg-primary-100 items-center flex flex-row justify-between p-2 font-medium text-base'>
                <input
                    id='message'
                    value={value}
                    onChange={(e) => {
                        setValue(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => (e.key === "Enter" ? send(e) : {})}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className='chat bg-primary-100 w-full h-full border-0 focus:outline-none px-2 py-2'
                    placeholder='Enter text'
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
};

export default ChatBox;
