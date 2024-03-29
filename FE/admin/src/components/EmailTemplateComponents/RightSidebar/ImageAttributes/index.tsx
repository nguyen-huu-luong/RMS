import { Collapse, CollapseProps } from "antd";
import Setting from "./Setting";
import Alignment from "./Alignment";
import Dimension from "./Dimension";
import useEmailDataStore from "@/store/email";
import { useEffect, useState } from "react";

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'Setting',
        children: <Setting />,
    },
    {
        key: '2',
        label: 'Alignment',
        children: <Alignment />
    },
    {
        key: '3',
        label: 'Dimension',
        children: <Dimension />
    },
];
const ImageAttributes = () => {

    const { activeNode } = useEmailDataStore()
    const [content, setContent] = useState("")
    console.log(content)
    useEffect(() => {
        setContent((activeNode && activeNode.section.content) || "")
    }, [])

    if (!activeNode || (activeNode && activeNode.section.tagName !== "mj-image"))
        return <></>;

    return <Collapse  items={items} />
}

export default ImageAttributes;
