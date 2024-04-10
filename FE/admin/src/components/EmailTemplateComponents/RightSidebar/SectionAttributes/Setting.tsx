import useEmailDataStore from "@/store/email";
import { Button, ColorPicker, ColorPickerProps, Flex, Input, Space } from "antd";
import { Color } from "antd/es/color-picker";
import TextArea from "antd/es/input/TextArea";
import { ChangeEventHandler, useEffect, useState } from "react";

const Setting = () => {
    const { activeNode, updateAttributes, updateContent } = useEmailDataStore();
    const { section } = activeNode;
    const attributes = section.attributes;
    const [formData, setFormData] = useState({
        "background-url": attributes["background-url"],
        "background-color": attributes["background-color"]
    });

    const handleChangeImageUrl = () => {

    }

    const handleChangeBgColor = (color: string | Color) => {

    }


    return <Space direction="vertical" className="w-full">
        <Space>
            {/* <ImagePreview /> */}
            <Flex className="border px-2 py-1 w-full rounded items-center">
                <b className="me-2 whitespace-nowrap">Background Color: </b>
                <ColorPicker
                    value={formData["background-color"]}
                    className="justify-start"
                    onChangeComplete={(color => handleChangeBgColor(color))}
                    showText
                />
            </Flex>
            <Flex className="border px-2 py-1 w-full rounded items-center">
                <b className="me-2 whitespace-nowrap">Link to</b>
                <Input 
                    placeholder="https://example.com" 
                    value={formData["background-url"]} 
                    onChange={handleChangeImageUrl} 
                />
            </Flex>
        </Space>
    </Space>
}

export default Setting;