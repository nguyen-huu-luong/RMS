"use client";
import ChatList from "@/components/Chat/ChatList";
import ChatBox from "@/components/Chat/ChatRoom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const aToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiWmVsbWFfUG93bG93c2tpMzhAaG90bWFpbC5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTcwOTE5OTAzNSwiZXhwIjoxNzA5MjU5MDM1fQ.AcUhaqj-lVe8fhhcRzm1i3IMOn8132bTmHED0GYokyE';

function Chat() {
    const [channel, setChannel] = useState(-1);
    const [socket, setSocket] = useState<any>(null);
    useEffect(() => {
        const socketClient = io("http://localhost:3003", {
            auth: {
                token: aToken,
            },
        });
        socketClient.on("connect", () => {
            setSocket(socketClient);
            console.log("Connected to socket server");
        });
        socketClient.on("connect_error", (error: any) => {
            console.log(error);
        });
        socketClient.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });
        return () => {
            socketClient.disconnect();
        };
    }, []);
    return (
        <>
            {socket != null ? (
                <div className='flex flex-row h-96 w-full p-5 gap-5'>
                    <div className='basis-1/4 w-full h-full bg-white rounded-2xl flex flex-col justify-start gap-1'>
                        <ChatList
                            socket={socket}
                            setChannel={setChannel}
                            token={aToken}
                        ></ChatList>
                    </div>
                    <div className='basis-3/4 bg-white rounded-2xl'>
                        {channel !== -1 ? (
                            <ChatBox
                                socket={socket}
                                channel={channel}
                                setChannel={setChannel}
                                token={aToken}
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
