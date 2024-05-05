import { CalendarOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { useFormatter } from 'next-intl';
import { CSSProperties } from 'styled-components';


interface ITimeFormatter {
    time: string,
    className?: string,
    style?: CSSProperties,
    icon?: boolean
}

export const TimeFormatter: React.FC<ITimeFormatter> = ({ time, className, style, icon }) => {
    const format = useFormatter();
    const dateTime = new Date(time);

    // Renders "Nov 20, 2020"
    if (!time) return "Unknown"
    return <>
        <span className={`me-2 ${className}`} style={{...style}}> 
            {format.dateTime(dateTime, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric', minute: 'numeric'
            })}
        </span>
        {icon && <CalendarOutlined />}
    </>
}

export default TimeFormatter; 