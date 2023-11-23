"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next-intl/client";
import Image from "next/image";
import { PlusCircleFilled } from "@ant-design/icons";
import { Steps, theme } from "antd";

const Progress = () => {
    const next = () => {
        setCurrent(current + 1);
      };
    
      const prev = () => {
        setCurrent(current - 1);
      };
    const steps = [
        {
            title: "First",
            content: "First-content",
        },
        {
            title: "Second",
            content: "Second-content",
        },
        {
            title: "Last",
            content: "Last-content",
        },
    ];
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <>
            <Steps className="" current={current} items={items} />
            <div>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
                {current < steps.length - 1 && (
                    <button onClick={() => next()}>
                        Next
                    </button>
                )}
                {current === steps.length - 1 && (
                    <button
                    >
                        Done
                    </button>
                )}
                {current > 0 && (
                    <button style={{ margin: "0 8px" }} onClick={() => prev()}>
                        Previous
                    </button>
                )}
            </div>
        </>
    );
};

export default Progress;
