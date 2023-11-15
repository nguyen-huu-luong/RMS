"use client";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Image from "next/image";
const Slider = ({
    params,
}: {
    params: {
        images: string[];
    };
}) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const previousSlide = (): void => {
        let isFirst: boolean = currentSlide === 0;
        let newSlide: number = isFirst
            ? params.images.length - 1
            : currentSlide - 1;
        setCurrentSlide(newSlide);
    };

    const nextSlide = (): void => {
        let isLast: boolean = currentSlide === params.images.length - 1;
        let newSlide: number = isLast ? 0 : currentSlide + 1;
        setCurrentSlide(newSlide);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide]);
    return (
        <div className='overflow-hidden relative rounded-2xl'>
            <div
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                className={`flex transition duration-500`}
            >
                {params.images.map((img, index) => {
                    return (
                        <img
                            key={"Picture" + index.toString()}
                            src={img}
                            alt={`Picture ${index}`}
                            className='w-80 h-80'
                        ></img>
                    );
                })}
            </div>
            <div
                onClick={previousSlide}
                className='absolute top-[45%] -translate-x-0 rounded-full text-2xl hover:bg-primary/20 text-item-white/50 px-2 py-1 left-2 cursor-pointer duration-500'
            >
                <LeftOutlined />
            </div>
            <div
                onClick={nextSlide}
                className='absolute top-[45%] -translate-x-0 rounded-full text-2xl hover:bg-primary/20 text-item-white/50 px-2 py-1 right-2 cursor-pointer duration-500'
            >
                <RightOutlined />
            </div>
            <div className='absolute bottom-0 h-10 w-full gap-2 flex items-center flex-row justify-center'>
                {params.images.map((img, index) => {
                    return (
                        <span
                            key={"Index" + index.toString()}
                            className={`w-3 h-3 border-2 rounded-full cursor-pointer ${index === currentSlide? "bg-primary":"bg-white"} transition ease-in-out duration-300`}
                            onClick={()=>{setCurrentSlide(index)}}
                        ></span>
                    );
                })}
            </div>
        </div>
    );
};

export default Slider;
