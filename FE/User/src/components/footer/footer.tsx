"use client";
import Container from "../container";
import { useLocale, useTranslations } from "next-intl";
import Link from "next-intl/link";
import {
    FacebookOutlined,
    YoutubeOutlined,
    InstagramOutlined,
} from "@ant-design/icons";
import fetchGeneral from "@/lib/fetch-general";
import { useState } from "react";

const Footer = () => {
    const locale = useLocale();
    const t = useTranslations("Footer");
    const [notiSub, setNotiSub] = useState('')
    const handleCreateSubscriber = async (event: any) => {
        event.preventDefault()
        
        const data_body = {
            name: event.target.name.value,
            email: event.target.email.value,
            phone: event.target.phone.value,
            type: "lead"
        } 
        const data = await fetchGeneral({method: "POST", url: '/subscribers', body: data_body, data_return: true})
        if (data.status == 'Success') {
            event.target.name.value = ''
            event.target.email.value = ''
            event.target.phone.value = ''
            setNotiSub('')
        }
        else {
            setNotiSub(data.message)
        }
    }
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
                                Email: homecuisine.rms.global@gmail.com
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
                                    href={`/profile`}
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
                                    href={`/myorder`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Order")}
                                </Link>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <Link
                                    href={`/`}
                                    locale={locale}
                                    className='transition-all ease-in-out duration-200'
                                >
                                    {t("Feedback")}
                                </Link>
                            </div>
                        </div>
                        {/* Receive information */}
                        <form onSubmit={(e) => handleCreateSubscriber(e)}>
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
                                    id="name"
                                required></input>
                            </div>
                            <div className='w-auto h-auto py-2 flex flex-row gap-1 items-center'>
                                <span className='whitespace-nowrap w-auto'>
                                    {t("Phone")}:{" "}
                                </span>
                                <input
                                    required
                                    type='text'
                                    placeholder={t("Phone-plh")}
                                    className='rounded-md w-full p-2 focus:bg-primary-white
                  focus:cursor-text outline-none text-placeholder'
                                    id="phone"
                                ></input>
                            </div>
                            <div className='w-auto h-auto py-2 flex flex-row gap-1 items-center'>
                                <span className='w-auto'>Email:</span>
                                <input
                                    required
                                    type='text'
                                    placeholder={t("Email-plh")}
                                    className='rounded-md w-full p-2 focus:bg-primary-white
                  focus:cursor-text outline-none text-placeholder'
                                    id="email"
                                ></input>
                            </div>
                            <div className='w-auto h-auto text-center'>
                                <p  style={{fontSize: "12px"}}>{notiSub}</p>
                            </div>
                            <div className='w-auto h-auto py-2'>
                                <button className='w-full bg-primary-white hover:bg-primary-100 transition-all p-2 duration-200 text-primary rounded-md'>
                                    {t("Send")}
                                </button>
                            </div>
                        </div>
                        </form>
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
