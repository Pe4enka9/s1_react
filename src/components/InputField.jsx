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
        setIsPasswordHidden(prev => !prev);
    }, [setIsPasswordHidden]);

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