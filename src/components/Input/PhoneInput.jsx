import {IMaskInput} from "react-imask";

export default function PhoneInput({
                                       id,
                                       formData,
                                       setFormData,
                                       errors,
                                       setErrors,
                                       validate,
                                   }) {
    const handleChange = (value) => {
        setFormData(prev => ({...prev, phone: value}));

        if (validate) {
            const error = validate(value);

            setErrors(prev => {
                const newErrors = {...prev};

                if (error) {
                    newErrors.phone = error;
                } else {
                    delete newErrors.phone;
                }

                return newErrors;
            });
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-white font-medium">Номер телефона</label>

            <div className="relative">
                <IMaskInput
                    type="tel"
                    name="phone"
                    id={id}
                    placeholder="+7 (000) 000-00-00"
                    value={formData.phone}
                    onAccept={handleChange}
                    className="w-full bg-[#222] text-white border-2 border-my-border rounded-lg px-2.5 py-1.5 outline-none focus:border-secondary transition-colors duration-300"
                    mask="+{7} (000) 000-00-00"
                />
            </div>

            {errors && errors.phone && (
                <div className="text-secondary text-sm">{errors.phone}</div>
            )}
        </div>
    );
}
