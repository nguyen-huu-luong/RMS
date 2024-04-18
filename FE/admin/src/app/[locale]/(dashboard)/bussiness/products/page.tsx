"use client"

import { Button} from 'antd';
import { AuditOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

function Home() {
    const { push } = useRouter();

    return (
        <div className="h-full " style={{ paddingBottom: "10px" }}>
            <div className="h-full bg-white p-20">
                <div className="h-full border-2 rounded p-5 py-14">
                    <p className='text-center' style={{fontSize: "22px"}}>Product Management</p>
                    <div className="flex justify-evenly items-center h-full">
                        <div >
                            <div className='inline-block border-2 rounded py-5 px-14' style={{borderColor: "#69b1ff"}}>
                                <p className='text-center' style={{ color: "#1677ff", fontSize: "20px" }}>Dish Management</p>
                                <div className="mt-5 text-center " >
                                    <AuditOutlined style={{ fontSize: "100px", color: "#1677ff" }} />
                                </div>
                                <div className="mt-7 text-center">
                                    <Button size="large" style={{ backgroundColor: "#1677ff", color: "white" }}>Go To Page</Button>
                                </div>
                            </div>
                        </div>
                        <div >
                            <div className='inline-block border-2 rounded py-5 px-10' style={{borderColor: "#ffd666"}}>
                                <p className='text-center' style={{ color: "#fa8c16", fontSize: "20px" }}>Category Management</p>
                                <div className="mt-5 text-center " >
                                    <AppstoreAddOutlined style={{ fontSize: "100px", color: "#fa8c16" }} />
                                </div>
                                <div className="mt-7 text-center">
                                    <Button onClick={() => push(`/bussiness/products/categories`)} size="large" style={{ backgroundColor: "#fa8c16", color: "white" }}>Go To Page</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;