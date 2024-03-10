import React from "react";

export interface IActionCellProps {
    actions: React.FC<any>[]
}
export default function ActionCells({ actions, ...props }: IActionCellProps) {
    return (
        <div className="flex space-x-2">
            {actions.map((item, index) => {
                const Action = item;
                return <Action key={index} />
            })}
        </div>
    )
}