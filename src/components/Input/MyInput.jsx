import eyePasswordVisibleIcon from '../../icons/eye-password-visible.svg';
import eyePasswordHiddenIcon from '../../icons/eye-password-hidden.svg';
import {useState} from "react";

export default function MyInput({
                                    id,
                                    label,
                                    type,
                                    placeholder,
                                    error,
                                    min = null,
                                    ...rest
                                }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col flex-1 gap-1.5">
            <label htmlFor={id} className="text-white font-medium">{label}</label>

            <div className="relative">
                <input
                    type={type === 'password' && showPassword ? 'text' : type}
                    id={id}
                    placeholder={placeholder}
                    min={min}
                    className="w-full bg-[#222] text-white border-2 border-my-border rounded-lg px-2.5 py-1.5 outline-none focus:border-secondary transition-colors duration-300"
                    {...rest}
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

            {error && (
                <div className="text-secondary text-sm">{error.message}</div>
            )}
        </div>
    );
}
