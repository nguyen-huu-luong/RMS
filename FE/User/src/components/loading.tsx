import { Spin, ConfigProvider } from "antd";
export default function Loading() {
    return (
        <div className='w-full h-full items-center justify-center flex flex-col align-middle p-52'>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#EA6A12",
                    },
                }}
            >
                <Spin tip='Loading' size='large' />
            </ConfigProvider>
        </div>
    );
}
