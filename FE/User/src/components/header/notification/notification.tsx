"use client";
import { useRouter, usePathname } from "next-intl/client";
import { Popover, Switch } from "antd";
import { useLocale } from "next-intl";
import { useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import Item from "@/components/header/notification/item";
const Notification = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const sampleItems: any = [
        {
            orderId: 1,
            step: 0,
            status: true,
            time: "2024-03-27T13:39:22+07:00",
        },
        {
            orderId: 1,
            step: 1,
            status: true,
            time: "2024-03-27T13:39:22+07:00",
        },
        {
            orderId: 1,
            step: 2,
            status: true,
            time: "2024-03-27T13:39:22+07:00",
        },
        {
            orderId: 1,
            step: 3,
            status: false,
            time: "2024-03-27T13:39:22+07:00",
        },
    ];
    return (
        <Popover
            autoAdjustOverflow={true}
            content={
                <div className='w-80 max-h-[500px] p-1 overflow-hidden'>
                    <div className='flex flex-col justify-start gap-1'>
                        <div className='font-bold text-lg'>Notification</div>
                        <div className='w-full h-full overflow-y-scroll flex flex-col justify-start gap-1'>
                            {sampleItems.map((item: any) => {
                                return (
                                    <Item
                                        key={`${item.orderId} ${item.step} ${item.status}`}
                                        params={item}
                                    ></Item>
                                );
                            })}
                        </div>
                    </div>
                </div>
            }
            trigger='click'
            open={open}
            onOpenChange={handleOpenChange}
        >
            <div className='relative hover:text-primary cursor-pointer w-auto flex p-2 rounded-full hover:bg-primary-100 transition duration-300 ease-in-out'>
                <BellOutlined
                    style={{
                        fontSize: "1.6rem",
                    }}
                />
                <div className='z-50 absolute bottom-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-extralight text-xs'>
                    12
                </div>
            </div>{" "}
        </Popover>
    );
};

export default Notification;
