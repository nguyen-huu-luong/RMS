// "use client";
// import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
// import TimeStamp from "./Timestamp";
// import Message from "./Message";
// import Status from "./Status";
// import { useRouter } from "next-intl/client";
// // import useSWR from "swr";
// import { useState, useEffect } from "react";
// import useSWRInfinite from "swr/infinite";
// import useSWR from "swr";
// import moment from "moment";
// import axios from "axios";
// import { mutate } from "swr";
// import User from "./User";

// const channelFetcher = async (url: string, token: any) => {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.log(error);
//     }
// };

// const aToken =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiTGV4aWUuUmlwcGluQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzA4ODUzNzQ3LCJleHAiOjE3MDg5MTM3NDd9.KlQCrDyeObZGkRjuQqNp17a34JLJT9fTxt6toJehVQk";
// const ChatList = ({ setChannel, socket }: { setChannel: any; socket: any }) => {
//     const {
//         data: channels,
//         error: channelsError,
//         isLoading: channelsLoading,
//         mutate,
//     } = useSWR([`http://localhost:3003/api/channels/admin`, aToken], ([url, token]) =>
//         channelFetcher(url, token)
//     );
//     useEffect(() => {
//         socket.on("message:send:fromStaff", (channelId: string, message: string) => {
//             mutate()
//         });
//         socket.on("message:send:fromClient", (channelId: string, message: string) => {
//             mutate()
//         });
//     }, [socket, mutate]);
//     if (channelsError) return <div>Failed to load</div>;
//     if (channelsLoading) return <div>Loading...</div>;
//     return (
//         <>
//             <div
//                 className='header h-10 items-center align-middle w-full text-lg font-bold flex flex-row
//             justify-center border-b-2 border-primary border-opacity-10 shadow-sm'
//             >
//                 <p>All customers</p>
//             </div>
//             <div
//                 className='search h-14 items-center align-middle w-full text-base font-medium flex flex-row
//             justify-center p-4'
//             >
//                 <input
//                     id='search'
//                     type='text'
//                     placeholder={"Enter name"}
//                     className='rounded-full border-gray-100 font-normal
//                                         border-2 text-placeholder pl-2 p-1 focus:bg-primary-white
//                                         focus:cursor-text focus:border-primary outline-none focus:pr-2
//                                         transition-all duration-500 transform w-full
//                                         '
//                 />{" "}
//             </div>
//             <div className='w-80 h-fit flex flex-col justify-start overflow-y-auto'>
//                 {/* <TimeStamp time={"11:11"} /> */}
//                 {channels.channel.map((item: any, index: any) => {
//                     return (
//                         <User
//                             key={index}
//                             params={item}
//                             setChannel={setChannel}
//                             socket={socket}
//                         />
//                     );
//                 })}
//             </div>
//         </>
//     );
// };

// export default ChatList;

import { FullscreenExitOutlined, SendOutlined } from "@ant-design/icons";
import TimeStamp from "./Timestamp";
import Message from "./Message";
import Status from "./Status";
import { useRouter } from "next-intl/client";
import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import axios from "axios";
import User from "./User";

const channelFetcher = async (url: string, token: any) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};



const ChatList = ({
    setChannel,
    socket,
    token,
}: {
    setChannel: any;
    socket: any;
    token: any;
}) => {
    const [channels, setChannels] = useState<any>(null);
    const fetchChannels = useCallback(async () => {
        try {
            const fetchedData = await channelFetcher(
                `http://localhost:3003/api/channels/admin`,
                token
            );
            setChannels(fetchedData);
        } catch (error) {
            console.log(error);
        }
    }, [setChannels, token]);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

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
                className='search h-14 items-center align-middle w-full text-base font-medium flex flex-row 
            justify-center p-4'
            >
                <input
                    id='search'
                    type='text'
                    placeholder={"Enter name"}
                    className='rounded-full border-gray-100 font-normal
                                        border-2 text-placeholder pl-2 p-1 focus:bg-primary-white
                                        focus:cursor-text focus:border-primary outline-none focus:pr-2
                                        transition-all duration-500 transform w-full
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
                                token={token}
                            />
                        );
                    })}
            </div>
        </>
    );
};

export default ChatList;