import eyePasswordVisibleIcon from '../../icons/eye-password-visible.svg';
import eyePasswordHiddenIcon from '../../icons/eye-password-hidden.svg';
import {useState} from "react";

export default function MyInput({
                                    id,
                                    label,
                                    type,
                                    placeholder,
                                    min,
                                    name,
                                    formData,
                                    setFormData,
                                    errors,
                                    setErrors,
                                    validate,
                                }) {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        if (validate) {
            const error = validate(value, formData);

            setErrors(prev => {
                const newErrors = {...prev};

                if (error) {
                    newErrors[name] = error;
                } else {
                    delete newErrors[name];
                }

                return newErrors;
            });
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-white font-medium">{label}</label>

            <div className="relative">
                <input
                    type={type === 'password' && showPassword ? 'text' : type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    min={min}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full bg-[#222] text-white border-2 border-my-border rounded-lg px-2.5 py-1.5 outline-none focus:border-secondary transition-colors duration-300"
                />

                {type === 'password' && (
                    <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 w-6 h-6 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <img src={eyePasswordVisibleIcon} alt=""/>
                        ) : (
                            <img src={eyePasswordHiddenIcon} alt=""/>
                        )}
                    </button>
                )}
            </div>

            {errors && errors[name] && (
                <div className="text-secondary text-sm">{errors[name]}</div>
            )}
        </div>
    );
}
