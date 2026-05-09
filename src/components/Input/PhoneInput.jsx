import {IMaskInput} from "react-imask";
import {forwardRef} from "react";

export const PhoneInput = forwardRef(({
                                          value,
                                          onChange,
                                          ...props
                                      }, ref) => {
    return (
        <IMaskInput
            {...props}
            inputRef={ref}
            mask="+{7} (000) 000-00-00"
            value={value}
            onAccept={(val) => onChange(val)}
            className="input input--secondary"
        />
    );
});
