import { useState, useEffect, useCallback } from "react";
import User from "./User";
import fetchClient from "@/lib/fetch-client";

const ChatList = ({
    setChannel,
    socket,
    setIndex,
    staffId,
}: {
    setChannel: any;
    socket: any;
    setIndex: any;
    staffId: any;
}) => {
    const [channels, setChannels] = useState<any>(null);
    const [channelStatus, setChannelStatus] = useState<any>({});
    const fetchChannels = useCallback(async () => {
        try {
            const fetchedData = await fetchClient({
                url: `/channels/admin`,
                data_return: true,
            });
            setChannels(fetchedData);
        } catch (error) {
            console.log(error);
        }
    }, [setChannels]);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);
    useEffect(() => {
        socket.on("initial:channels", (initialChannels: any) => {
            setChannelStatus(initialChannels);
        });
        socket.on("channel:status:update", (updatedChannels: any) => {
            setChannelStatus(updatedChannels);
            console.log(updatedChannels);
        });
    }, [socket]);
    if (!channels) return "Loading...";
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
                />{" "}
            </div>
            <div className='w-80 h-fit flex flex-col justify-start overflow-y-auto'>
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
