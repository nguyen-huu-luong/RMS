import { useRouter, usePathname } from "next-intl/client";
import Link from "next-intl/link";
import Image from "next/image";
import { RightOutlined } from "@ant-design/icons";
import { useLocale } from "next-intl";
const Category = ({
    params,
}: {
    params: { category: string; state: boolean; thumbnails: string };
}) => {
    const locale = useLocale();
    return (
        <div
            className={`${
                params.state
                    ? "bg-primary-white before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-primary before:transition-all before:duration-500 hover:before:left-0 hover:before:w-full"
                    : "bg-primary hover:bg-orange-500 transition-all duration-300"
            } group relative h-48 w-32 rounded-xl overflow-hidden`}
        >
            <div className='relative z-1 w-full h-full p-5 flex flex-col items-center justify-between duration-300 transition-all'>
                <Image
                    src={params.thumbnails}
                    alt={`${params.category}-icon`}
                    width={50}
                    height={50}
                    unoptimized
                />
                <span
                    className={`font-bold ${
                        params.state
                            ? "text-menu group-hover:text-item-white"
                            : "text-item-white"
                    } duration-300 transition-all`}
                >
                    {params.category}
                </span>
                <hr
                    className={`w-8 ${
                        params.state
                            ? "border-orange-500 group-hover:border-white"
                            : "border-white"
                    } duration-300 transition-all`}
                />
                <Link
                    href={{
                        pathname: "/menu",
                        query: { category: params.category },
                    }}
                    className={`items-center flex justify-center w-5 h-5 rounded-full ${
                        params.state
                            ? "bg-primary text-item-white group-hover:text-primary group-hover:bg-primary-white"
                            : "bg-primary-white text-primary"
                    } duration-300 transition-all cursor-pointer`}
                >
                    <RightOutlined style={{ fontSize: "0.6rem" }} />
                </Link>
            </div>
        </div>
    );
};

export default Category;
