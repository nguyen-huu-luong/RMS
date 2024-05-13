"use client";
import { useRouter, usePathname } from "next-intl/client";
import { Popover, Switch } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { BellOutlined } from "@ant-design/icons";
import Item from "@/components/header/notification/item";
import useSocket from "@/socket";
import fetchClient from "@/lib/fetch-client";
import useSWR from "swr";
const Notification = () => {
    const socket = useSocket();
    const t = useTranslations('Noti')
    const [child, setChild] = useState<boolean>(false);
    const [waited, setWaited] = useState<boolean>(false);
    const hide = () => {
        setOpen(false);
    };

    const ref = useRef<any>(null);

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if (!child) {
                if (!ref.current?.contains(event.target)) {
                    hide();
                }
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [ref, child]);

    const [open, setOpen] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setWaited(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);
    const {
        data: notifications,
        error: notificationsError,
        isLoading: notificationsLoading,
        mutate,
    } = useSWR(
        waited ? `/notifications/all` : null,
        waited ? (url) => fetchClient({ url: url, data_return: true }) : null
    );

    useEffect(() => {
        if (!socket) return;
        const handleGetNotification = async (orderId: any) => {
            await mutate();
        };

        socket.on("notification:prepare:fromStaff", handleGetNotification);
        socket.on("notification:deliver:fromStaff", handleGetNotification);
        socket.on("notification:done:fromStaff", handleGetNotification);
        socket.on("notification:reject:fromStaff", handleGetNotification);

        socket.on("connect_error", (error: any) => {
            console.log(error);
        });
        return () => {
            socket.off("notification:prepare:fromStaff", handleGetNotification);
            socket.off("notification:deliver:fromStaff", handleGetNotification);
            socket.off("notification:done:fromStaff", handleGetNotification);
            socket.off("notification:reject:fromStaff", handleGetNotification);
        };
    }, [socket]);
    if (notificationsLoading) return;
    if (notificationsError) return;
    if (!notifications) return;
    return (
        <>
            <div
                className='relative hover:text-primary cursor-pointer w-auto flex p-2 rounded-full hover:bg-primary-100 transition duration-300 ease-in-out'
                onClick={() => setOpen(true)}
            >
                <BellOutlined
                    style={{
                        fontSize: "1.6rem",
                    }}
                /> 
                <div className='z-50 absolute bottom-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-extralight text-xs'>
                    {
                        notifications.res.filter(
                            (item: any) => item.status == false
                        ).length
                    }
                </div>
            </div>
            {open && (
                <div
                    ref={ref}
                    className='fixed top-20 right-5 z-50 w-auto h-auto bg-white rounded-md border-2 p-4'
                >
                    <div className='font-bold text-xl p-2'>{t('Noti')}</div>
                    <div className='w-96 max-h-[500px] p-1 overflow-auto'>
                        <div className='flex flex-col justify-start gap-1'>
                            <div className='w-full h-full flex flex-col justify-start gap-1'>
                                {notifications.res.map((item: any) => {
                                    if (item.orderStatus)
                                        return (
                                            <Item
                                                key={`${item.orderStatus}`}
                                                params={item}
                                                setChild={setChild}
                                                mutate={mutate}
                                            ></Item>
                                        );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Notification;
