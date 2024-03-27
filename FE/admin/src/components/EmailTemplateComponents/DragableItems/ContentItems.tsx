import { AiFillFund, AiOutlineAim, AiOutlineInsertRowLeft } from "react-icons/ai"
import ElementCard, { IElementCard } from "./ElementCard"
import { Space } from "antd"
const items: IElementCard[] = [
    {
        element: {
            text: "Text",
            icon: <AiOutlineAim />,
            tagName: "mj-text"
        },
        index: 1
    },
    {
        element: {
            text: "Button",
            icon: <AiOutlineInsertRowLeft />,
            tagName: "mj-button"
        },
        index: 2
    },
    {
        element: {
            text: "Carousel",
            icon: <AiOutlineInsertRowLeft />,
            tagName: "mj-carousel"
        },
        index: 3
    },
    {
        element: {
            text: "Image",
            icon: <AiOutlineInsertRowLeft />,
            tagName: "mj-image"
        },
        index: 4
    },

    {
        element: {
            text: "Spaceer",
            icon: <AiOutlineInsertRowLeft />,
            tagName: "mj-spacer"
        },
        index: 5
    },

]

export default function ContentItems() {
    return <Space wrap>
        {
            items.map((item: IElementCard) => (
                <ElementCard element={item.element} index={item.index} key={item.index} />
            ))
        }
    </Space>
}