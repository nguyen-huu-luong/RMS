import { UnderlineOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React, { ReactElement } from "react";

type ItemType = {
    icon: ReactElement,
    text: string
}
const items: ItemType[] = [
    {
        icon: <UnderlineOutlined />,
        text: 'title'
    },
    {
        icon: <UnderlineOutlined />,
        text: 'title'
    },
    {
        icon: <UnderlineOutlined />,
        text: 'title'
    },
    {
        icon: <UnderlineOutlined />,
        text: 'title'
    },
    {
        icon: <UnderlineOutlined />,
        text: 'title'
    }
]

function Home() {
    return (<main>
        <div>
            <h6>Item</h6>
            <div className="flex">
                {items.map((item: ItemType) => (<Card className="flex flex-row">
                    {item.icon}
                    <p>{item.text}</p>
                </Card>))}
            </div>
        </div>


    </main>);
}

export default Home;