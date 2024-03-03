"use client";
import ChatList from "@/components/Chat/ChatList";
import ChatBox from "@/components/Chat/ChatRoom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const aToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJmdWxsTmFtZSI6IlN0YWZmIFN0YWZmIiwiZW1haWwiOiJOaWNvbGEuUHJpY2U4NUBob3RtYWlsLmNvbSIsInJvbGUiOiJlbXBsb3llZSIsImlhdCI6MTcwOTQ0ODcyNCwiZXhwIjoxNzA5NTA4NzI0fQ.70OZmcolJwo9UNRh8p5QbRy0Qcbwc5v5edXp67fmjZY';

function Chat() {
    const [channel, setChannel] = useState(-1);
    const [socket, setSocket] = useState<any>(null);
    const [index, setIndex] = useState<number>(1);
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
                <div className='flex flex-row w-full p-5 gap-5 h-[550px]'>
                    <div className='basis-1/4 w-full h-full bg-white rounded-2xl flex flex-col justify-start gap-1'>
                        <ChatList
                            socket={socket}
                            setChannel={setChannel}
                            token={aToken}
                            setIndex={setIndex}
                        ></ChatList>
                    </div>
                    <div className='basis-3/4 bg-white rounded-2xl '>
                        {channel !== -1 ? (
                            <ChatBox
                                socket={socket}
                                channel={channel}
                                setChannel={setChannel}
                                token={aToken}
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
