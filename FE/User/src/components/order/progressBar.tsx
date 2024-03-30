
import {
    Steps,
    ConfigProvider
} from "antd";
import { useTranslations } from "next-intl";
const Progress = ({current}: {current:number}) => {
    const t = useTranslations('Order');
    const steps = [
        {
            title: t('Cart'),
        },
        {
            title:  t('Order'),
        },
        {
            title:  t('Payment'),
        },
    ]
    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <div className='w-full h-auto p-10 rounded-3xl bg-primary-white'>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#EA6A12",
                        colorText: "#EA6A12",
                        colorPrimaryBorder: "rgb(251, 146, 60)",
                        colorSplit: "rgb(255, 247, 237)",
                        fontWeightStrong: 600,
                    },
                }}
            >
                <Steps className='' current={current} items={items} />
            </ConfigProvider>
        </div>
    );
};

export default Progress;
