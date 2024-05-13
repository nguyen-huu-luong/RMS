import useEmailDataStore from "@/store/email";
import { Button, ColorPicker, ColorPickerProps, Flex, Input, Space } from "antd";
import { Color } from "antd/es/color-picker";
import TextArea from "antd/es/input/TextArea";
import { ChangeEventHandler, useEffect, useState } from "react";

const Setting = () => {
    const { activeNode, updateAttributes, updateContent, updateActiveNodeAttributes } = useEmailDataStore();
    const { section } = activeNode;
    const attributes = section.attributes;
    const [formData, setFormData] = useState({
        "background-color": attributes["background-color"],
        color: attributes["color"],
        href: attributes["href"]
    });

    const [content, setContent] = useState(section.content);

    useEffect(() => {
        setContent(activeNode.section.content)
        setFormData({
            "background-color": activeNode.section.attributes["background-color"],
            color: activeNode.section.attributes["color"],
            href: activeNode.section.attributes["href"]
        })
    }, [activeNode])

    const handleChangeColor = (color: Color, type: string) => {
        console.log(color)
        if (type === "text") {
            setFormData(prev => ({ ...prev, color: color.toHexString    () }))
        } else if (type === "bg") {
            setFormData(prev => ({ ...prev, "background-color": color.toHexString() }))
        }
    }

    const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;

        setFormData(prev => ({ ...prev, href: url }))
    }

    const handleApplyChange = () => {
        const newAttributes = {
            ...attributes,
            ...formData
        };

        updateAttributes(newAttributes, activeNode.path);
        updateContent(content, activeNode.path);
        updateActiveNodeAttributes(newAttributes, activeNode.path)
    }

    return <Space direction="vertical" className="w-full">
        <Flex className="border px-2 py-1 w-full rounded items-center">
            <b className="me-2 whitespace-nowrap">Background Color: </b>
            <ColorPicker value={formData["background-color"]} className="justify-start" onChangeComplete={(color => handleChangeColor(color, "bg"))} showText />
        </Flex>

        <Flex className="border px-2 py-1 w-full rounded items-center">
            <b className="me-2 whitespace-nowrap">Text Color: </b>
            <ColorPicker value={formData.color} className="justify-start" onChangeComplete={(color => handleChangeColor(color, "text"))} showText />
        </Flex>

        <Flex className="border px-2 py-1 w-full rounded items-center">
            <b className="me-2 whitespace-nowrap">Content</b>
            <TextArea value={content} onChange={(e) => setContent(e.target.value)} autoSize/>
        </Flex>

        <Flex className="border px-2 py-1 w-full rounded items-center">
            <b className="me-2 whitespace-nowrap">Link to</b>
            <Input placeholder="https://example.com" value={formData.href} onChange={handleChangeUrl} />
        </Flex>

        <Button type="primary" className="bg-primary" onClick={handleApplyChange}>Apply</Button>
    </Space>
}

export default Setting;