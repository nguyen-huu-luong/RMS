// "use client";
// import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
// import TimeStamp from "./Timestamp";
// import Message from "./Message";
// import Status from "./Status";
// import { useState, useEffect } from "react";
// import useSWRInfinite from "swr/infinite";
// import moment from "moment";
// import axios from "axios";
// import { mutate } from "swr";
// import useSWR from "swr";

// const messageFetcher = async (url: string, token: any) => {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// };
// const sendMessage = async (token: any, requestBody: object) => {
//     try {
//         await axios.post(
//             `http://localhost:3003/api/channels/admin`,
//             requestBody,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );
//         await mutate(["http://localhost:3003/api/channels/admin", token]);
//     } catch (error) {
//         console.error("Error sending message:", error);
//         throw error;
//     }
// };
// const aToken =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiTGV4aWUuUmlwcGluQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzA4ODUzNzQ3LCJleHAiOjE3MDg5MTM3NDd9.KlQCrDyeObZGkRjuQqNp17a34JLJT9fTxt6toJehVQk";
// const ChatBox = ({
//     channel,
//     setChannel,
//     socket,
// }: {
//     channel: any;
//     setChannel: any;
//     socket: any;
// }) => {
//     const [value, setValue] = useState("");
//     // const getKey = (pageIndex: number) => {
//     //     return [
//     //         `http://localhost:3003/api/channels/messages/admin?size=10&page=${
//     //             pageIndex + 1
//     //         }&channelId=${channel}`,
//     //         aToken,
//     //     ];
//     // };
//     // const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
//     //     getKey,
//     //     ([url, token]) => messageFetcher(url, token)
//     // );
//     const {
//         data,
//         error: channelsError,
//         isLoading: channelsLoading,
//         mutate,
//     } = useSWR(
//         [
//             `http://localhost:3003/api/channels/messages/admin?channelId=${channel}`,
//             aToken,
//         ],
//         ([url, token]) => messageFetcher(url, token)
//     );
//     const scrollToBottom = () => {
//         const messageBody = document.getElementById("messageBody");
//         messageBody?.scrollTo(0, messageBody.scrollHeight);
//     };
//     useEffect(() => {
//         socket.on(
//             "message:send:fromClient",
//             (channelId: string, message: string) => {
//                 if (channelId == channel) {
//                     mutate();
//                     scrollToBottom();
//                 }
//             }
//         );
//     }, [socket, mutate, channel]);
//     if (!data) return "loading";
//     const send = async (e: any) => {
//         e.preventDefault();
//         await sendMessage(aToken, {
//             content: value,
//             channelId: channel,
//             status: "Not seen",
//         });
//         setValue("");
//         await mutate();
//         scrollToBottom();
//         socket.emit("staff:message:send", data.channel, value);
//     };

//     // if (error) return <div>Error loading messages</div>;
//     if (channel == -1) return "Choose customer to chat";
//     if (channelsError) return <div>Failed to load</div>;
//     if (channelsLoading) return <div>Loading...</div>;
//     return (
//         <div
//             className={` bg-white border-primary rounded-md border-2 border-opacity-25 flex flex-col justify-between overflow-hidden shadow-lg w-full h-full bottom-5 right-5 z-50`}
//         >
//             <div className='header h-10 w-full text-white bg-primary items-center flex flex-row justify-between p-2 font-bold border-b-white border-b-2'>
//                 <span>Live chat</span>
//             </div>
//             <div
//                 id='messageBody'
//                 className='body w-full grow font-normal text-sm overflow-auto max-h-full flex flex-col justify-start gap-2 px-2 py-2'
//             >
//                 {/* <button onClick={() => setSize(size + 1)}>Load More</button> */}
//                 {/* {data[data.length - 1].message.map( */}
//                 {data.message.map((item: any, index: number) => {
//                     const hasPreviousMessage = index > 0;
//                     const currentTime = moment(item.createdAt);
//                     const previousTime = hasPreviousMessage
//                         ? moment(
//                               //   data[data.length - 1].message[index - 1]
//                               data.message[index - 1].createdAt
//                           )
//                         : null;
//                     const display =
//                         hasPreviousMessage &&
//                         currentTime.diff(previousTime, "minutes") >= 10;
//                     const lastMessage =
//                         index == data.message.length - 1 &&
//                         // index == data[data.length - 1].message.length - 1 &&
//                         item.employeeId != null;
//                     return (
//                         <>
//                             {(display || index == 0) && (
//                                 <TimeStamp time={item.createdAt} />
//                             )}
//                             <Message
//                                 params={{
//                                     content: item.content,
//                                     employee:
//                                         item.employeeId == null ? false : true,
//                                     time: item.createdAt,
//                                 }}
//                             />
//                             {lastMessage && (
//                                 <Status read={item.status != "Not seen"} />
//                             )}
//                         </>
//                     );
//                 })}
//                 {/* {isValidating && <div>Sending message...</div>} */}
//             </div>
//             <div className='footer h-10 w-full bg-primary-100 items-center flex flex-row justify-between p-2 font-medium text-base'>
//                 <input
//                     id='message'
//                     value={value}
//                     onChange={(e) => {
//                         setValue(e.currentTarget.value);
//                     }}
//                     onKeyDown={async (e) =>
//                         e.key === "Enter" ? await send(e) : {}
//                     }
//                     className='chat bg-primary-100 w-full h-full border-0 focus:outline-none px-2 py-2'
//                     placeholder='Enter text'
//                 ></input>
//                 <span className='text-primary' onClick={(e) => send(e)}>
//                     <SendOutlined
//                         style={{
//                             fontSize: "1.4rem",
//                         }}
//                         className='hover:cursor-pointer'
//                     />{" "}
//                 </span>
//             </div>
//         </div>
//     );
// };

// export default ChatBox;

import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
import TimeStamp from "./Timestamp";
import Message from "./Message";
import Status from "./Status";
import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import axios from "axios";
import { mutate } from "swr";

const messageFetcher = async (url: string, token: any, index: any) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            params: {
                index: !index ? 1 : index,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

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
    token,
    setIndex,
    index,
}: {
    channel: any;
    setChannel: any;
    socket: any;
    token: any;
    setIndex: any;
    index: any;
}) => {
    const [value, setValue] = useState("");
    const [data, setData] = useState<any>(null);
    const [inputFocused, setInputFocused] = useState(false);
    const fetchData = useCallback(async () => {
        try {
            const fetchedData = await messageFetcher(
                `http://localhost:3003/api/channels/messages/admin?channelId=${channel}`,
                token,
                !index ? 1 : index
            );
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
    }, [channel, token, index]);

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
                // socket.emit("staff:message:read", channelId);
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
            await sendMessage(token, {
                content: value,
                channelId: channel,
                status: "Not seen",
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
            socket.emit("staff:message:send", data.channel, value, "1");
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const viewMessage = async () => {
        await seenMessage(token, channel);
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
                <button
                    onClick={() => setIndex((index: any) => index + 1)}
                > Load more </button>
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
