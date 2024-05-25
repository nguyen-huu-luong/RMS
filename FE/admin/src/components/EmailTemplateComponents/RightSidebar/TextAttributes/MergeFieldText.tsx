import { Button, Flex, Select, Tag } from "antd"
import { IMergeFieldData, mergeFieldData } from "./mergeFieldData";
import { useState } from "react";
import { ChooseVoucherModal } from "@/components/Modals/ChooseVoucherModal";
import { CloseCircleFilled } from "@ant-design/icons";


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

interface IMergeFieldText {
    onSelectField: (str: any) => void
}

const MergeFieldText: React.FC<IMergeFieldText> = ({ onSelectField }) => {
    const [value, setValue] = useState<string>("")
    const [selectedRecord, setSelectedRecord] = useState<{ id: number, name: string, type: string }>()
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setValue(value)
    };

    const getRandomColor = () => {
        return tagColor[Math.floor(Math.random() * tagColor.length)]
    }

    const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, value: string) => {
        e.preventDefault()

        if (selectedRecord?.id) {
            let newValue = value.replace("<id>", selectedRecord.id.toString())
            onSelectField(` {{${newValue}}} `)
        } else {
            onSelectField(` {{${value}}} `)
        }
    }


    return <div className="my-2 flex flex-col space-y-2 bg-white p-2 border rounded shadow lg:w-1/3">
        <p>Merge fields</p>
        <div className="flex items-center space-x-2">
            <Select
                style={{ width: 120 }}
                onChange={handleChange}
                options={options}
            />

            {
                value === "Voucher" && <>
                    {
                        selectedRecord ? <Tag className="px-2 py-1 bg-bgsecondary rounded" color={getRandomColor()}>
                            <span>{selectedRecord.name}</span>
                            {<CloseCircleFilled
                                className="ms-3 hover:text-red-500 cursor-pointer"
                                onClick={() => setSelectedRecord(undefined)}

                            />}
                        </Tag> :
                            <ChooseVoucherModal triggerText="Choose a voucher" onOk={(value: any) => { setSelectedRecord({ ...value, type: "Voucher" }) }} />


                    }
                </>
            }
        </div>

        <p>Field</p>
        {value && <Flex gap="4px 0" wrap="wrap">
            {mergeFieldData[`${value}`].fields.map((item) => (
                <Tag className="cursor-pointer" onClick={(e) => handleClick(e, item.value)} key={item.key} color={getRandomColor()}>{item.label}</Tag>
            ))}
        </Flex>}
    </div>
}

export default MergeFieldText;