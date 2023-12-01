import { Spin } from "antd";
export default function Loading() {
    return <div className="w-full h-full items-center justify-center flex-col align-middle">
        <Spin tip='Loading' size='large'/>
    </div>;
}
