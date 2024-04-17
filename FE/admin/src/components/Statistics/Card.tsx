import React from "react";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { convertUnit } from "@/lib/utils/convertUnit";
const Card = ({
    name,
    current,
    before,
}: {
    name: string;
    current: number;
    before: number;
}) => {
    return (
        <div className='w-full h-32 rounded-xl p-5 bg-white shadow-md flex justify-center items-center'>
            <div className='w-auto h-auto flex justify-between gap-2 items-center text-black'>
                <div className='flex flex-col justify-between gap-1 items-center'>
                    <span>{convertUnit(current)}</span>
                    <span>{name}</span>
                </div>
                <div
                    className={`w-auto h-auto flex justify-start gap-1 items-center ${
                        current - before < 0 ? "text-red-600" : "text-green-600"
                    }`}
                >
                    <span>
                        {current - before < 0 ? (
                            <CaretDownOutlined />
                        ) : (
                            <CaretUpOutlined />
                        )}
                    </span>
                    <span>
                        {current - before < 0
                            ? convertUnit(before - current)
                            : convertUnit(current - before)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Card;
