"use client";
import ChatList from "@/components/Chat/ChatList";
import ChatBox from "@/components/Chat/ChatRoom";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { message } from "antd";
import useSocket from "@/socket";
function Chat(props: any) {
    const [channel, setChannel] = useState(-1);
    const [index, setIndex] = useState<number>(1);
    const { data: session, status } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const socket = useSocket();
    return (
        <>
            {socket != null ? (
                <div className='flex flex-row w-full p-5 gap-5 h-[650px]'>
                    <div className='basis-1/4 w-full h-full shadow-md bg-white rounded-2xl flex flex-col justify-start gap-1'>
                        <ChatList
                            socket={socket}
                            setChannel={setChannel}
                            setIndex={setIndex}
                            staffId={session?.user.id}
                        ></ChatList>
                    </div>
                    <div className='basis-3/4 bg-white rounded-2xl shadow-md'>
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
