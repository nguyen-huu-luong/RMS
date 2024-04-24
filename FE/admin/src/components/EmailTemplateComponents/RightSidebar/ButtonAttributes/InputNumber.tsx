import { Col } from "antd"
import { ChangeEvent } from "react"

export interface IInputNumberProps {
    cssProperty: string, 
    leftAddon: React.ReactNode | string,
    value: number,
    onChange: (key: string, value: number) => void
}

const InputNumber: React.FC<IInputNumberProps> = ({ cssProperty, leftAddon, value, onChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(cssProperty, Number(e.target.value))
    }

    console.log(value)
    return <Col span={12} className="flex items-center">
        <span className="px-2 py-2 bg-bgsecondary border w-16 rounded-s border-r-0">{leftAddon}</span>
        <input className="border px-2 py-2 bg-white w-full rounded-e" type="number" defaultValue={value} onChange={handleChange}/>
    </Col>
}

export default InputNumber;