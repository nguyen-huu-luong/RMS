import { AiOutlineAim, AiOutlineInsertRowLeft } from "react-icons/ai"
import ElementCard, { IElementCard } from "./ElementCard"
import { Space } from "antd"
const items: IElementCard[] = [
    {
        element: {
            text: "Section",
            icon: <AiOutlineAim />,
            tagName: "mj-section"
        },
        index: 1
    },
    {
        element: {
            text: "Column",
            icon: <AiOutlineInsertRowLeft />,
            tagName: "mj-column"
        },
        index: 2
    }
]

export default function LayoutItems() {
    return <Space>
    {
        items.map((item: IElementCard) => (
            <ElementCard element={item.element} index={item.index} key={item.index} />
        ))
    }
    </Space>
}