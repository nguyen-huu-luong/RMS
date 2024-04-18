import { EditOutlined } from "@ant-design/icons"
import { Button, Form, Input, Select, Space } from "antd"
import { FormItemInputProps } from "antd/es/form/FormItemInput"
import { useState } from "react"
import { CSSProperties } from "styled-components"
import "./custom.css"
import TextArea from "antd/es/input/TextArea"

interface IUpdatableInput {
    name: string
    label: React.ReactNode
    editmode: boolean
    type: "input" | "select" | "textarea"
    defaultValue: string,
    onUpdate: (fieldname: string) => void,
    options?: string[]
    className?: FormItemInputProps
    style?: CSSProperties,
}

export const UpdatableInput: React.FC<IUpdatableInput> = (props) => {
    const [isEditItem, setIsEditItem] = useState(false)

    const handleClickEditButton = () => {

    }

    const label = (<div className="flex justify-between w-full my-label" style={{ width: "100%" }}>
        <p style={{ color: "#666" }}>{props.label}</p>
        <div className="my-label-button">
            {!props.editmode && (
                isEditItem ? <Space>
                    <Button onClick={() => props.onUpdate(props.name)}>Update</Button>
                    <Button onClick={() => setIsEditItem(false)}>Cancel</Button>
                </Space> : <EditOutlined onClick={() => setIsEditItem(true)} className="editicon" />
            )}
        </div>
    </div>)

    const InputComponent = (props.type === "input" &&
        <Input
            placeholder="Enter name of the campaign..."
            defaultValue={props.defaultValue}
            disabled={!props.editmode && !isEditItem}
        />) ||
        (props.type === "textarea" &&
            <TextArea
                placeholder="Enter name of the campaign..."
                defaultValue={props.defaultValue}
                disabled={!props.editmode && !isEditItem}
            />) || (props.type === "select" &&
                <Select className="rounded-md" defaultValue={props.defaultValue} >
                    {props.options && props.options.map((item) => (<Select.Option>{item}</Select.Option>))}
                </Select>)
    return (
        <Form.Item label={label} name={props.name} labelCol={{ style: { width: "100%" } }}>
            {props.editmode || isEditItem ? InputComponent :
                <b>{props.defaultValue}</b>
            }
        </Form.Item>
    )
}