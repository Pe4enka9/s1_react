import {Calendar, DateField, DatePicker, FieldError, Label, TimeField} from "@heroui/react";

export default function DateTimeInput({
                                          label,
                                          error,
                                          field,
                                      }) {
    return (
        <DatePicker
            value={field.value}
            onChange={field.onChange}
            granularity="minute"
            isInvalid={!!error}
            hideTimeZone
            isRequired
        >
            {({state}) => (
                <>
                    <Label>{label}</Label>

                    <DateField.Group variant="secondary" fullWidth>
                        <DateField.Input>
                            {(segment) => (
                                <DateField.Segment segment={segment}/>
                            )}
                        </DateField.Input>

                        <DateField.Suffix>
                            <DatePicker.Trigger>
                                <DatePicker.TriggerIndicator/>
                            </DatePicker.Trigger>
                        </DateField.Suffix>
                    </DateField.Group>

                    <FieldError>{error?.message}</FieldError>

                    <DatePicker.Popover className="flex flex-col gap-3">
                        <Calendar>
                            <Calendar.Header>
                                <Calendar.YearPickerTrigger>
                                    <Calendar.YearPickerTriggerHeading/>
                                    <Calendar.YearPickerTriggerIndicator/>
                                </Calendar.YearPickerTrigger>

                                <Calendar.NavButton slot="previous"/>
                                <Calendar.NavButton slot="next"/>
                            </Calendar.Header>

                            <Calendar.Grid>
                                <Calendar.GridHeader>
                                    {(day) => (
                                        <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                                    )}
                                </Calendar.GridHeader>

                                <Calendar.GridBody>
                                    {(date) => (
                                        <Calendar.Cell date={date}/>
                                    )}
                                </Calendar.GridBody>
                            </Calendar.Grid>

                            <Calendar.YearPickerGrid>
                                <Calendar.YearPickerGridBody>
                                    {({year}) => (
                                        <Calendar.YearPickerCell year={year}/>
                                    )}
                                </Calendar.YearPickerGridBody>
                            </Calendar.YearPickerGrid>
                        </Calendar>

                        <div className="flex items-center justify-between">
                            <Label>Время</Label>

                            <TimeField
                                granularity="minute"
                                value={state.timeValue}
                                onChange={(v) => state.setTimeValue(v)}
                                hideTimeZone
                            >
                                <TimeField.Group variant="secondary">
                                    <TimeField.Input>
                                        {(segment) => (
                                            <TimeField.Segment segment={segment}/>
                                        )}
                                    </TimeField.Input>
                                </TimeField.Group>
                            </TimeField>
                        </div>
                    </DatePicker.Popover>
                </>
            )}
        </DatePicker>
    );
}
