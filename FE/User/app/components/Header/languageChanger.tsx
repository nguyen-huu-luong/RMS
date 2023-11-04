import { useRouter, usePathname } from "next-intl/client";
import Image from "next/image";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";

const LanguageChanger = ({ params }: { params: { locale: string } }) => {
    const router = useRouter();
    const pathname = usePathname();
    function handleChange(location: string) {
        router.push(pathname, { locale: location });
    }
    const items: MenuProps["items"] = [
        {
            key: "vi",
            label: (
                <div className='flex-row justify-between align-middle'>
                    <Image
                        src='/vietnam.png'
                        alt='Vietnam Flag'
                        width={32}
                        height={32}
                    />
                </div>
            ),
            onClick: () => handleChange("vi"),
        },
        {
            key: "en",
            label: (
                <div className='flex-row justify-between align-middle'>
                    <Image
                        src='/england.png'
                        alt='England Flag'
                        width={32}
                        height={32}
                    />
                </div>
            ),
            onClick: () => handleChange("en"),
        },
    ];

    return (
        <Dropdown menu={{ items }} placement='bottom' trigger={["click"]}>
            <div className='flex-row justify-between align-middle cursor-pointer p-1 px-2 hover:bg-orange-50 rounded-lg transition duration-300 ease-in-out'>
                {params.locale === "vi" ? (
                    <Image
                        src='/vietnam.png'
                        alt='Vietnam Flag'
                        width={25}
                        height={25}
                    />
                ) : (
                    <Image
                        src='/england.png'
                        alt='England Flag'
                        width={25}
                        height={25}
                    />
                )}
            </div>
        </Dropdown>
    );
};

export default LanguageChanger;
