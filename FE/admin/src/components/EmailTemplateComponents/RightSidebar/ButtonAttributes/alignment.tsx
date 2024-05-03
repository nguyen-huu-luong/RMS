import useEmailDataStore from "@/store/email";
import { Button, Col, Flex, Row, Space } from "antd";
import { MdOutlineMargin } from "react-icons/md";
import InputNumber from "../../shared/InputNumber";
import { useState } from "react";

const Alignment = () => {
    const { activeNode, updateAttributes, updateContent,updateActiveNodeAttributes } = useEmailDataStore();
    const { section } = activeNode;
    const attributes = section.attributes;
    
    const handleChangePosition = (position: string) => {
        const newAttributes = {
            ...attributes,
            align: position
        }

        updateAttributes(newAttributes, activeNode.path)
        updateActiveNodeAttributes("attributes",newAttributes)
    }



    const handleUpdateBoxSizing = (cssProperty: string, value: number) => {
        const newAttributes = {
            ...attributes,
            [cssProperty]: `${value}px`
        }

        updateAttributes(newAttributes, activeNode.path)        
        updateActiveNodeAttributes("attributes",newAttributes)
    }

    return (
        <Space direction="vertical">
            <span><b>Align</b></span>
            <Space>
                <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("left")}>Left</Button>
                <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("center")}>Center</Button>
                <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("right")}>Right</Button>
            </Space>

    


            <span><b>Margin</b></span>

            <Row gutter={[8, 8]}>
                <InputNumber
                    leftAddon="Left"
                    cssProperty="padding-left" 
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["padding-left"].split("px")[0])}
                />
                <InputNumber 
                    leftAddon="Right"
                    cssProperty="padding-right"
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["padding-right"].split("px")[0])}
                />
                <InputNumber 
                    leftAddon="Top"
                    cssProperty="padding-top"
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["padding-top"].split("px")[0])}
                />
                <InputNumber 
                    leftAddon="Bottom"
                    cssProperty="padding-bottom"
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["padding-bottom"].split("px")[0])}
                />
            </Row> 
        </Space>
    )
}

export default Alignment;