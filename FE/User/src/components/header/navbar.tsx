"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import LanguageChanger from "./languageChanger";
import Container from "../container";
import Image from "next/image";
import Link from "next-intl/link";
import { useLocale } from "next-intl";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Popover } from "antd";
import type { MenuProps } from "antd";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Notification from "./notification/notification";
const NavBar = () => {
    const locale = useLocale();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [click, setClick] = useState(false);
    const [search, setSearch] = useState(true);

    const t = useTranslations("NavBar");
    const MENU_LISTS = [
        { name: "Home", href: `` },
        { name: "Menu", href: `menu` },
        { name: "News", href: `news` },
        { name: "About", href: `about` },
    ];

    const items: MenuProps["items"] =
        status == "authenticated"
            ? [
                  {
                      key: "profile",
                      label: (
                          <Link
                              key={"profile"}
                              href={`/profile`}
                              locale={locale}
                          >
                              {t("Profile")}
                          </Link>
                      ),
                  },
                  {
                      key: "logout",
                      label: t("LogOut"),
                      onClick: () => {
                          signOut();
                      },
                  },
              ]
            : [
                  {
                      key: "signin",
                      label: (
                          <Link key={"signin"} href={`/signin`} locale={locale}>
                              {t("SignIn")}{" "}
                          </Link>
                      ),
                  },
                  {
                      key: "register",
                      label: (
                          <Link
                              key={"register"}
                              href={`/register`}
                              locale={locale}
                          >
                              {t("Register")}{" "}
                          </Link>
                      ),
                  },
              ];

    const toggleNav = () => {
        setClick(!click);
    };
    const toggleSearch = () => {
        setSearch(!search);
    };
    return (
        <>
            <nav className='sticky top-0 w-full h-16 shadow-md z-50 bg-primary-white'>
                <Container>
                    <div className='w-full h-full flex flex-row font-bold'>
                        {/* Left header */}
                        <div
                            className={`flex gap-4 items-center w-auto md:w-full ${
                                search ? "block" : "hidden"
                            }`}
                        >
                            {/* Restaurant logo */}
                            <div className='hidden md:block h-full w-auto flex-none'>
                                <Link href={`/`} locale={locale}>
                                    <Image
                                        src='/restaurant-logo.png'
                                        alt='Restaurant logo'
                                        width={100}
                                        height={100}
                                        className='h-full w-auto'
                                    />
                                </Link>
                            </div>
                            {/* Small screen navbar */}
                            <button
                                className='block md:hidden w-full'
                                type='button'
                                onClick={toggleNav}
                            >
                                {click ? (
                                    <svg
                                        className='h-6 w-6'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M6 18L18 6M6 6l12 12'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className='h-6 w-6'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M4 6h16M4 12h16m-7 6h7'
                                        />
                                    </svg>
                                )}
                            </button>
                            {/* Normal navbar */}
                            <div
                                className='hidden w-full flex-none md:block md:w-auto'
                                id='navbar-default'
                            >
                                <div className='flex flex-row justify-between gap-5 w-full'>
                                    {MENU_LISTS.map((item) => (
                                        <Link
                                            href={`/${item.href}`}
                                            locale={locale}
                                            className='hover:text-primary transition-all ease-in-out duration-200'
                                            key={item.name}
                                        >
                                            {t(item.name)}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Right header */}
                        <div className='flex flex-row items-center justify-end w-full gap-4 '>
                            <div
                                className={`${
                                    search ? "block" : "hidden"
                                } flex w-auto h-auto hover:text-primary rounded-full p-2 hover:bg-primary-100 transition duration-300 ease-in-out`}
                            >
                                <SearchOutlined
                                    onClick={toggleSearch}
                                    style={{ fontSize: "1.4rem" }}
                                />
                            </div>

                            {!search && (
                                <div
                                    className={`w-full pl-5 flex justify-center `}
                                >
                                    <input
                                        id='search'
                                        type='text'
                                        placeholder={t("Search-placeholder")}
                                        className='rounded-full border-gray-100 font-normal
                                        border-2 text-placeholder  pl-4 p-2 w-24 focus:bg-primary-white
                                        focus:cursor-text focus:border-orange-300 outline-none focus:pr-4
                                        transition-all duration-500 transform focus:w-full focus:lg:w-3/5
                                        '
                                        onBlur={toggleSearch}
                                        autoFocus
                                    />
                                </div>
                            )}

                            {search ? (
                                <>
                                    <LanguageChanger />
                                    {status == "authenticated" ? (
                                        <>
                                            <Notification />{" "}
                                            <Link
                                                href={"/cart"}
                                                locale={locale}
                                                className='hover:text-primary cursor-pointer w-auto flex p-2 rounded-full hover:bg-primary-100 transition duration-300 ease-in-out'
                                            >
                                                <ShoppingCartOutlined
                                                    style={{
                                                        fontSize: "1.6rem",
                                                    }}
                                                />
                                            </Link>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    <Dropdown
                                        menu={{ items }}
                                        placement='bottom'
                                        trigger={["click"]}
                                    >
                                        <div className='cursor-pointer p-2 rounded-full hover:bg-primary-100 transition duration-300 ease-in-out'>
                                            <Avatar
                                                size={32}
                                                icon={<UserOutlined />}
                                            />
                                        </div>
                                    </Dropdown>
                                </>
                            ) : (
                                <div className='h-0 w-0 transition-all duration-250'></div>
                            )}
                        </div>
                    </div>
                </Container>
            </nav>
            {click ? (
                <div className='block lg:hidden w-full h-auto flex-col p-4 bg-primary-white transition-2 duration-250 transition-all'>
                    {MENU_LISTS.map((item) => (
                        <Link
                            key={item.name}
                            href={`/${item.href}`}
                            onClick={(click) => {
                                setClick(!click);
                            }}
                            locale={locale}
                            className='block font-bold pl-3 p-2 hover:text-item-white hover:bg-primary rounded-md ease-in-out duration-200 hover:translate-x-2 transition-all w-full'
                        >
                            {t(item.name)}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className='h-0 transition-all duration-250'></div>
            )}
        </>
    );
};

export default NavBar;
