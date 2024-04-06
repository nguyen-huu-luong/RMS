import { Collapse, CollapseProps } from "antd";

import useEmailDataStore from "@/store/email";
import { useEffect, useState } from "react";

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'Setting',
        children: <></>,
    },
    {
        key: '2',
        label: 'Alignment',
        children: <></>,

    },
    {
        key: '3',
        label: 'Dimension',
        children: <></>,

    },
];
const SectionAttributes = () => {

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

export default SectionAttributes ;
