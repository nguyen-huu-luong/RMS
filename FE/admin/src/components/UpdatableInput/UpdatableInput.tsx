import { EditOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, Input, Select, Space } from "antd"
import { FormItemInputProps } from "antd/es/form/FormItemInput"
import { useState } from "react"
import { CSSProperties } from "styled-components"
import "./custom.css"
import TextArea from "antd/es/input/TextArea"
import dayjs from 'dayjs';

interface IUpdatableInput extends FormItemInputProps {
    name: string
    label: React.ReactNode
    editmode: boolean
    type: "input" | "select" | "textarea" | "date"
    defaultValue: string,
    disabled?: boolean,
    onUpdate: (fieldname: string) => Promise<any>,
    options?: { value: string, label: string }[]
    style?: CSSProperties,
}

export const UpdatableInput: React.FC<IUpdatableInput> = (props) => {
    const [isEditItem, setIsEditItem] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUpdate = async () => {
        setLoading(true)
        try {
            await props.onUpdate(props.name)
            setIsEditItem(false)
            setLoading(false)

        } catch (error) {
            // setIsEditItem(false)
            setLoading(false)
        }
    }

    const label = (<div className="flex justify-between w-full my-label" style={{ width: "100%" }}>
        <p style={{ color: "#666" }}>{props.label}</p>
        <div className="my-label-button">
            {!props.editmode && !props.disabled && (
                isEditItem ? <Space>
                    <Button onClick={handleUpdate} loading={loading}>Update</Button>
                    <Button onClick={() => setIsEditItem(false)}>Cancel</Button>
                </Space> : <EditOutlined onClick={() => setIsEditItem(true)} className="editicon" />
            )}
        </div>
    </div>)

    const InputComponent = (props.type === "input" &&
        <Input
            defaultValue={props.defaultValue}
            disabled={!props.editmode && !isEditItem}
        />)
        ||
        (props.type === "textarea" &&
            <TextArea
                defaultValue={props.defaultValue}
                disabled={!props.editmode && !isEditItem}
            />)
        || (props.type === "select" && props.options &&
            <Select className="rounded-md" defaultValue={props.defaultValue} options={props.options} />)
        || (props.type === "date" && 
            <DatePicker defaultValue={dayjs(props.defaultValue)} disabled={!props.editmode && !isEditItem}/>)

    return (
        
       <>
            <Form.Item label={label} name={props.name} labelCol={{ style: { width: "100%" } }}>
                {(props.editmode || isEditItem) && !props.disabled ? InputComponent :
                    <b>{props.defaultValue}</b>
                }
            </Form.Item>
       </>
    )
}