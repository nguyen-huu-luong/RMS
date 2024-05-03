import { Collapse, CollapseProps, Space } from "antd";
import ContentItems from "../DragableItems/ContentItems";
import LayoutItems from "../DragableItems/LayoutItems";
import variables from "@/app/variables.module.scss";

const item: CollapseProps['items'] = [
    {
        key: 1,
        label: "Content items",
        children: <ContentItems />,

    },
    {
        key: 2,
        label: "Layout items",
        children: <LayoutItems />
    }
]



export default function LeftSidebar() {

    return (
        <div 
            className="flex space-x-2 bg-white border absolute h-screen" 
            style={{ width: "20%", left: 0, top: 0, bottom: 0 }}
        >
            <Collapse ghost items={item} className="w-full" />
        </div>)
}