"use client";
import ChatList from "@/components/Chat/ChatList";
import ChatBox from "@/components/Chat/ChatRoom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
function Chat() {
    const [channel, setChannel] = useState(-1);
    const [socket, setSocket] = useState<any>(null);
    useEffect(() => {
        const socketClient = io("http://localhost:3003", {
            auth: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJmdWxsTmFtZSI6IlN0YWZmIFN0YWZmIiwiZW1haWwiOiJBbHRoZWEzN0B5YWhvby5jb20iLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE3MDkwNDI0MzMsImV4cCI6MTcwOTEwMjQzM30.RSQ2BNao_cNi8PQxiEt9uL0Wqdbp2g49pudiYxl3dSI",
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
                        ></ChatList>
                    </div>
                    <div className='basis-3/4 bg-white rounded-2xl'>
                        {channel !== -1 ? (
                            <ChatBox
                                socket={socket}
                                channel={channel}
                                setChannel={setChannel}
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
