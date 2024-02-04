"use client";
import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
import TimeStamp from "./Timestamp";
import Message from "./Message";
import Status from "./Status";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import moment from "moment";
import axios from "axios";
import { mutate } from "swr";

const messageFetcher = async (url: string, token: any) => {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.json();
    } catch (error) {
        console.log(error);
    }
};
const sendMessage = async (token: any, requestBody: object) => {
    try {
        const response = await axios.post(
            `http://localhost:3003/api/channels`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        mutate([`http://localhost:3003/api/channels/messages`, token]);
        mutate([`http://localhost:3003/api/channels`, token]);

        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};
const aToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJmdWxsTmFtZSI6IlN0YWZmIFN0YWZmIiwiZW1haWwiOiJKYW5pY2tfS3VwaGFsNkB5YWhvby5jb20iLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE3MDY4MDQ3MzYsImV4cCI6MTcwNjgxMDczNn0.EYV7Q0S9G4UsUJuS2Qszxv56DuaE8p7h6CXQfiCnk8c";
const ChatBox = ({
    channel,
    setChannel,
}: {
    channel: any;
    setChannel: any;
}) => {
    const [value, setValue] = useState("");
    const getKey = (pageIndex: number) => {
        return [
            `http://localhost:3003/api/channels/messages?size=10&page=${
                pageIndex + 1
            }&channelId=${channel}`,
            aToken,
        ];
    };
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
        getKey,
        ([url, token]) => messageFetcher(url, token)
    );

    if (!data) return "loading";
    const send = async (e: any) => {
        e.preventDefault();
        await sendMessage(aToken, {
            content: value,
            channelId: channel,
            status: "Not seen",
        });
        mutate();
        setValue("");
        scrollToBottom();
    };
    const scrollToBottom = () => {
        const messageBody = document.getElementById("messageBody");
        messageBody?.scrollTo(0, messageBody.scrollHeight);
    };

    if (error) return <div>Error loading messages</div>;
    if (channel == 0) return "Choose customer to chat";

    return (
        <div
            className={` bg-white border-primary rounded-md border-2 border-opacity-25 flex flex-col justify-between overflow-hidden shadow-lg w-full h-full bottom-5 right-5 z-50`}
        >
            <div className='header h-10 w-full text-white bg-primary items-center flex flex-row justify-between p-2 font-bold border-b-white border-b-2'>
                <span>Live chat</span>
            </div>
            <div
                id='messageBody'
                className='body w-full grow font-normal text-sm overflow-auto max-h-full flex flex-col justify-start gap-2 px-2 py-2'
            >
                <button onClick={() => setSize(size + 1)}>Load More</button>
                {data[data.length - 1].message.map(
                    (item: any, index: number) => {
                        const hasPreviousMessage = index > 0;
                        const currentTime = moment(item.createdAt);
                        const previousTime = hasPreviousMessage
                            ? moment(
                                  data[data.length - 1].message[index - 1]
                                      .createdAt
                              )
                            : null;
                        const display =
                            hasPreviousMessage &&
                            currentTime.diff(previousTime, "minutes") >= 10;
                        const lastMessage =
                            index == data[data.length - 1].message.length - 1 &&
                            item.employeeId != null;
                        return (
                            <>
                                {(display || index == 0) && (
                                    <TimeStamp time={item.createdAt} />
                                )}
                                <Message
                                    params={{
                                        content: item.content,
                                        employee:
                                            item.employeeId == null
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
                    }
                )}
                {isValidating && <div>Sending message...</div>}
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
    );
};

export default ChatBox;
