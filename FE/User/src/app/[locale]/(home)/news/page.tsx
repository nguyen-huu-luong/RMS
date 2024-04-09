"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next-intl/link";
export default function News() {
    const locale = useLocale();
    return (
        <div className='w-full h-auto py-10 px-20 bg-white rounded-xl flex flex-col justify-start gap-2'>
            <div className='text-4xl font-bold  font-serif text-black flex flex-col justify-start gap-1 p-5'>
                <span>GET THE BEST OFFER</span>
                <span className='text-xs font-normal text-slate-600'>
                    Eat the food you want at an affordable prices
                </span>
            </div>
            <div className='flex flex-row justify-between gap-5'>
                <Link
                    locale={locale}
                    href={"/news/1"}
                    className='aspect-square w-full flex flex-col justify-between rounded-lg hover:bg-slate-200 p-5 cursor-pointer'
                >
                    <div className='w-full'>
                        <Image
                            src={"/news.jpg"}
                            alt={"News"}
                            width={300}
                            height={300}
                            className='w-full h-auto'
                            unoptimized
                        />
                    </div>
                    <div className='w-full h-auto font-extrabold text-3xl text-primary font-serif'>
                        Food
                    </div>
                    <div className='h-auto text-xl w-full flex flex-col justify-start gap-4'>
                        <span className='font-bold font-serif text-3xl'>
                            Our latest pizza is now available at our restaurant!
                        </span>
                        <span>
                            Special diLorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Curabitur commodo, tortor sit amet
                            maximus auctor, tortor turpis rutrum nisi, tincidunt
                            ...
                        </span>
                    </div>
                </Link>
                <div className='aspect-square w-full h-auto flex flex-col justify-between gap-2'>
                    <Link
                        locale={locale}
                        href={"/news/1"}
                        className='w-auto h-auto flex flex-row justify-between gap-2 hover:bg-slate-200 cursor-pointer rounded-xl p-5'
                    >
                        <Image
                            src={"/news.jpg"}
                            alt={"News"}
                            width={150}
                            height={120}
                            className=''
                            unoptimized
                        />
                        <div className='w-full flex flex-col justify-between p-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='font-extrabold text-2xl font-serif'>
                                    Our new branch
                                </span>
                                <span className='font-extrabold text-xl font-serif text-primary'>
                                    News
                                </span>
                            </div>
                            <div className='font-normal text-xl font-serif'>
                                Special diLorem ipsum dolor sit amet,
                                consectetur adipiscing elit...
                            </div>
                        </div>
                    </Link>
                    <Link
                        locale={locale}
                        href={"/news/1"}
                        className='w-auto h-auto flex flex-row justify-between gap-2 hover:bg-slate-200 cursor-pointer rounded-xl p-5'
                    >
                        <Image
                            src={"/news.jpg"}
                            alt={"News"}
                            width={150}
                            height={120}
                            className=''
                            unoptimized
                        />
                        <div className='w-full flex flex-col justify-between p-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='font-extrabold text-2xl font-serif'>
                                    Our new branch
                                </span>
                                <span className='font-extrabold text-xl font-serif text-primary'>
                                    News
                                </span>
                            </div>
                            <div className='font-normal text-xl font-serif'>
                                Special diLorem ipsum dolor sit amet,
                                consectetur adipiscing elit...
                            </div>
                        </div>
                    </Link>
                    <Link
                        locale={locale}
                        href={"/news/1"}
                        className='w-auto h-auto flex flex-row justify-between gap-2 hover:bg-slate-200 cursor-pointer rounded-xl p-5'
                    >
                        <Image
                            src={"/news.jpg"}
                            alt={"News"}
                            width={150}
                            height={120}
                            className=''
                            unoptimized
                        />
                        <div className='w-full flex flex-col justify-between p-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='font-extrabold text-2xl font-serif'>
                                    Our new branch
                                </span>
                                <span className='font-extrabold text-xl font-serif text-primary'>
                                    News
                                </span>
                            </div>
                            <div className='font-normal text-xl font-serif'>
                                Special diLorem ipsum dolor sit amet,
                                consectetur adipiscing elit...
                            </div>
                        </div>
                    </Link>
                    <Link
                        locale={locale}
                        href={"/news/1"}
                        className='w-auto h-auto flex flex-row justify-between gap-2 hover:bg-slate-200 cursor-pointer rounded-xl p-5'
                    >
                        <Image
                            src={"/news.jpg"}
                            alt={"News"}
                            width={150}
                            height={120}
                            className=''
                            unoptimized
                        />
                        <div className='w-full flex flex-col justify-between p-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='font-extrabold text-2xl font-serif'>
                                    Our new branch
                                </span>
                                <span className='font-extrabold text-xl font-serif text-primary'>
                                    News
                                </span>
                            </div>
                            <div className='font-normal text-xl font-serif'>
                                Special diLorem ipsum dolor sit amet,
                                consectetur adipiscing elit...
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
