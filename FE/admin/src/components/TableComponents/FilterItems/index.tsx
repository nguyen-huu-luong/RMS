import { SelectProps } from "antd"
import { FilterStringInput } from "./FilterString"
import { FilterSelect } from "./FilterSelect"
import { FilterDate } from "./FilterDate"

interface IFilterItemProps {
    key: string,
    type: string,
    fieldName: string,
    title: string,
    onDelete: () => void
    options?: SelectProps['options']
}
export const FilterItem: React.FC<IFilterItemProps> = (props) => {
    return <>
        {props.type === "input" &&
        (<FilterStringInput
            key={props.key} name={props.fieldName}
            title={props.title}
            onDelete={props.onDelete}
        />)
        || (props.type === "select" &&
        <FilterSelect
            key={props.key}
            name={props.fieldName}
            title={props.title}
            options={props.options}
            onDelete={props.onDelete}
        />)
        || (props.type === "date" &&
        <FilterDate
            key={props.key}
            name={props.fieldName}
            title={props.title}
            onDelete={props.onDelete}
        />)}
    </>
}