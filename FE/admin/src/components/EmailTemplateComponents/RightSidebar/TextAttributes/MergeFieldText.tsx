import { Flex, Select, Tag } from "antd"
import { IMergeFieldData, mergeFieldData } from "./mergeFieldData";
import { useState } from "react";


const options = [
    { value: 'Person', label: 'Person' },
    { value: 'RestaurentInfo', label: 'Restaurent Information' },
    { value: 'Dish', label: 'Dish' },
    { value: 'Voucher', label: 'Voucher' },
    { value: 'Order', label: 'Order' },
]

const tagColor = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
]

interface IMergeFieldText  {
    onSelectField: (str: any) => void
}

const MergeFieldText: React.FC<IMergeFieldText> = ({onSelectField}) => {
    const [value, setValue] = useState<string>("")
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setValue(value)
    };

    const getRandomColor = () => {
        return tagColor[Math.floor(Math.random() * tagColor.length)]
    }

    const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, value: string) => {
        e.preventDefault()
        onSelectField(` {{${value}}} `)
    }


    return <div className="my-2 flex flex-col space-y-2">
        <p>Merge fields</p>
        <Select
            style={{ width: 120 }}
            onChange={handleChange}
            options={options}
        />

        {value  && <Flex gap="4px 0" wrap="wrap">
           { mergeFieldData[`${value}`].fields.map((item) => (
            <Tag className="cursor-pointer" onClick={(e) => handleClick(e, item.value)} key= {item.key} color={getRandomColor()}>{item.label}</Tag>
           ))}
        </Flex>}
    </div>
}

export default MergeFieldText;