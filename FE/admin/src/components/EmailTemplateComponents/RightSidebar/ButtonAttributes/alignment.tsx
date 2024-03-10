import useEmailDataStore from "@/store/email";
import { Button, Space } from "antd";

const  Alignment = () => {
    const { activeNode, updateAttributes, updateContent } = useEmailDataStore();
    const { section } = activeNode;
    const attributes = section.attributes;

    const handleChangePosition = (position: string) => {
        const newAttributes = {
            ...attributes,
            align: position
        }

        updateAttributes(newAttributes, activeNode.path)
    }

    return <Space>
        <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("left")}>Left</Button>
        <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("center")}>Center</Button>
        <Button type="primary" className="bg-primary" onClick={() => handleChangePosition("right")}>Right</Button>
    </Space>
}

export default Alignment ;