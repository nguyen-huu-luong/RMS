import { useState, useEffect, useCallback } from "react";
import User from "./User";
import fetchClient from "@/lib/fetch-client";
import { fetchData } from "next-auth/client/_utils";
import Loading from "../loading";

const ChatList = ({
    id,
    channel,
    setChannel,
    socket,
    setIndex,
    staffId,
}: {
    id: any;
    channel: any;
    setChannel: any;
    socket: any;
    setIndex: any;
    staffId: any;
}) => {
    const [channels, setChannels] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchParams, setSearchParams] = useState<string>("");
    const [channelStatus, setChannelStatus] = useState<any>({});
    const fetchChannels = useCallback(async () => {
        try {
            const fetchedData = await fetchClient({
                url: `/channels/admin?name=${encodeURI(searchParams)}`,
                data_return: true,
            });
            setChannels(fetchedData);
            fetchedData.channel.map((item: any) => {
                if (item.channel.clientId == parseInt(id, 10) && channel == -1) {
                    setChannel(item.channel.id);

                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [setChannels, searchParams]);

    useEffect(() => {
        socket.on("initial:channels", (initialChannels: any) => {
            setChannelStatus(initialChannels);
        });
        socket.on("channel:status:update", (updatedChannels: any) => {
            setChannelStatus(updatedChannels);
        });
        socket.on(
            "anonymous:channel:create",
            async (channelId: string, userName: string, clientId: string) => {
                if (channels !== null) {
                    const newChannels = [...channels.channel];
                    const newChannel = {
                        channel: {
                            id: channelId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        latestMessage: {
                            id: userName,
                            content: "New user want to chat!",
                            status: "Not seen",
                            employeeId: null,
                            clientId: clientId,
                            channelId: channelId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        userName: userName,
                    };
                    newChannels.unshift(newChannel);
                    setChannels({ channel: newChannels });
                }
            }
        );
    }, [socket, channels]);
    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            setSearchParams(searchTerm);
        }
    };
    const handleChange = (event: any) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

    if (!channels) return <Loading />;
    return (
        <>
            <div
                className='header h-10 items-center align-middle w-full text-lg font-bold flex flex-row 
            justify-center border-b-2 border-primary border-opacity-10 shadow-sm'
            >
                <p>All customers</p>
            </div>
            <div
                className='z-0 search h-14 items-center align-middle w-full text-base font-medium flex flex-row 
            justify-center p-4'
            >
                <input
                    id='search'
                    type='text'
                    placeholder={"Enter name"}
                    className='rounded-full border-gray-100 font-normal
                                        border-2 text-placeholder pl-2 p-1 focus:bg-primary-white
                                        focus:cursor-text focus:border-primary outline-none focus:pr-2
                                        transition-all duration-500 transform w-full z-0
                                        '
                    value={searchTerm}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className='w-80 h-full flex flex-col justify-start gap-2 overflow-y-auto'>
                {channels.channel
                    .sort((a: any, b: any) => {
                        return (
                            new Date(b.updateTime).getTime() -
                            new Date(a.updateTime).getTime()
                        );
                    })
                    .map((item: any, index: any) => {
                        return (
                            <User
                                key={index}
                                params={item}
                                setChannel={setChannel}
                                socket={socket}
                                setChannels={setChannels}
                                setIndex={setIndex}
                                staffId={staffId}
                                channelStatus={channelStatus}
                            />
                        );
                    })}
            </div>
        </>
    );
};

export default ChatList;
