"use client";
import ChatList from "@/components/Chat/ChatList";
import ChatBox from "@/components/Chat/ChatRoom";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next-intl/client";
import { message } from "antd";
import useSocket from "@/socket";

function Chat() {
    const [channel, setChannel] = useState(-1);
    const router = useRouter()
    const [index, setIndex] = useState<number>(1);
    const { data: session, status } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const socket = useSocket();
    const success = () => {
        messageApi.success(`Join channel ${1} successfully!`);
    };
    return (
        <>
            {socket != null ? (
                <div className='flex flex-row w-full p-5 gap-5 h-[350px]'>
                    <div className='basis-1/4 w-full h-full bg-white rounded-2xl flex flex-col justify-start gap-1'>
                        <ChatList
                            socket={socket}
                            setChannel={setChannel}
                            setIndex={setIndex}
                            staffId={session?.user.id}
                        ></ChatList>
                    </div>
                    <div className='basis-3/4 bg-white rounded-2xl '>
                        {channel !== -1 ? (
                            <ChatBox
                                socket={socket}
                                channel={channel}
                                setChannel={setChannel}
                                index={index}
                                setIndex={setIndex}

                            />
                        ) : (
                        ""
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default Chat;
