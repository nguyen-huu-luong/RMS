"use client";

import { CheckOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import React from "react";
function Status({ read }: { read: boolean }) {
    const t = useTranslations("Chat");
    return (
        <div className='flex flex-row justify-end -mt-2'>
            <span className='text-xs font-light text-right w-fit'>
                {read ? t("Seen") : t("Not_seen")}{" "}
                {read ? <CheckOutlined color='EA6A12' /> : <></>}
            </span>
        </div>
    );
}

export default Status;
