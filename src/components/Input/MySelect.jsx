import {Label, ListBox, Select} from "@heroui/react";

export default function MySelect({
                                     placeholder,
                                     label,
                                     field,
                                     children,
                                 }) {
    return (
        <Select
            placeholder={placeholder}
            variant="secondary"
            {...field}
        >
            <Label>{label}</Label>

            <Select.Trigger>
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>

            <Select.Popover>
                <ListBox>
                    {children}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}
