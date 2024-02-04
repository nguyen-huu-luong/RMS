'use client'
import ChatList from "@/components/Chat/ChatList";
import ChatBox from "@/components/Chat/ChatRoom";
import { useState } from "react";
function Chat() {
    const [channel, setChannel] = useState(-1)

    return (
        <div className='flex flex-row h-96 w-full p-5 gap-5'>
            <div className='basis-1/4 w-full h-full bg-white rounded-2xl flex flex-col justify-start gap-1'><ChatList setChannel={setChannel}></ChatList></div>
            <div className='basis-3/4 bg-white rounded-2xl'>{channel != - 1?<ChatBox channel={channel} setChannel={setChannel}/>:""}</div>
        </div>
    );
}

export default Chat;
