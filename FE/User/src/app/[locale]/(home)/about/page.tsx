"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
export default function About() {
    const t = useTranslations("About");
    return (
        <div className='w-full h-auto py-10 px-20 bg-white rounded-xl items-center flex flex-col justify-start gap-5'>
            <div className='w-auto h-auto font-extrabold text-3xl text-primary '>
                {t("About")}
            </div>
            <div className='w-auto h-auto font-extrabold text-3xl text-black '>
                {t("Story")}
            </div>
            <div className='w-auto h-auto font-bold text-xl text-zinc-800 '>
                {t("This")}{" "}
            </div>
            <div className='w-full h-auto flex flex-row justify-between gap-2 p-5'>
                <Image
                    src={
                        "https://res.cloudinary.com/djdpobmlv/image/upload/v1714968979/%22General%22/photo-1714525287722-71ffa49a1aa3_lb4uxy.jpg"
                    }
                    alt={"News"}
                    width={500}
                    height={400}
                    className=''
                    unoptimized
                />
                <div className='w-full flex flex-col justify-start p-2'>
                    <div className='flex flex-row justify-between items-center'>
                        <span className='font-extrabold text-3xl text-black '>
                            {t("Title1")}{" "}
                        </span>
                    </div>
                    <div className='font-normal text-xl  break-all text-justify'>
                        {t("P1")}
                    </div>
                </div>
            </div>
            <div className='w-full h-auto flex flex-row justify-between gap-2 p-5'>
                <div className='w-full flex flex-col justify-start p-2'>
                    <div className='flex flex-row justify-between items-center'>
                        <span className='font-extrabold text-3xl text-black '>
                            {t("Title2")}
                        </span>
                    </div>
                    <div className='font-normal text-xl  break-all text-justify'>
                        {t("P2")}
                    </div>
                </div>
                <Image
                    src={
                        "https://res.cloudinary.com/djdpobmlv/image/upload/v1714969714/%22General%22/photo-1714692571386-0f26dec1bab5_neorus.jpg"
                    }
                    alt={"News"}
                    width={500}
                    height={400}
                    className=''
                    unoptimized
                />
            </div>
            <div className='w-auto h-auto font-extrabold text-3xl text-black '>
                {t("Member")}
            </div>
            <div className='flex flex-row justify-between w-full items-center p-5'>
                <div className='w-full flex flex-col justify-start gap-2 items-center'>
                    <Image
                        src={
                            "https://res.cloudinary.com/djdpobmlv/image/upload/v1714970032/%22General%22/photo-1560250097-0b93528c311a_ivhdjd.jpg"
                        }
                        alt={"News"}
                        width={300}
                        height={300}
                        className='aspect-square'
                        unoptimized
                    />
                    <div className='font-bold text-2xl text-black w-auto'>
                        Hung Nguyen - CEO
                    </div>
                </div>
                <div className='w-full flex flex-col justify-start gap-2 items-center'>
                    <Image
                        src={
                            "https://res.cloudinary.com/djdpobmlv/image/upload/v1714970165/%22General%22/photo-1559418162-0d309d8d10a3_adbbke.jpg"
                        }
                        alt={"News"}
                        width={300}
                        height={300}
                        className='aspect-square'
                        unoptimized
                    />
                    <div className='font-bold text-2xl text-black w-auto'>
                        Luong Nguyen - Director
                    </div>
                </div>
                <div className='w-full flex flex-col justify-start gap-2 items-center'>
                    <Image
                        src={
                            "https://res.cloudinary.com/djdpobmlv/image/upload/v1714970233/%22General%22/photo-1605599355426-c671ba78fdab_oxnqd2.jpg"
                        }
                        alt={"News"}
                        width={300}
                        height={300}
                        className='aspect-square'
                        unoptimized
                    />
                    <div className='font-bold text-2xl text-black w-auto'>
                        Vuong Lieu - Director
                    </div>
                </div>{" "}
            </div>
        </div>
    );
}
