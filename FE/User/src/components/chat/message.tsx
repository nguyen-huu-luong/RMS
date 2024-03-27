import React from "react";
import moment from "moment";
function Message({
    params,
}: {
    params: {
        content: string;
        client: boolean;
        time: string;
    };
}) {
    return params.client ? (
        <div className='flex flex-row justify-end pl-8'>
            <span className='bg-primary rounded-xl p-2 text-white text-right w-fit'>
                {params.content}
            </span>
        </div>
    ) : (
        <div className='flex flex-row justify-start pr-8'>
            <span className='bg-slate-100 rounded-xl p-2 text-black text-left w-fit'>
                {params.content}
            </span>
        </div>
    );
}

export default Message;
