import {useCallback} from "react";

export default function InputField({
                                       id,
                                       label,
                                       children,
                                       isPasswordHidden,
                                       setIsPasswordHidden,
                                       error = '',
                                       isPassword = false
                                   }) {
    const toggleEyePassword = useCallback(() => {
        if (typeof isPasswordHidden === 'object') {
            if (id === 'password') {
                setIsPasswordHidden(prev => ({
                    ...prev,
                    password_register: !prev.password_register,
                }));
            } else if (id === 'password_confirmation') {
                setIsPasswordHidden(prev => ({
                    ...prev,
                    password_confirmation: !prev.password_confirmation,
                }));
            }
        } else {
            setIsPasswordHidden(prev => !prev);
        }
    }, [id, isPasswordHidden, setIsPasswordHidden]);

    return (
        <div className="field">
            <label htmlFor={id}>{label}</label>
            {children}

            {error && <p className="error">{error}</p>}

            {isPassword && (
                <button
                    type="button"
                    className={`eye-password ${isPasswordHidden ? 'hidden' : 'visible'}`}
                    onClick={toggleEyePassword}
                />
            )}
        </div>
    )
}