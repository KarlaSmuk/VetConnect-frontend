import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StaticDateTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/hr';
import { useEffect, useState } from "react"
import { WorkingHours } from "../api/types/api.types";
import isoWeek from 'dayjs/plugin/isoWeek'
import updateLocale from 'dayjs/plugin/updateLocale'

const muiTheme = createTheme({});
dayjs.locale('hr');
dayjs.extend(isoWeek)
// dayjs.extend(updateLocale)
// dayjs.updateLocale('hr', {
//     week:{
//         dow: 1
//     }
// })

interface CalendarProps {
    workingHours: WorkingHours[];
}

export default function Calendar({
    workingHours
}: CalendarProps) {

    const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs(new Date()));
    const [selectedMinTime, setSelectedMinTime] = useState<Dayjs | null>();
    const [selectedMaxTime, setSelectedMaxTime] = useState<Dayjs | null>();


    useEffect(() => {
        console.log(workingHours)
    }, [workingHours])

    const handleChange = (datetime: Dayjs | null) => {
        const selectedDay = dayjs(datetime).isoWeekday(); // returns index of day of week
        const daySchedule = workingHours.find(item => item.day === selectedDay); // 1-7
        // Set minTime and maxTime based on the schedule for the selected day
        if (daySchedule && daySchedule.openingTime && daySchedule.closingTime) {
            const openingTime = dayjs(daySchedule.openingTime, 'HH:mm');
            const closingTime = dayjs(daySchedule.closingTime, 'HH:mm');
            setSelectedMinTime(openingTime);
            setSelectedMaxTime(closingTime);
        }else{
          
            setSelectedMinTime(undefined);
            setSelectedMaxTime(undefined);
            
        }
    };

    const handleSubmit = (newDate: Dayjs | null) => {
        if (newDate !== null) {
            setSelectedDateTime(newDate);
            console.log(newDate.toISOString());
        }
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hr" localeText={{ cancelButtonLabel: 'Odustani', okButtonLabel: 'Rezerviraj', dateTimePickerToolbarTitle: 'Odaberite datum i vrijeme termina' }}>
                <StaticDateTimePicker
                    className="border p-4"
                    defaultValue={dayjs(new Date())}
                    onChange={handleChange}
                    minDate={dayjs(new Date())}
                    maxDate={dayjs().add(7, 'day')}
                    onAccept={handleSubmit}
                    minTime={selectedMinTime!}
                    maxTime={selectedMaxTime!}
                    slotProps={{
                        actionBar: {
                            actions: ['accept']
                        }
                    }}
                    disabled={workingHours === undefined}

                />

            </LocalizationProvider>
        </ThemeProvider>


    )
}