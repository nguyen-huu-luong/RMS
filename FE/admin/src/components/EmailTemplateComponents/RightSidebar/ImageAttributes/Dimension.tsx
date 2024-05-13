import useEmailDataStore from "@/store/email";
import { Checkbox, InputNumber, Space, Tooltip } from "antd";
import { useState } from "react";

const Dimension = () => {
    const { activeNode, updateAttributes, updateContent, updateActiveNodeAttributes } = useEmailDataStore();
    const [isWidthAutoCheck, setIsWidthAutoCheck] = useState(activeNode && activeNode.section.attributes["width"] === "auto")
    const [isHeightAutoCheck, setIsHeightAutoCheck] = useState(activeNode && activeNode.section.attributes["height"] === "auto")
    const { section } = activeNode;

    const attributes = section.attributes;
    const handleUpdateAttributes = (cssProperty: string, value: number) => {
        const newAttributes = {
            ...attributes,
            [cssProperty]: (!value || value < 0) ? "auto" : `${value}px`
        }

        updateAttributes(newAttributes, activeNode.path)
        updateActiveNodeAttributes("attributes", newAttributes)
    }

    return (
        <Space direction="vertical">
            <div className="flex  flex-wrap items-center justify-start">
                <span className="px-2 py-2 h-10 bg-bgsecondary border rounded-s border-r-0 whitespace-nowrap">Width (px)</span>
                <InputNumber
                    disabled={isWidthAutoCheck}
                    min={0}
                    className="border px-2 py-2 h-10 bg-white flex-1 rounded-e"
                    style={{
                        marginLeft: -1
                    }}
                    type="number"
                    step="20"
                    defaultValue={Number(attributes["width"].split("px")[0])}
                    onChange={(value) => handleUpdateAttributes("width", Number(value))}
                    suffix={
                        <Tooltip title="Set with for image">
                            px
                        </Tooltip>
                    }
                />

                <span className="flex items-center ms-2" >
                    <Checkbox defaultChecked={isWidthAutoCheck} onChange={(e) => {
                        setIsWidthAutoCheck(!isWidthAutoCheck)
                        handleUpdateAttributes("width", -1)
                    }} />
                    <label className="whitespace-nowrap ms-2">Set auto</label>
                </span>
            </div>

            <div className="flex  flex-wrap items-center justify-start">
                <span className="px-2 py-2 h-10 bg-bgsecondary border rounded-s border-r-0 whitespace-nowrap">Height (px)</span>
                <InputNumber
                    disabled={isHeightAutoCheck}
                    min={0}
                    className="border px-2 py-2 h-10 bg-white flex-1 rounded-e"
                    style={{
                        marginLeft: -1
                    }}
                    type="number"
                    step="20"
                    defaultValue={Number(attributes["height"].split("px")[0])}
                    onChange={(value) => handleUpdateAttributes("height", Number(value))}
                    suffix={
                        <Tooltip title="Set with for image">
                            px
                        </Tooltip>
                    }
                />

                <span className="flex items-center ms-2" >
                    <Checkbox defaultChecked={isHeightAutoCheck} onChange={(e) => {
                        setIsHeightAutoCheck(!isHeightAutoCheck)
                        handleUpdateAttributes("height", -1)
                    }} />
                    <label className="whitespace-nowrap ms-2">Set auto</label>
                </span>
            </div>
        </Space  >)
}

export default Dimension;