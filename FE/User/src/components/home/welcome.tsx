import Image from "next/image";
const WelcomeImage = ({
    params,
}: {
    params: {
        name: string;
    };
}) => {
    return (
        <div className='w-full h-auto flex justify-start pr-5 py-10 pl-10 items-center rounded-2xl overflow-hidden relative'>
            <span
                className='text-menu flex flex-col h-full justify-center gap-5'
                style={{ zIndex: 1 }}
            >
                <span className='text-primary'>Deal of the weekend</span>
                <span className='text-menu font-extrabold text-3xl font-serif'>
                    Hello, {params.name.toUpperCase()}
                </span>
                <span className='text-item-black font-bold'>
                    Get <span className='text-primary'>MORE discount</span> on
                    every weekend.
                </span>
            </span>
            <div className=' flex-none h-80 w-full absolute top-0 right-0 z-0'>
                <Image
                    src='/home-banner.png'
                    alt='Welcome image'
                    width={100}
                    height={100}
                    className='h-full w-full min-w-fit'
                    unoptimized
                />
            </div>
        </div>
    );
};

export default WelcomeImage;
