"use client";
import { MessageOutlined } from "@ant-design/icons";
import ChatBox from "./chat/chatbox";
import { useState } from "react";
import { messageFetcher } from "@/app/api/chat/message";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const ChatIcon = () => {
    const [popup, showPopup] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [data, setData] = useState<any>(null);
    const { data: session, status } = useSession();
    // const fetchData = async () => {
    //     try {
    //         if (session?.user.accessToken) {
    //             const fetchedData = await messageFetcher(
    //                 `http://localhost:3003/api/channels/messages`,
    //                 session?.user.accessToken
    //             );
    //             setData(fetchedData);
    //             calculateUnreadMessages(fetchedData.message);
    //         }
    //     } catch (error) {
    //         console.error("Failed to fetch data:", error);
    //     }
    // };

    const calculateUnreadMessages = (messages: any) => {
        let lastNotSeenIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].clientId !== null) {
                lastNotSeenIndex = i;
                break;
            }
        }
        for (let i = messages.length - 1; i >= lastNotSeenIndex; i--) {
            if (messages[i].status !== "Not seen") {
                lastNotSeenIndex = i;
                break;
            }
        }
        if (lastNotSeenIndex !== -1) {
            setUnreadMessages(messages.length - lastNotSeenIndex - 1);
        } else {
            setUnreadMessages(0);
        }
    };

    useEffect(() => {
        if (status === "loading") return;
        // fetchData();
    }, [status, popup]);
    return (
        <>
            <ChatBox params={{ show: popup, setShow: showPopup }}></ChatBox>{" "}
            {(unreadMessages > 0 && popup == false)  && (
                <div className='z-50 fixed bottom-4 right-4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center'>
                    {unreadMessages}
                </div>
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
        </>
    );
};

export default ChatIcon;
