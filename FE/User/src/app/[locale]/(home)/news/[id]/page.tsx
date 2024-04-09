"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next-intl/link";
export default function News() {
    const locale = useLocale();
    return (
        <div className='w-full font-serif h-auto py-10 px-20 bg-white rounded-xl items-center flex flex-col justify-start gap-2'>
            <div className='w-auto h-auto font-extrabold text-3xl text-primary font-serif'>
                Food
            </div>
            <div className='text-4xl font-bold  font-serif text-black flex flex-col justify-start gap-1 p-2'>
                Our latest pizza is now available at our restaurant!{" "}
            </div>
            <div className='w-auto'>
                <span className='font-bold text-xl text-slate-900'>
                    Writer:{" "}
                </span>
                <span className='font-normal text-xl text-slate-900'>
                    Nguyễn Văn A
                </span>
            </div>
            <div className='w-auto'>
                <span className='font-bold text-xl text-slate-900'>Date: </span>
                <span className='font-normal text-xl text-slate-900'>
                    20/9/2023
                </span>
            </div>
            <div className='w-full p-5'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur commodo, tortor sit amet maximus auctor, tortor turpis
                rutrum nisi, tincidunt aliquet sapien sapien ut eros. Nulla
                placerat imperdiet mauris, in malesuada lorem consectetur
                mattis. Sed vitae turpis metus. Quisque a ipsum ac turpis
                porttitor mattis tempor sit amet nisi. Fusce faucibus maximus
                dui ac tempor. Proin nec purus eros. Sed dictum accumsan erat,
                in vestibulum libero facilisis at. Ut pharetra iaculis dolor,
                vitae congue neque ornare hendrerit. Cras ac rutrum orci.
                Curabitur sit amet enim ipsum. Suspendisse a venenatis mauris.
                Donec eget auctor nisi. In sit amet est quis lacus maximus
                ornare eu et nibh. Etiam blandit nec nulla eu pretium. Sed
                tincidunt vehicula libero, ac mattis libero facilisis sit amet.
                Proin tempus odio augue, ut auctor magna eleifend vitae.
            </div>
            <div className='px-60'>
                <Image
                    src={"/news.jpg"}
                    alt={"News"}
                    width={300}
                    height={300}
                    className='w-full h-auto'
                    unoptimized
                />
            </div>
            <div className='w-full p-5'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur commodo, tortor sit amet maximus auctor, tortor turpis
                rutrum nisi, tincidunt aliquet sapien sapien ut eros. Nulla
                placerat imperdiet mauris, in malesuada lorem consectetur
                mattis. Sed vitae turpis metus. Quisque a ipsum ac turpis
                porttitor mattis tempor sit amet nisi. Fusce faucibus maximus
                dui ac tempor. Proin nec purus eros. Sed dictum accumsan erat,
                in vestibulum libero facilisis at. Ut pharetra iaculis dolor,
                vitae congue neque ornare hendrerit. Cras ac rutrum orci.
                Curabitur sit amet enim ipsum. Suspendisse a venenatis mauris.
                Donec eget auctor nisi. In sit amet est quis lacus maximus
                ornare eu et nibh. Etiam blandit nec nulla eu pretium. Sed
                tincidunt vehicula libero, ac mattis libero facilisis sit amet.
                Proin tempus odio augue, ut auctor magna eleifend vitae.
            </div>
        </div>
    );
}
