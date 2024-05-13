"use client";
import React from "react";
import moment from "moment";
import Image from "next/image";
import { useEffect, useCallback } from "react";
import axios from "axios";
import { message } from "antd";
import { Tag } from "antd";
import fetchClient from "@/lib/fetch-client";
import Avatar from "@/images/avatar.png";
const TimeDisplay = (time: any) => {
    const momentDate = moment(time);
    const isToday = momentDate.isSame(moment(), "day");
    const formattedTime = isToday
        ? momentDate.format("HH:mm")
        : momentDate.format("DD/MM");
    return formattedTime;
};
function User({
    params,
    setChannel,
    socket,
    setChannels,
    setIndex,
    staffId,
    channelStatus,
}: {
    params: {
        channel: any;
        latestMessage: any;
        updateTime: any;
        userName: any;
        userAvatar: any;
    };
    setChannel: any;
    socket: any;
    setChannels: any;
    setIndex: any;
    staffId: any;
    channelStatus: any;
}) {
    useEffect(() => {
        const handleClientMessage = (
            channelId: any,
            message: string,
            clientId: string
        ) => {
            if (channelId == params.channel.id) {
                setChannels((prevChannels: any) => {
                    if (!prevChannels) return;
                    const updatedChannels = prevChannels.channel.map(
                        (channel: any) => {
                            if (channel.channel.id === channelId) {
                                return {
                                    ...channel,
                                    latestMessage: {
                                        content: message,
                                        createdAt: new Date(),
                                        employeeId: null,
                                        clientId: clientId,
                                        status: "Not seen",
                                    },
                                    updateTime: new Date(),
                                };
                            }
                            return channel;
                        }
                    );
                    return { ...prevChannels, channel: updatedChannels };
                });
            }
        };
        const handleStaffMessage = (
            channelId: any,
            message: string,
            employeeId: string
        ) => {
            if (channelId == params.channel.id) {
                setChannels((prevChannels: any) => {
                    if (!prevChannels) return;
                    const updatedChannels = prevChannels.channel.map(
                        (channel: any) => {
                            if (channel.channel.id === channelId) {
                                return {
                                    ...channel,
                                    latestMessage: {
                                        content: message,
                                        createdAt: new Date(),
                                        employeeId: employeeId,
                                        clientId: null,
                                        status: "Not seen",
                                    },
                                    updateTime: new Date(),
                                };
                            }
                            return channel;
                        }
                    );
                    return { ...prevChannels, channel: updatedChannels };
                });
            }
        };
        const handleSeenMessage = (channelId: any) => {
            setChannels((prevChannels: any) => {
                if (!prevChannels) return prevChannels;
                const updatedChannels = prevChannels.channel.map(
                    (channel: any) => {
                        if (channel.channel.id === channelId) {
                            const updatedLatestMessage = {
                                ...channel.latestMessage,
                                status: "Seen",
                            };
                            return {
                                ...channel,
                                latestMessage: updatedLatestMessage,
                            };
                        }
                        return channel;
                    }
                );
                return { ...prevChannels, channel: updatedChannels };
            });
        };
        socket.on("message:send:fromClient", handleClientMessage);
        socket.on("message:send:fromStaff", handleStaffMessage);
        socket.on("message:read:fromStaff", handleSeenMessage);

        return () => {
            socket.off("message:send:fromClient", handleClientMessage);
            socket.off("message:send:fromStaff", handleStaffMessage);
            socket.off("message:read:fromStaff", handleSeenMessage);
        };
    }, [socket, setChannels, params.channel.id]);

    const viewMessage = async () => {
        await fetchClient({
            url: `/channels`,
            method: "PUT",
            body: { id: params.channel.id },
        });
        await socket.emit("staff:message:read", params.channel.id);
        setChannels((prevChannels: any) => {
            if (!prevChannels) return prevChannels;
            const updatedChannels = prevChannels.channel.map((channel: any) => {
                if (channel.channel.id === params.channel.id) {
                    const updatedLatestMessage = {
                        ...channel.latestMessage,
                        status: "Seen",
                    };
                    return {
                        ...channel,
                        latestMessage: updatedLatestMessage,
                    };
                }
                return channel;
            });
            return { ...prevChannels, channel: updatedChannels };
        });
    };

    const handleJoinRoom = async () => {
        try {
            const response = await socket
                .timeout(5000)
                .emitWithAck("staff:channel:join", params.channel.id, staffId);
            if (response.status == "0") {
                message.warning(
                    `There is other staff in ${params.userName}'s channel!`
                );
            } else {
                setChannel(params.channel.id);
                viewMessage();
                setIndex(1);
                message.success(
                    `Join ${params.userName}'s channel successfully!`
                );
            }
        } catch (e) {
            console.log(e);
        }
    };
    return params.latestMessage ? (
        <div
            onClick={() => {
                handleJoinRoom();
            }}
            className={`px-2 w-full ${
                params.latestMessage.status == "Not seen" &&
                params.latestMessage.clientId
                    ? "bg-slate-100 hover:bg-slate-200 text-black"
                    : "hover:bg-slate-50"
            } h-20 hover:cursor-pointer transition-all duration-300 flex flex-row items-center justify-between gap-2 font-normal`}
        >
            <div className='Avatar flex-none rounded-full border-2 w-16 h-16 border-primary border-opacity-20 overflow-hidden'>
                <Image
                    src={params.userAvatar ? params.userAvatar : Avatar}
                    alt='User avatar'
                    width={16}
                    height={16}
                    className='h-full aspect-square w-full min-w-fit'
                    unoptimized
                />
            </div>
            <div
                className={`body text-sm flex flex-col justify-between items-start w-full`}
            >
                <div className='w-40 font-bold overflow-ellipsis whitespace-nowrap overflow-hidden pr-2'>
                    {params.userName}
                </div>
                <div
                    className={`w-40 overflow-ellipsis whitespace-nowrap overflow-hidden ${
                        params.latestMessage.status == "Not seen" &&
                        params.latestMessage.clientId
                            ? "font-semibold"
                            : ""
                    }`}
                >
                    {params.latestMessage.content.startsWith(
                        "http://res.cloudinary.com/"
                    )
                        ? "Send an image"
                        : params.latestMessage.content}
                </div>
                <div> </div>
            </div>
            {params.channel.id in channelStatus ? (
                <Tag color='#87d068'>Active</Tag>
            ) : (
                <div className='text-sm w-20 overflow-ellipsis whitespace-nowrap overflow-hidden'>
                    {TimeDisplay(params.latestMessage.createdAt)}
                </div>
            )}
        </div>
    ) : (
        <div
            onClick={() => {
                handleJoinRoom();
            }}
            className={`px-2 w-full ${"hover:bg-slate-50"} h-20 hover:cursor-pointer transition-all duration-300 flex flex-row items-center justify-between gap-2 font-normal`}
        >
            <div className='Avatar flex-none rounded-full border-2 w-16 h-16 border-primary border-opacity-20 overflow-hidden'>
                <Image
                    src={params.userAvatar ? params.userAvatar : "/abc"}
                    alt='User avatar'
                    width={16}
                    height={16}
                    className='h-full w-full min-w-fit aspect-square'
                    unoptimized
                />
            </div>
            <div
                className={`body text-sm flex flex-col justify-between items-start w-full`}
            >
                <div className='w-full font-bold'>{params.userName}</div>
                <div
                    className={`w-40 overflow-ellipsis whitespace-nowrap overflow-hidden `}
                ></div>
                <div> </div>
            </div>
            {params.channel.id in channelStatus ? (
                <Tag color='#87d068'>Active</Tag>
            ) : (
                <div className='text-sm w-20 overflow-ellipsis whitespace-nowrap overflow-hidden'></div>
            )}
        </div>
    );
}

export default User;
