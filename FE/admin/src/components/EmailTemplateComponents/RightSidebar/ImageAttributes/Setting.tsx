import { UploadImageModal } from "@/components/Modals/UploadImageModal";
import useEmailDataStore from "@/store/email";
import { Button, ColorPicker, ColorPickerProps, Flex, Image, Input, Space } from "antd";
import { Color } from "antd/es/color-picker";
import TextArea from "antd/es/input/TextArea";
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
        src: attributes.src,
    });

    useEffect(() => {
        setFormData({
            src: activeNode.section.attributes.src
        })
    }, [activeNode])

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
            ...formData
        };

        updateAttributes(newAttributes, activeNode.path);
        updateActiveNodeAttributes("attributes", newAttributes);
    };

    const handleChooseImage = (url:string) => {
        setFormData({
            ...formData,
            src: url
        })
    }

    return <Space direction="vertical" className="w-full">
        <div>
            <div className="w-24 h-24">
                <Image
                    className="cursor-pointer"
                    src={formData.src}
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
            <b className="me-2 whitespace-nowrap">Image url</b>
            <Input
                name="src"
                placeholder="https://example.com"
                value={formData.src}
                onChange={handleChange}
            />
        </Flex>


        <Button type="primary" className="bg-primary" onClick={handleApplyChange}>Apply</Button>
    </Space>
}

export default Setting;