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
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJmdWxsTmFtZSI6IlN0YWZmIFN0YWZmIiwiZW1haWwiOiJKZWZmZXJleV9Xb2xmODJAZ21haWwuY29tIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNzA4MjIxMDEzLCJleHAiOjE3MDgyODEwMTN9.JBFFbfcYdollinXrih75xB0nlRWnbhFcwE64L4gPLGQ",
            },
        });
        socketClient.on("connect", () => {
            setSocket(socketClient);
            console.log("Connected to socket server");
        });
        socketClient.on("message:send:fromClient", (channelId, message) => {
            console.log(channelId + " " + message);
        });
        socketClient.on("message:send:fromStaff", (channelId, message) => {
            console.log(channelId + " " + message);
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
