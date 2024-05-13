import { UploadImageModal } from "@/components/Modals/UploadImageModal";
import useEmailDataStore from "@/store/email";
import { Button, ColorPicker, ColorPickerProps, Flex, Image, Input, Space } from "antd";
import { Color } from "antd/es/color-picker";
import { ChangeEventHandler, useEffect, useState } from "react";

const Setting = () => {
    const {
        activeNode,
        updateAttributes,
        updateActiveNodeAttributes
    } = useEmailDataStore();
    const { section } = activeNode;
    const attributes = section.attributes;
    const [formData, setFormData] = useState({
        backgroundUrl: attributes["background-url"] || "",
        backgroundColor: attributes["background-color"] ||  ""  
    });

    // useEffect(() => {
    //     if  (attributes) {
    //         const backgroundProperties = attributes.split(" ")

    //     }
    // },  [])


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value)

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleApplyChange = () => {
        const newAttributes = {
            ...attributes,
        };

        if (formData.backgroundColor) {
            newAttributes["background-color"] = formData.backgroundColor
        }

        if  (formData.backgroundUrl) {
            newAttributes["background-url"] = formData.backgroundUrl
        }

        updateAttributes(newAttributes, activeNode.path);
        updateActiveNodeAttributes("attributes", newAttributes);
    };

    const handleChooseImage = (url:string) => {
        setFormData({
            ...formData,
            backgroundUrl: url,
            backgroundColor:  ""
        })
    }

    const handleChangeColor = (color: Color) => {
        setFormData(prev => ({ ...prev, backgroundColor: color.toHexString(), backgroundUrl: "" }))
    }


    return <Space direction="vertical" className="w-full">
        <div>
            <div className="w-24 h-24">
                <Image
                    className="cursor-pointer"
                    src={formData.backgroundUrl}
                    height={"100%"}
                    width={"100%"}
                    // width={100}
                    // height={100}
                />
            </div>
            {/* <div
                style={{
                    width: 100,
                    height: 100,
                    backgroundImage: `url("${formData.src}")`,
                    backgroundSize: "cover"
                }}
            ></div> */}
            <UploadImageModal upload={(url:string) => handleChooseImage(url)}/>
        </div>

        <Flex className="border px-2 py-1 w-full rounded items-center">
            <b className="me-2 whitespace-nowrap">Background Image</b>
            <Input
                name="background-url"
                placeholder="https://example.com"
                value={formData.backgroundUrl}
                onChange={handleChange}
            />
        </Flex>

        <Flex className="border px-2 py-1 w-full rounded items-center">
            <b className="me-2 whitespace-nowrap">Background Color: </b>
            <ColorPicker value={formData.backgroundColor} className="justify-start" onChangeComplete={handleChangeColor} showText />
        </Flex>

        <Button type="primary" className="bg-primary" onClick={handleApplyChange}>Apply</Button>
    </Space>
}

export default Setting;