import { Card, Space } from "antd";
import { useDrag } from "react-dnd";

export interface IElementCard {
    element: {
        icon: JSX.Element;
        text: string;
        tagName: string;
        isDisabled?: boolean;
    };
    index: number;
}

const ElementCard = ({ element, index }: IElementCard) => {
    const [collected, drag] = useDrag(() => ({
        type: element.tagName,
        item: { type: element.tagName, keys: "children" },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }));

    return (
        <Card
            ref={drag}
        >
            <p>{element.text}</p>
            {element.icon}
        </Card>
    );
};

export default ElementCard ;