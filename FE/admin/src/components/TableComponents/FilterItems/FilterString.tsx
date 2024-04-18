import { CloseOutlined } from "@ant-design/icons"
import { Form, Input, Select } from "antd"
import { Option } from "antd/es/mentions"

interface IFilterStringInput {
    key: string,
    name: string,
    title: string,
    onDelete: () => void
}

const options = [
    {
        key: "1",
        title: "StartsWith",
        value: "startsWith",
    },
    {
        key: "2",
        title: "EndsWith",
        value: "endsWith",
    },
    {
        key: "3",
        title: "%Like",
        value: "like",
    },
    {
        key: "4",
        title: "Contains",
        value: "contains",
    }
]

export const FilterStringInput: React.FC<IFilterStringInput> = (props) => {
    const handleDeleteFilterItem = () => {
        props.onDelete()
    }
    return <div className="w-1/5 space-y-1" key={props.key}>
        <div className="flex justify-between">
            <p>{props.title}</p>
            <CloseOutlined className="cursor-pointer" onClick={handleDeleteFilterItem} />
        </div>
        <Form.Item name={[props.name, "expr"]} initialValue={options[0].value}>
            <Select className="w-full">
                {
                    options.map((item) => (
                        <Option key={item.key} value={item.value}>{item.title}</Option>
                    ))}
            </Select>
        </Form.Item>
        <Form.Item name={[props.name, "value"]}>
            <Input placeholder="Value" value="default" />
        </Form.Item>
    </div>
}