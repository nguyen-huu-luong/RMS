"use client";
import Container from "../container";
import { useLocale, useTranslations } from "next-intl";
import Link from "next-intl/link";
import {
    FacebookOutlined,
    YoutubeOutlined,
    InstagramOutlined,
} from "@ant-design/icons";

const Footer = () => {
    const locale = useLocale();
    const t = useTranslations("Footer");
    return (
        <div className='bg-primary h-auto text-item-white pt-10 z-30'>
            <Container> 
                <div className='w-auto'>
                    <div className='h-auto w-auto flex flex-col md:flex-row gap-4 justify-around items-center md:items-start'>
                        {/* ABOUT US */}
                        <div className='flex flex-col text-center md:text-left'>
                            <div className='w-auto h-auto font-extrabold text-lg pb-6'>
                                <Link
                                    href={`/about`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("About")}
                                </Link>
                            </div>
                            <div className='w-auto h-auto py-2 font-thin'>
                                <Link
                                    href={`/about`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Restaurant-info")}
                                </Link>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <Link
                                    href={`/about`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Policies")}
                                </Link>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <Link
                                    href={`/about`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Shipping")}
                                </Link>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <Link
                                    href={`/about`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Term")}
                                </Link>
                            </div>
                        </div>
                        {/* Contacts */}
                        <div className='flex flex-col text-center md:text-left'>
                            <div className='w-auto h-auto font-extrabold text-lg pb-6'>
                                {t("Contacts")}
                            </div>
                            <div className='w-auto h-auto py-2 font-thin'>
                                Email: homecuisine.vn@gmail.com
                            </div>
                            <div className='w-auto h-auto py-2'>
                                {t("Phone")}: 0123456789
                            </div>
                            <div className='w-auto h-auto py-2'>
                                {t("Social")}:
                            </div>
                            <div className='w-auto h-auto py-2 flex flex-row justify-center md:justify-start gap-2'>
                                <a
                                    className='w-auto h-auto items-center'
                                    href='https://www.facebook.com/profile.php?id=61550025038542'
                                    target='_blank'
                                >
                                    {" "}
                                    <FacebookOutlined
                                        style={{ fontSize: "1.4rem" }}
                                    />
                                </a>
                                <a
                                    className='w-auto h-auto items-center'
                                    href='https://www.facebook.com/profile.php?id=61550025038542'
                                    target='_blank'
                                >
                                    {" "}
                                    <YoutubeOutlined
                                        style={{ fontSize: "1.4rem" }}
                                    />
                                </a>
                                <a
                                    className='w-auto h-auto items-center'
                                    href='https://www.facebook.com/profile.php?id=61550025038542'
                                    target='_blank'
                                >
                                    {" "}
                                    <InstagramOutlined
                                        style={{ fontSize: "1.4rem" }}
                                    />
                                </a>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className='flex flex-col text-center md:text-left'>
                            <div className='w-auto h-auto font-extrabold text-lg pb-6'>
                                {t("Action")}
                            </div>
                            <div className='w-auto h-auto py-2 font-thin'>
                                <Link
                                    href={`/account`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Account")}
                                </Link>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <Link
                                    href={`/cart`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Cart")}
                                </Link>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <Link
                                    href={`/order`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Order")}
                                </Link>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <Link
                                    href={`/feedback`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Feedback")}
                                </Link>
                            </div>
                        </div>
                        {/* Receive information */}
                        <div className='flex flex-col text-center md:text-left'>
                            <div className='w-auto h-auto font-extrabold text-lg pb-4'>
                                {t("Receive-info")}
                            </div>
                            <div className='w-auto h-auto py-2 flex flex-row gap-1 items-center'>
                                <span className='w-auto'>{t("Name")}:</span>
                                <input
                                    type='text'
                                    placeholder={t("Name-plh")}
                                    className='rounded-md w-full p-2 focus:bg-white
                  focus:cursor-text outline-none text-placeholder'
                                ></input>
                            </div>
                            <div className='w-auto h-auto py-2 flex flex-row gap-1 items-center'>
                                <span className='whitespace-nowrap w-auto'>
                                    {t("Phone")}:{" "}
                                </span>
                                <input
                                    type='text'
                                    placeholder={t("Phone-plh")}
                                    className='rounded-md w-full p-2 focus:bg-primary-white
                  focus:cursor-text outline-none text-placeholder'
                                ></input>
                            </div>
                            <div className='w-auto h-auto py-2 flex flex-row gap-1 items-center'>
                                <span className='w-auto'>Email:</span>
                                <input
                                    type='text'
                                    placeholder={t("Email-plh")}
                                    className='rounded-md w-full p-2 focus:bg-primary-white
                  focus:cursor-text outline-none text-placeholder'
                                ></input>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <button className='w-full bg-primary-white hover:bg-primary-100 transition-all p-2 duration-200 text-primary rounded-md'>
                                    {t("Send")}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='h-auto w-auto font-extrabold text-3xl text-center font-serif py-8'>
                        HOME CUISINE
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Footer;
