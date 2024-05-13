import React from 'react';
import { ReconciliationOutlined, PieChartOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';

const TabNav = ({setReportType}: {setReportType: any}) => {
    const title = ["Business operation", "Customer group"]

    const tabClickHandle = (key: any) => {
        setReportType(key)
    }

    return (
        <>
            <div className='bg-white w-full flex justify-between rounded'>
                <div className='inline-block m-auto'>
                    <Tabs
                        defaultActiveKey="1"
                        items={[ReconciliationOutlined, PieChartOutlined].map((Icon, i) => {
                            const id = String(i + 1);
                            return {
                                key: id,
                                label: title[i],
                                icon: <Icon />,
                            };
                        })}
                        onTabClick ={tabClickHandle}
                    />
                </div>
            </div>
        </>
    )
};

export default TabNav
