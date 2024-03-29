import { useFormatter } from 'next-intl';


interface ITimeFormatter {
    time: string
}

export const TimeFormatter: React.FC<ITimeFormatter> = ({ time }) => {
    const format = useFormatter();
    const dateTime = new Date(time);

    // Renders "Nov 20, 2020"
    return <span> 
        {format.dateTime(dateTime, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric', minute: 'numeric'
        })}
    </span>
}

export default TimeFormatter; 