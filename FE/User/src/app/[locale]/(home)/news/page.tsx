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
                    href={"/news/0"}
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
                        Introducing the pizza revolution you've been waiting for! 
                        Prepare to be blown away by our innovative new pizza creation that will redefine your perception of cheesy goodness
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
                            src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714978347/%22General%22/photo-1714752890679-7f329ccaa6de_l9xzww.jpg"}
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
                            Attention all food enthusiasts and discerning palates! ...
                            </div>
                        </div>
                    </Link>
                    <Link
                        locale={locale}
                        href={"/news/2"}
                        className='w-auto h-auto flex flex-row justify-between gap-2 hover:bg-slate-200 cursor-pointer rounded-xl p-5'
                    >
                        <Image
                            src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714978732/%22General%22/photo-1607082351305-62d667815b4a_jggp1s.jpg"}
                            alt={"News"}
                            width={150}
                            height={120}
                            className=''
                            unoptimized
                        />
                        <div className='w-full flex flex-col justify-between p-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='font-extrabold text-2xl font-serif'>
                                    Big sale - Special offer
                                </span>
                                <span className='font-extrabold text-xl font-serif text-primary'>
                                    News
                                </span>
                            </div>
                            <div className='font-normal text-xl font-serif'>
                            It's time to satisfy your cravings and indulge in a feast of flavors ...
                            </div>
                        </div>
                    </Link>
                    <Link
                        locale={locale}
                        href={"/news/3"}
                        className='w-auto h-auto flex flex-row justify-between gap-2 hover:bg-slate-200 cursor-pointer rounded-xl p-5'
                    >
                        <Image
                            src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714979515/%22General%22/360_F_316016017_eRRs0wfGneyPguUhwIbQkKlN9RZhl5GG_wwvfwb.jpg"}
                            alt={"News"}
                            width={150}
                            height={120}
                            className=''
                            unoptimized
                        />
                        <div className='w-full flex flex-col justify-between p-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='font-extrabold text-2xl font-serif'>
                                    Top 5 best restaurant
                                </span>
                                <span className='font-extrabold text-xl font-serif text-primary'>
                                    News
                                </span>
                            </div>
                            <div className='font-normal text-xl font-serif'>
                            Welcome to a culinary experience like no other, where excellence ...
                            </div>
                        </div>
                    </Link>
                    <Link
                        locale={locale}
                        href={"/news/4"}
                        className='w-auto h-auto flex flex-row justify-between gap-2 hover:bg-slate-200 cursor-pointer rounded-xl p-5'
                    >
                        <Image
                            src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714979967/%22General%22/images_t6i09z.png"}
                            alt={"News"}
                            width={150}
                            height={120}
                            className=''
                            unoptimized
                        />
                        <div className='w-full flex flex-col justify-between p-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='font-extrabold text-2xl font-serif'>
                                    We are hiring
                                </span>
                                <span className='font-extrabold text-xl font-serif text-primary'>
                                    News
                                </span>
                            </div>
                            <div className='font-normal text-xl font-serif'>
                            We are excited to announce that our esteemed restaurant ...
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
