import {IMaskInput} from "react-imask";

export default function PhoneInput({
                                       id,
                                       error,
                                       ...rest
                                   }) {

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-white font-medium">Номер телефона</label>

            <IMaskInput
                type="tel"
                id={id}
                placeholder="+7 (000) 000-00-00"
                mask="+{7} (000) 000-00-00"
                className="w-full bg-[#222] text-white border-2 border-my-border rounded-lg px-2.5 py-1.5 outline-none focus:border-secondary transition-colors duration-300"
                name={rest.name}
                value={rest.value}
                onAccept={value => rest.onChange(value)}
                onBlur={rest.onBlur}
                inputRef={rest.ref}
            />

            {error && (
                <div className="text-secondary text-sm">{error.message}</div>
            )}
        </div>
    );
};
