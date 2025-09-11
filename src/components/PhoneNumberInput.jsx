import {IMaskInput} from "react-imask";
import preparePhoneValue from "../handlers/preparePhoneValue.js";
import {useCallback} from "react";

export default function PhoneNumberInput({formData, setFormData, errors, setErrors, inputRef = null}) {
    const handlePhoneAccept = useCallback((value) => {
        setFormData(prev => ({...prev, phone_number: value}));

        setErrors(prev => ({...prev, phone_number: ''}));
    }, [setErrors, setFormData]);

    return (
        <IMaskInput
            mask="+{7} (000) 000-00-00"
            type="tel"
            inputMode="tel"
            name="phone_number"
            id="phone_number"
            className={errors.phone_number ? 'error-input' : ''}
            placeholder="+7 (000) 000-00-00"
            value={formData.phone_number}
            onAccept={value => handlePhoneAccept(value)}
            prepare={(appended, masked) => preparePhoneValue(appended, masked)}
            autoComplete="tel phone"
            enterKeyHint="next"
            inputRef={inputRef}
        />
    )
}