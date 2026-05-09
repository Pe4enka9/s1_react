import {Controller} from "react-hook-form";
import MyFileInput from "./MyFileInput.jsx";

export default function FileInput({control, name, ...props}) {
    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => (
                <MyFileInput
                    {...props}
                    value={field.value}
                    error={fieldState.error}
                    onChange={(files) => field.onChange(files)}
                />
            )}
        />
    );
}