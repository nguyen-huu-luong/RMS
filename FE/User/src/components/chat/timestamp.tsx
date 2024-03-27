import React from "react";
import moment from "moment";
function TimeStamp({ time }: { time: string }) {
    return (
        <div className='w-full h-5 flex items-center justify-center font-semibold'>
            <span>{moment(time).calendar()}</span>
        </div>
    );
}

export default TimeStamp;
