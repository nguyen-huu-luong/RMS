import React from "react";
import { Image, Tooltip } from "antd";
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
    const isCloudinaryImage = params.content.startsWith(
        "http://res.cloudinary.com/"
    );
    return params.client ? (
        <div className='flex flex-row justify-end pl-8'>
            <Tooltip placement='left' title={moment(params.time).calendar()}>
                {isCloudinaryImage ? (
                    <span className='bg-primary rounded-xl p-2 text-white text-right w-fit'>
                        <Image
                            src={params.content}
                            alt='cloudinary_image'
                            width={100}
                            height={100}
                            className='aspect-square rounded-md w-full min-w-fit'
                        />{" "}
                    </span>
                ) : (
                    <span className='bg-primary rounded-xl p-2 text-white text-right w-fit'>
                        {params.content}
                    </span>
                )}
            </Tooltip>
        </div>
    ) : (
        <div className='flex flex-row justify-start pr-8'>
            <Tooltip placement='right' title={moment(params.time).calendar()}>
                {isCloudinaryImage ? (
                    <span className='bg-slate-100 rounded-xl p-2 text-black text-right w-fit'>
                        <Image
                            src={params.content}
                            alt='cloudinary_image'
                            width={100}
                            height={100}
                            className='aspect-square rounded-md w-full min-w-fit'
                        />{" "}
                    </span>
                ) : (
                    <span className='bg-slate-100 rounded-xl p-2 text-black text-left w-fit'>
                        {params.content}
                    </span>
                )}
            </Tooltip>
        </div>
    );
}

export default Message;
