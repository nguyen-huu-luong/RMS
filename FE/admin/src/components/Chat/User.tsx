import React from "react";
import moment from "moment";
import Image from "next/image";
const TimeDisplay = (time: any) => {
    const momentDate = moment(time);
    const isToday = momentDate.isSame(moment(), "day");
    const formattedTime = isToday
        ? momentDate.format("HH:mm")
        : momentDate.format("DD/MM");
    return formattedTime;
};
function User({
    params, setChannel
}: {
    params: {
        channel: any;
        latestMessage: any;
        updateTime: any;
        userName: any;
        userAvatar: any;
    };
    setChannel: any;
}) {
    console.log(params.channel.id);
    return (
        <div onClick={()=>setChannel(params.channel.id)} className={`px-2 w-full ${params.latestMessage.status == "Not seen"?"bg-slate-100 hover:bg-slate-200":"hover:bg-slate-50"} h-20 hover:cursor-pointer transition-all duration-300 flex flex-row items-center justify-between gap-2 font-normal`}>
            <div className='Avatar flex-none rounded-full border-2 w-16 h-16 border-primary border-opacity-20 overflow-hidden'>
                <Image
                    src={"/abc"}
                    alt='User avatar'
                    width={16}
                    height={16}
                    className='h-full w-full min-w-fit'
                />
            </div>
            <div className={`body text-sm flex flex-col justify-between items-start w-full`}>
                <div className="w-full font-bold">{params.userName}</div>
            <div className={`w-40 overflow-ellipsis whitespace-nowrap overflow-hidden ${params.latestMessage.status == "Not seen"?"font-semibold":""}`}> {params.latestMessage.content}</div>
                <div>{" "}</div>
            </div>
            <div className='text-sm w-20 overflow-ellipsis whitespace-nowrap overflow-hidden'>{TimeDisplay(params.latestMessage.createdAt)}</div>
        </div>
    );
}

export default User;
