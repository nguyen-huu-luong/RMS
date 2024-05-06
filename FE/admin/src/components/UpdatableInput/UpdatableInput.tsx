import { EditOutlined } from "@ant-design/icons"
import { Button, Form, Input, Select, Space } from "antd"
import { FormItemInputProps } from "antd/es/form/FormItemInput"
import { useState } from "react"
import { CSSProperties } from "styled-components"
import "./custom.css"
import TextArea from "antd/es/input/TextArea"

interface IUpdatableInput extends FormItemInputProps {
    name: string
    label: React.ReactNode
    editmode: boolean
    type: "input" | "select" | "textarea"
    defaultValue: string,
    onUpdate: (fieldname: string) => void,
    options?: { value: string, label: string }[]
    style?: CSSProperties,
}

export const UpdatableInput: React.FC<IUpdatableInput> = (props) => {
    const [isEditItem, setIsEditItem] = useState(false)

    const handleUpdate = () => {
        props.onUpdate(props.name)
        setIsEditItem(false)
    }

    const label = (<div className="flex justify-between w-full my-label" style={{ width: "100%" }}>
        <p style={{ color: "#666" }}>{props.label}</p>
        <div className="my-label-button">
            {!props.editmode && (
                isEditItem ? <Space>
                    <Button onClick={handleUpdate}>Update</Button>
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
            />) || (props.type === "select" && props.options &&
                <Select className="rounded-md" defaultValue={props.defaultValue} options={props.options} />)

    return (
        <Form.Item label={label} name={props.name} labelCol={{ style: { width: "100%" } }}>
            {props.editmode || isEditItem ? InputComponent :
                <b>{props.defaultValue}</b>
            }
        </Form.Item>
    )
}