import { CloseOutlined } from "@ant-design/icons"
import { Form, Input, Select, SelectProps } from "antd"
import FormItem from "antd/es/form/FormItem"

interface IFilterSelect {
    key: string,
    name: string,
    title: string
    onDelete: () => void
    options: SelectProps['options']
}


export const FilterSelect: React.FC<IFilterSelect> = (props) => {
    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    const handleDeleteFilterItem = () => {
        props.onDelete()
    }

    return <div className="w-1/5 space-y-1" key={props.key}>
         <div className="flex justify-between">
            <p>{props.title}</p>
            <CloseOutlined className="cursor-pointer" onClick={handleDeleteFilterItem} />
        </div>
        <Form.Item name={[props.name, "expr"]} initialValue={"in"} hidden>
            <Input />
         </Form.Item>

        <Form.Item name={[props.name, "value"]}>
            <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Please select"
                onChange={handleChange}
                options={props.options}
            />
        </Form.Item>
    </div >
}