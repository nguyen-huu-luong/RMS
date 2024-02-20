"use client";
import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
import TimeStamp from "./timestamp";
import Message from "./message";
import Status from "./status";
import styles from "@/app/styles.module.css";
import {
    messageFetcher,
    sendMessage,
    viewMessage,
} from "@/app/api/chat/message";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useState, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import moment from "moment";
import { io } from "socket.io-client";
import useSWR from "swr";

let socket: any;
const ChatBox = ({ params }: { params: { show: boolean; setShow: any } }) => {
    const [socket, setSocket] = useState<any>(null);

    const locale = useLocale();
    const { data: session, status } = useSession();

    const [value, setValue] = useState("");
    const router = useRouter();

    // const getKey = (pageIndex: number) => {
    //     return session
    //         ? [
    //               `http://localhost:3003/api/channels/messages?size=10&page=${
    //                   pageIndex + 1
    //               }`,
    //               session.user.accessToken,
    //           ]
    //         : null;
    // };
    // const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    //     getKey,
    //     ([url, token]) => messageFetcher(url, token)
    // );
    if (status === "loading" && params.show) return <>Loading.....</>;
    if (status === "unauthenticated" && params.show) router.push("/signin");
    const {
        data,
        error: channelsError,
        isLoading: channelsLoading,
        mutate,
    } = useSWR(
        [
            `http://localhost:3003/api/channels/messages`,
            session?.user.accessToken,
        ],
        ([url, token]) => messageFetcher(url, token)
    );
    const scrollToBottom = () => {
        const messageBody = document.getElementById("messageBody");
        messageBody?.scrollTo(0, messageBody.scrollHeight);
    };
    useEffect(() => {
        if (!session?.user.accessToken) {
            return;
        }
        console.log(session?.user.accessToken);

        const socketClient = io("http://localhost:3003", {
            auth: {
                token: session?.user.accessToken,
            },
        });
        socketClient.on("connect", () => {
            setSocket(socketClient);
            console.log("Connected to socket server");
        });
        socketClient.on(
            "message:send:fromStaff",
            (channelId: any, message: string) => {
                console.log("Receive message")
                mutate();
                scrollToBottom();
            }
        );
        // socketClient.on(
        //     "message:read:fromStaff",
        //     (channelId: any) => {
        //         console.log("Staff read your message")
        //         viewMessage(session?.user.accessToken);
        //         mutate()
        //     }
        // );
        socketClient.on("connect_error", (error: any) => {
            console.log(error);
        });
        socketClient.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });
        return () => {
            socketClient.disconnect();
        };
    }, [session?.user.accessToken]);
    if (!data) return "loading";
    const send = async (e: any) => {
        e.preventDefault();
        await sendMessage(session?.user.accessToken, {
            content: value,
            status: "Not seen",
        });
        mutate();
        setValue("");
        scrollToBottom();
        socket.emit("client:message:send", data.channel, value);

    };
    const view = async () => {
        socket.emit("client:message:seen", data[0].channel);
        mutate();
        setValue("");
        scrollToBottom();
    };

    // if (error) return <div>Error loading messages</div>;
    if (channelsError) return <div>Failed to load</div>;
    if (channelsLoading) return <div>Loading...</div>;
    console.log(data);
    return (
        params.show && (
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
                    {/* <button onClick={() => setSize(size + 1)}>Load More</button> */}
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
                                            item.clientId == null
                                                ? false
                                                : true,
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
        )
    );
};

export default ChatBox;
