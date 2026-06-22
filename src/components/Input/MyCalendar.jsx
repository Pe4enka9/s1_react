import {Calendar, Surface} from "@heroui/react";

export default function MyCalendar({field}) {
    return (
        <div className="flex justify-center items-center">
            <Surface
                className="p-3 rounded-3xl"
                variant="secondary"
            >
                <Calendar
                    value={field.value}
                    onChange={field.onChange}
                >
                    <Calendar.Header>
                        <Calendar.Heading/>
                        <Calendar.NavButton slot="previous"/>
                        <Calendar.NavButton slot="next"/>
                    </Calendar.Header>
                    <Calendar.Grid>
                        <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>
                                {day}
                            </Calendar.HeaderCell>}
                        </Calendar.GridHeader>
                        <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date}/>}
                        </Calendar.GridBody>
                    </Calendar.Grid>
                </Calendar>
            </Surface>
        </div>
    );
}
