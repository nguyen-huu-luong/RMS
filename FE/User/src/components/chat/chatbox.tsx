"use client";
import {
    FileImageOutlined,
    FullscreenExitOutlined,
    SendOutlined,
} from "@ant-design/icons";
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
import { Spin, Upload, UploadProps, message } from "antd";
import { uploadImage } from "@/app/api/upload/image";

const ChatBox = ({
    params,
}: {
    params: { show: boolean; setShow: any; setUnread: any };
}) => {
    const socket = useSocket();
    const [inputFocused, setInputFocused] = useState(false);
    const [data, setData] = useState<any>({
        channel: {},
        message: [],
        isAll: true,
    });
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(1);
    const { data: session, status } = useSession();
    const [value, setValue] = useState<string>("");
    const [action, setAction] = useState<string>("Default");
    const router = useRouter();

    // FETCHING DATA
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
                    isAll: fetchedData.isAll,
                }));
            }
            setIsAllLoaded(fetchedData.isAll);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, [status, index]);

    // SEND IMAGE
    const handleUpload = async ({
        file,
        onSuccess,
    }: {
        file?: any;
        onSuccess?: any;
    }) => {
        const image = await uploadImage(file, "Chat");
        if (image.url) {
            await fetchClient({
                url: `/channels`,
                method: "POST",
                body: {
                    content: image.url,
                    status: "Not seen",
                },
            });
            setData((prevData: any) => ({
                ...prevData,
                message: [
                    ...prevData.message,
                    {
                        content: image.url,
                        createdAt: new Date(),
                        clientId: session?.user.id,
                        status: "Not seen",
                    },
                ],
            }));
            await socket.emit(
                "client:message:send",
                data.channel,
                image.url,
                session?.user.id
            );
            setAction("Scroll");
        }
        onSuccess("ok");
    };

    const props: UploadProps = {
        name: "image",
        customRequest: handleUpload,
        onChange(info) {
            if (info.file.status === "done") {
                // mess.success(`Send image successfully`);
            } else if (info.file.status === "error") {
                message.error(`Send image failed.`);
            }
        },
    };

    // HANDLE SCROLL TO BOTTOM
    const scrollToBottom = () => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        setTimeout(() => scrollToBottom(), 500);
    }, [params.show]);

    // AUTHENTICATING
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") router.push("/signin");
        fetchData();
    }, [status, index]);

    // SOCKET
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
            setAction("Scroll");
        };

        const handleSeenMessage = (channelId: any) => {
            if (data) {
                const newData = { ...data };
                const lastMessage = newData.message[newData.message.length - 1];
                if (lastMessage.status === "Not seen") {
                    lastMessage.status = "Seen";
                    setData(newData);
                }
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
    }, [socket, data]);

    // HANDLE SCROLL WHEN RECEIVE MESSAGE
    useEffect(() => {
        if (action === "Scroll") {
            scrollToBottom();
            setAction("Default");
        }
    }, [data]);

    // HANDLE SCROLL FOR LOADING MORE
    const loadMore = () => {
        if (loading || isAllLoaded) return;
        setLoading(true);
        setIndex((prevIndex) => prevIndex + 1);
    };
    const handleScroll = () => {
        const container = messageContainerRef.current;
        if (container) {
            if (container.scrollTop === 0) {
                loadMore();
            }
        }
    };
    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            if (loading || isAllLoaded) {
                const addedContentHeight =
                    container.scrollHeight - container.clientHeight;
                container.scrollTo({
                    top: container.scrollTop + addedContentHeight / 2,
                    behavior: "smooth",
                });
            }
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [loading, isAllLoaded]);

    // FOCUS TEXT
    const handleFocus = () => {
        viewMessage();
        setInputFocused(true);
    };

    const handleBlur = () => {
        setInputFocused(false);
    };

    // SENDING MESSAGE
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
                await socket.emit(
                    "client:message:send",
                    data.channel,
                    value,
                    session?.user.id
                );
                setAction("Scroll");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // VIEW MESSAGE
    const viewMessage = async () => {
        await fetchClient({ url: `/channels`, method: "put", body: {} });
        await socket.emit("client:message:read", data.channel);
        setValue("");
        params.setUnread(0);
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
                ref={messageContainerRef}
            >
                {loading && <Spin size='small'></Spin>}
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
                <span className='text-primary'>
                    <Upload
                        {...props}
                        maxCount={1}
                        showUploadList={false}
                        accept='image/*'
                        style={{ color: "aqua" }}
                    >
                        <FileImageOutlined
                            style={{ fontSize: "1.4rem", color: "#EA6A12", marginRight: 10 }}
                            className='hover:cursor-pointer'
                        />
                    </Upload>
                </span>
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
