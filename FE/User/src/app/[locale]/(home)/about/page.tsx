"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
export default function About() {
    return (
        <div className='w-full font-serif h-auto py-10 px-20 bg-white rounded-xl items-center flex flex-col justify-start gap-5'>
            <div className='w-auto h-auto font-extrabold text-3xl text-primary font-serif'>
                ABOUT US
            </div>
            <div className='w-auto h-auto font-extrabold text-3xl text-black font-serif'>
                OUR STORY - FROM THE START
            </div>
            <div className='w-auto h-auto font-bold text-xl text-zinc-800 font-serif'>
                This is where we tell you all stories about us from the
                beginning till now{" "}
            </div>
            <div className='w-full h-auto flex flex-row justify-between gap-2 p-5'>
                <Image
                    src={"/news.jpg"}
                    alt={"News"}
                    width={500}
                    height={400}
                    className=''
                    unoptimized
                />
                <div className='w-full flex flex-col justify-start p-2'>
                    <div className='flex flex-row justify-between items-center'>
                        <span className='font-extrabold text-3xl text-black font-serif'>
                            From the beginning - How we started
                        </span>
                    </div>
                    <div className='font-normal text-xl font-serif break-all'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur commodo, tortor sit amet maximus auctor,
                        tortor turpis rutrum nisi, tincidunt aliquet sapien
                        sapien ut eros. Nulla placerat imperdiet mauris, in
                        malesuada lorem consectetur mattis. Sed vitae turpis
                        metus. Quisque a ipsum ac turpis porttitor mattis tempor
                        sit amet nisi. Fusce faucibus maximus dui ac tempor.
                        Proin nec purus eros. Sed dictum accumsan erat, in
                        vestibulum libero facilisis at. Ut pharetra iaculis
                        dolor, vitae congue neque ornare hendrerit. Cras ac
                        rutrum orci. Curabitur sit amet enim ipsum. Suspendisse
                        a venenatis mauris. Donec eget auctor nisi. In sit amet
                        est quis lacus maximus ornare eu et nibh. Etiam blandit
                        nec nulla eu pretium. Sed tincidunt vehicula libero, ac
                        mattis libero facilisis sit amet. Proin tempus odio
                        augue, ut auctor magna eleifend vitae.
                    </div>
                </div>
            </div>
            <div className='w-full h-auto flex flex-row justify-between gap-2 p-5'>
                <div className='w-full flex flex-col justify-start p-2'>
                    <div className='flex flex-row justify-between items-center'>
                        <span className='font-extrabold text-3xl text-black font-serif'>
                            From the beginning - How we started
                        </span>
                    </div>
                    <div className='font-normal text-xl font-serif break-all'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur commodo, tortor sit amet maximus auctor,
                        tortor turpis rutrum nisi, tincidunt aliquet sapien
                        sapien ut eros. Nulla placerat imperdiet mauris, in
                        malesuada lorem consectetur mattis. Sed vitae turpis
                        metus. Quisque a ipsum ac turpis porttitor mattis tempor
                        sit amet nisi. Fusce faucibus maximus dui ac tempor.
                        Proin nec purus eros. Sed dictum accumsan erat, in
                        vestibulum libero facilisis at. Ut pharetra iaculis
                        dolor, vitae congue neque ornare hendrerit. Cras ac
                        rutrum orci. Curabitur sit amet enim ipsum. Suspendisse
                        a venenatis mauris. Donec eget auctor nisi. In sit amet
                        est quis lacus maximus ornare eu et nibh. Etiam blandit
                        nec nulla eu pretium. Sed tincidunt vehicula libero, ac
                        mattis libero facilisis sit amet. Proin tempus odio
                        augue, ut auctor magna eleifend vitae.
                    </div>
                </div>
                <Image
                    src={"/news.jpg"}
                    alt={"News"}
                    width={500}
                    height={400}
                    className=''
                    unoptimized
                />
            </div>
            <div className='w-auto h-auto font-extrabold text-3xl text-black font-serif'>
                OUR MEMBERS
            </div>
            <div className='flex flex-row justify-between w-full items-center p-5'>
                <div className='w-full flex flex-col justify-start gap-2 items-center'>
                    <Image
                        src={"/avatar.png"}
                        alt={"News"}
                        width={300}
                        height={300}
                        className='aspect-square'
                        unoptimized
                    />
                    <div className='font-bold text-2xl text-black w-auto'>
                        Nguyễn Hữu Lượng
                    </div>
                </div>
                <div className='w-full flex flex-col justify-start gap-2 items-center'>
                    <Image
                        src={"/avatar.png"}
                        alt={"News"}
                        width={300}
                        height={300}
                        className='aspect-square'
                        unoptimized
                    />
                    <div className='font-bold text-2xl text-black w-auto'>
                        Liễu Minh Vương
                    </div>
                </div>{" "}
                <div className='w-full flex flex-col justify-start gap-2 items-center'>
                    <Image
                        src={"/avatar.png"}
                        alt={"News"}
                        width={300}
                        height={300}
                        className='aspect-square'
                        unoptimized
                    />
                    <div className='font-bold text-2xl text-black w-auto'>
                        Nguyễn Hữu Hùng
                    </div>
                </div>
            </div>
        </div>
    );
}
