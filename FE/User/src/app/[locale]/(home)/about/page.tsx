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
                    src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714968979/%22General%22/photo-1714525287722-71ffa49a1aa3_lb4uxy.jpg"}
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
                    <div className='font-normal text-xl font-serif break-all text-justify'>
                        In a small hometown in Vietnam, a group of friends named Hung, Luong, and Vuong harbored a shared love for food and a burning desire to create a unique dining experience.
                        We recognized the growing demand for innovative culinary concepts that catered to modern tastes and dietary preferences.
                        With our combined expertise in cooking, business, and design, we embarked on a journey to start our own restaurant.
                        However, we faced a highly competitive market, rising costs, and the challenge of standing out amidst a sea of eateries.
                        Undeterred, we embraced technology and social media, leveraging the power of online platforms to build a strong brand and connect with food enthusiasts.
                        Through crowdfunding campaigns and community support, we successfully raised the necessary funds and found a prime location for our venture.
                    </div>
                </div>
            </div>
            <div className='w-full h-auto flex flex-row justify-between gap-2 p-5'>
                <div className='w-full flex flex-col justify-start p-2'>
                    <div className='flex flex-row justify-between items-center'>
                        <span className='font-extrabold text-3xl text-black font-serif'>
                            How did we build the brand?
                        </span>
                    </div>
                    <div className='font-normal text-xl font-serif break-all text-justify'>
                        We understood that creating a successful restaurant was more than just serving delicious food;
                        it required a compelling story and a strong connection with our target audience.
                        With meticulous attention to detail, we meticulously crafted our brand's identity, from the logo and interior design to the menu and customer experience.
                        We believed in authenticity and sought to showcase our passion for locally sourced ingredients and sustainable practices.
                        Through social media, we shared our journey, engaging with our community and building anticipation for our grand opening.
                        By forging partnerships with local artisans and hosting charity events, we ingrained our brand in the hearts of the community.
                        Today, our restaurant stands as a testament to our unwavering commitment to quality, consistency, and a genuine connection with our customers.
                        our inspiring story serves as a reminder that building a successful restaurant brand requires not only exceptional culinary skills but also a well-crafted narrative and an unwavering dedication to creating a unique and memorable experience.
                    </div>
                </div>
                <Image
                    src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714969714/%22General%22/photo-1714692571386-0f26dec1bab5_neorus.jpg"}
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
                        src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714970032/%22General%22/photo-1560250097-0b93528c311a_ivhdjd.jpg"}
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
                        src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714970165/%22General%22/photo-1559418162-0d309d8d10a3_adbbke.jpg"}
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
                        src={"https://res.cloudinary.com/djdpobmlv/image/upload/v1714970233/%22General%22/photo-1605599355426-c671ba78fdab_oxnqd2.jpg"}
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
