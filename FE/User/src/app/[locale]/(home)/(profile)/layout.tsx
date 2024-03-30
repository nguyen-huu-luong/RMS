"use client";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { UserOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Menu, ConfigProvider } from "antd";
import type { MenuProps } from "antd";

import Image from "next/image";
export default function Layout({ children }: { children: React.ReactNode }) {
    const locale = useLocale();
    const [current, setCurrent] = useState("profile");
    const t = useTranslations('Profile')
    const onClick: MenuProps["onClick"] = (e) => {
        setCurrent(e.key);
    };
    useEffect(() => {
      const path = window.location.pathname;
      if (path.includes("/myorder")) {
          setCurrent("myorder");
      } else {
          setCurrent("profile");
      }
  }, []);

    const items: MenuProps["items"] = [
        {
            label: (
                <Link href={"/profile"} locale={locale}>
                    {t('Profile')}
                </Link>
            ),
            key: "profile",
            icon: <UserOutlined />,
        },
        {
            label: (
                <Link href={"/myorder"} locale={locale}>
                    {t('Manage')}
                </Link>
            ),
            key: "myorder",
            icon: <ShoppingOutlined />,
        },
    ];
    return (
        <>
            <div className=' flex flex-col sm:flex-row justify-between gap-5 p-5 w-full'>
                <div className=' divide-y w-auto h-auto flex flex-col justify-start items-center gap-5 p-5 bg-primary-white rounded-xl transition-all duration-300'>
                    <div className='w-full h-auto p-5 flex flex-col justify-start gap-1 items-center'>
                        <div className='w-auto h-auto rounded-lg overflow-hidden'>
                            <Image
                                src={"/avatar.png"}
                                alt={"Profile"}
                                width={80}
                                height={80}
                                unoptimized
                            />
                        </div>{" "}
                        <span className='whitespace-nowrap font-bold text-base'>
                            Tony Nguyen
                        </span>
                        <span className='font-bold text-sky-500'>0 Points</span>
                    </div>
                    <div className='w-full h-auto p-5 flex flex-col justify-start gap-1 items-center'>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Menu: {
                                      itemSelectedBg: "#fdeec3",
                                      itemSelectedColor: "#EA6A12",
                                      groupTitleFontSize: 100,
                                      activeBarBorderWidth: 0  
                                    },
                                },
                            }}
                        >
                            <Menu
                                onClick={onClick}
                                selectedKeys={[current]}
                                items={items}
                            />{" "}
                        </ConfigProvider>
                    </div>
                </div>
                <div className='w-full h-auto flex flex-col justify-start items-center gap-2 rounded-xl transition-all duration-300'>
                    {children}
                </div>
            </div>
        </>
    );
}
