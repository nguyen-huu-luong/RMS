"use client";
import { MessageOutlined } from "@ant-design/icons";
import ChatBox from "./chat/chatbox";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSocket from "@/socket";
import fetchClient from "@/lib/fetch-client";

const ChatIcon = () => {
    const [popup, showPopup] = useState(false);
    const [unread, setUnread] = useState<number>(0);
    const socket = useSocket();
    const { data: session, status } = useSession();
    const fetchData = async () => {
        try {
            if (status == "authenticated") {
                const data = await fetchClient({
                    url: `/channels/notseen`,
                    data_return: true,
                });
                setUnread(data.notSeenMessages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setTimeout(async () => {
            await fetchData();
        }, 1000);
    }, []);
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = async (
            channelId: string,
            message: string,
            employeeId: string
        ) => {
            setUnread((prev) => prev + 1);
        };
        socket.on("message:send:fromStaff", handleNewMessage);
        socket.on("connect_error", (error: any) => {
            console.log(error);
        });
        return () => {
            socket.off("message:send:fromStaff", handleNewMessage);
        };
    }, [socket]);
    if (status === "loading" || status === "unauthenticated") return;
    return (
        <>
            {popup ? (
                <ChatBox params={{ show: popup, setShow: showPopup, setUnread: setUnread }}></ChatBox>
            ) : (
                <></>
            )}
            <button
                onClick={() => showPopup(true)}
                className='shadow-xl z-40 fixed bottom-5 right-5 inline-flex items-center w-12 h-12 justify-center overflow-hidden transition-all bg-primary-white rounded-full hover:bg-primary-white group'
            >
                <span className='w-0 h-0 rounded-full bg-primary-400 absolute top-0 left-0 ease-out duration-500 transition-all group-hover:w-full group-hover:h-full -z-1'></span>
                <span className='w-full text-item-black transition-colors duration-300 ease-in-out group-hover:text-item-white z-10'>
                    <MessageOutlined style={{ fontSize: "1.4rem" }} />
                </span>
            </button>
            {!popup && (
                <div className='z-50 absolute bottom-5 right-5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-extralight text-xs'>
                    {unread}
                </div>
            )}
        </>
    );
};

export default ChatIcon;
