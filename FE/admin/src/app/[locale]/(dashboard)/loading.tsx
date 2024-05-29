import { Spin } from "antd";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="absolute inset-0 flex items-center justify-center" >
            <Spin />
        </div>)
}