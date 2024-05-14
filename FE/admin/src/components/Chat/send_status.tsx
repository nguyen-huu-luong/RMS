"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import React from "react";
function SendStatus() {
    return (
        <div className='flex flex-row justify-end -mt-2'>
            <span className='text-xs font-light text-right w-fit'>
                Sending <LoadingOutlined />
            </span>
        </div>
    );
}

export default SendStatus;
