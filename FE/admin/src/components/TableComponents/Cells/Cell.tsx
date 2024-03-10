import React, { ReactNode } from "react";

enum CellType {
    Document = 'docoment',
    Profile = 'profile',
    Text = 'text',
    Link = 'link',
    Date = 'date',
    Tag = 'tag',
    Status = 'status',
    Action = 'action',
    Money = 'money',
    Checkbox = 'checkbox',
}

export interface ICellProps {
    type: CellType | string | "text",
    leftIcon?: React.FC,
    classname?: string,
    style?: string,
    rightIcon?: React.FC,
    children?: ReactNode,
    text? : string,
    actions?: string[],
    date?: Date | string,
    tags?: React.FC[],
}

export default function Cell({children, ...props} : ICellProps) {
    return (props.type === CellType.Action && <div>Action cell</div>) ||
        (props.type === CellType.Checkbox && <div>Action cell</div>) ||
        (props.type === CellType.Date && <div>Action cell</div>) ||
        (props.type === CellType.Document && <div>Action cell</div>) ||
        (props.type === CellType.Link && <div>Action cell</div>) ||
        (props.type === CellType.Money && <div>Action cell</div>) ||
        (props.type === CellType.Profile && <div>Action cell</div>) ||
        (props.type === CellType.Status && <div>Action cell</div>) ||
        (props.type === CellType.Text && <div>Action cell</div>) ||
        (props.type === CellType.Tag && <div>Action cell</div>)
}