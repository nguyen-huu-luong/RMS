import useEmailDataStore from "@/store/email";
import { Button, Col, Flex, Row, Space } from "antd";
import InputNumber from "../ButtonAttributes/InputNumber";

const Alignment = () => {
    const { activeNode, updateAttributes} = useEmailDataStore();
    const { section } = activeNode;
    const attributes = section.attributes;

    const handleChangePosition = (position: string) => {
        const newAttributes = {
            ...attributes,
            align: position
        }

        updateAttributes(newAttributes, activeNode.path)
    }


    const handleUpdateBoxSizing = (cssProperty: string, value: number) => {
        const newAttributes = {
            ...attributes,
            [cssProperty]: `${value}px`
        }

        updateAttributes(newAttributes, activeNode.path)
    }

    return (
        <Space direction="vertical">
            <span><b>Align</b></span>
            <Space>
                <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("left")}>Left</Button>
                <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("center")}>Center</Button>
                <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("right")}>Right</Button>
            </Space>

            <span><b>Padding</b></span>

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
                    value={Number(attributes["padding-left"].split("px")[0])}
                />
                <InputNumber 
                    leftAddon="Top"
                    cssProperty="padding-top"
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["padding-left"].split("px")[0])}
                />
                <InputNumber 
                    leftAddon="Bottom"
                    cssProperty="padding-bottom"
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["padding-left"].split("px")[0])}
                />
            </Row>


            <span><b>Margin</b></span>

            <Row gutter={[8, 8]}>
                <InputNumber
                    leftAddon="Left"
                    cssProperty="margin-left" 
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["margin-left"].split("px")[0])}
                />
                <InputNumber 
                    leftAddon="Right"
                    cssProperty="margin-right"
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["margin-right"].split("px")[0])}
                />
                <InputNumber 
                    leftAddon="Top"
                    cssProperty="margin-top"
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["margin-top"].split("px")[0])}
                />
                <InputNumber 
                    leftAddon="Bottom"
                    cssProperty="margin-bottom"
                    onChange={handleUpdateBoxSizing}
                    value={Number(attributes["margin-bottom"].split("px")[0])}
                />
            </Row>
            <div className="flex flex-wrap space-x-2" >
            </div>

        </Space>
    )
}

export default Alignment;