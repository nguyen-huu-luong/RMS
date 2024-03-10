import React from "react";

export interface IActionCellProps {
    text: string
}
export default function ActionCells({ text, ...props }: IActionCellProps) {
    return (
        <div className="flex items-center justify-center">
            <p>{text}</p>
        </div>
    )
}