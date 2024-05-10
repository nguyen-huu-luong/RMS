import React from "react";
import { Image } from "antd";

function Message({
    params,
}: {
    params: {
        content: string;
        employee: boolean;
        time: string;
    };
}) {
    const isCloudinaryImage = params.content.startsWith(
        "http://res.cloudinary.com/"
    );
    return params.employee ? (
        <div className='flex flex-row justify-end pl-8'>
            {isCloudinaryImage ? (
                <span className='bg-primary rounded-xl p-2 text-white text-right w-fit'>
                    <Image
                        src={params.content}
                        alt='cloudinary_image'
                        width={200}
                        height={200}
                        className='aspect-square rounded-md w-full min-w-fit'
                    />{" "}
                </span>
            ) : (
                <span className='bg-primary rounded-xl p-2 text-white text-right w-fit'>
                    {params.content}
                </span>
            )}
        </div>
    ) : (
        <div className='flex flex-row justify-start pr-8'>
            {isCloudinaryImage ? (
                <span className='bg-slate-100 rounded-xl p-2 text-black text-left w-fit'>
                    <Image
                        src={params.content}
                        alt='cloudinary_image'
                        width={200}
                        height={200}
                        className='aspect-square rounded-md w-full min-w-fit'
                    />
                </span>
            ) : (
                <span className='bg-slate-100 rounded-xl p-2 text-black text-left w-fit'>
                    {params.content}
                </span>
            )}
        </div>
    );
}

export default Message;
