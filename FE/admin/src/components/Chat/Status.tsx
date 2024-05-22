'use client'
import React from "react";
import { CheckOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
function Status({ read }: { read: boolean }) {
    const t = useTranslations('Chat')
    return (
        <div className='flex flex-row justify-end -mt-2'>
            <span className='text-xs font-light text-right w-fit'>
             {read?t('seen'): t('not-seen')}
            </span> 
        </div>
    )
}

export default Status;
