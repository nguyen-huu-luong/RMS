import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
import TimeStamp from "./Timestamp";
import Message from "./Message";
import Status from "./Status";
import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import axios from "axios";
import fetchClient from "@/lib/fetch-client";
export const seenMessage = async (token: any, id: string) => {
    try {
        const response = await axios.put(
            `http://localhost:3003/api/channels`,
            { id: id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const sendMessage = async (token: any, requestBody: object) => {
    try {
        await axios.post(
            `http://localhost:3003/api/channels/admin`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

const ChatBox = ({
    channel,
    setChannel,
    socket,
    setIndex,
    index,
}: {
    channel: any;
    setChannel: any;
    socket: any;
    setIndex: any;
    index: any;
}) => {
    const [value, setValue] = useState("");
    const [data, setData] = useState<any>(null);
    const [inputFocused, setInputFocused] = useState(false);
    const fetchData = useCallback(async () => {
        try {
            const fetchedData = await fetchClient({
                url: `/channels/messages/admin?channelId=${channel}&index=${
                    !index ? 1 : index
                }`,
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
            scrollToTop();
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [channel, index]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const handleNewMessage = (
            channelId: any,
            message: string,
            clientId: string
        ) => {
            if (channelId == channel) {
                setData((prevData: any) => ({
                    ...prevData,
                    message: [
                        ...prevData.message,
                        {
                            content: message,
                            createdAt: new Date(),
                            employeeId: null,
                            clientId: clientId,
                            status: "Not seen",
                        },
                    ],
                }));
                scrollToBottom();
            }
        };
        const handleSeenMessage = (channelId: any) => {
            if (channelId == channel) {
                if (!data || !data.message || data.message.length === 0) {
                    return;
                }
                const newData = { ...data };
                const lastMessage = newData.message[newData.message.length - 1];
                if (lastMessage.status === "Not seen") {
                    lastMessage.status = "Seen";
                    setData(newData);
                }
            }
        };
        socket.on("message:send:fromClient", handleNewMessage);
        socket.on("message:read:fromClient", handleSeenMessage);
        return () => {
            socket.off("message:send:fromClient", handleNewMessage);
            socket.off("message:read:fromClient", handleSeenMessage);
        };
    }, [socket, channel, data]);

    const handleFocus = () => {
        viewMessage();
        setInputFocused(true);
    };

    const handleBlur = () => {
        setInputFocused(false);
    };

    const scrollToBottom = () => {
        const messageBody = document.getElementById("messageBody");
        messageBody?.scrollTo(0, messageBody.scrollHeight);
    };

    const scrollToTop = () => {
        const messageBody = document.getElementById("messageBody");
        messageBody?.scrollTo({ top: 20, behavior: "smooth" });
    };

    const send = async (e: any) => {
        e.preventDefault();
        try {
            await fetchClient({
                url: `/channels/admin`,
                method: "POST",
                body: {
                    content: value,
                    channelId: channel,
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
                        employeeId: "1",
                        status: "Not seen",
                    },
                ],
            }));
            socket.emit("staff:message:send", data.channel, value, value);
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const viewMessage = async () => {
        await fetchClient({
            url: `/channels`,
            method: "PUT",
            body: { id: channel },
        });
        socket.emit("staff:message:read", data.channel);
        setValue("");
        scrollToBottom();
    };
    if (channel === -1) return "Choose customer to chat";
    if (!data) return "loading";
    scrollToBottom();
    return (
        <div
            className={` bg-white border-primary rounded-md border-2 border-opacity-25 flex flex-col justify-between overflow-hidden shadow-lg w-full h-full bottom-5 right-5 z-50`}
        >
            <div className='header h-10 w-full text-white bg-primary items-center flex flex-row justify-between p-2 font-bold border-b-white border-b-2'>
                <span>Chat</span>
            </div>
            <div
                id='messageBody'
                className='body w-full grow font-normal text-sm overflow-auto max-h-full flex flex-col justify-start gap-2 px-2 py-2'
            >
                <button onClick={() => setIndex((index: any) => index + 1)}>
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
                        index === data.message.length - 1 &&
                        item.employeeId !== null;
                    return (
                        <>
                            {(display || index == 0) && (
                                <TimeStamp time={item.createdAt} />
                            )}
                            <Message
                                params={{
                                    content: item.content,
                                    employee:
                                        item.employeeId == null ? false : true,
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
                    onChange={(e) => setValue(e.currentTarget.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={async (e) =>
                        e.key === "Enter" ? await send(e) : {}
                    }
                    className='chat bg-primary-100 w-full h-full border-0 focus:outline-none px-2 py-2'
                    placeholder='Enter text'
                />
                <span className='text-primary' onClick={(e) => send(e)}>
                    <SendOutlined
                        style={{ fontSize: "1.4rem" }}
                        className='hover:cursor-pointer'
                    />
                </span>
            </div>
        </div>
    );
};

export default ChatBox;
