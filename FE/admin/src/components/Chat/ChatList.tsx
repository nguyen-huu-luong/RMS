"use client";
import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
import TimeStamp from "./Timestamp";
import Message from "./Message";
import Status from "./Status";
import { useRouter } from "next-intl/client";
// import useSWR from "swr";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import moment from "moment";
import axios from "axios";
import { mutate } from "swr";
import User from "./User";

const channelFetcher = async (url: string, token: any) => {
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


const aToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJmdWxsTmFtZSI6IlN0YWZmIFN0YWZmIiwiZW1haWwiOiJKYW5pY2tfS3VwaGFsNkB5YWhvby5jb20iLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE3MDY4MDQ3MzYsImV4cCI6MTcwNjgxMDczNn0.EYV7Q0S9G4UsUJuS2Qszxv56DuaE8p7h6CXQfiCnk8c";
const ChatList = ({setChannel}:{setChannel: any}) => {
    const {
        data: channels,
        error: channelsError,
        isLoading: channelsLoading,
    } = useSWR([`http://localhost:3003/api/channels`, aToken], ([url, token]) =>
        channelFetcher(url, token)
    );
    if (channelsError) return <div>Failed to load</div>;
    if (channelsLoading) return <div>Loading...</div>;
    return (
        <>
            <div
                className='header h-10 items-center align-middle w-full text-lg font-bold flex flex-row 
            justify-center border-b-2 border-primary border-opacity-10 shadow-sm'
            >
                <p>All customers</p>
            </div>
            <div
                className='search h-14 items-center align-middle w-full text-base font-medium flex flex-row 
            justify-center p-4'
            >
                <input
                    id='search'
                    type='text'
                    placeholder={"Enter name"}
                    className='rounded-full border-gray-100 font-normal
                                        border-2 text-placeholder pl-2 p-1 focus:bg-primary-white
                                        focus:cursor-text focus:border-primary outline-none focus:pr-2
                                        transition-all duration-500 transform w-full
                                        '
                />{" "}
            </div>
            <div className='w-80 h-fit flex flex-col justify-start overflow-y-auto'>
                {/* <TimeStamp time={"11:11"} /> */}
                {channels.channel.map((item: any, index: any) => {
                    return <User key={index} params={item} setChannel={setChannel}/>;
                })}
            </div>
        </>
    );
};

export default ChatList;
