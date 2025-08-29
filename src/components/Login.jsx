import {useCallback, useEffect, useRef, useState} from "react";
import {IMaskInput} from "react-imask";
/** @type {string} */
import profile from '../img/icons/profile.svg';
import preparePhoneValue from "../handlers/preparePhoneValue.js";
import swipeClose from "../handlers/swipeClose.js";

export default function Login({isActive, setIsActive, loginStep, setLoginStep}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        password: '',
    });
    const [isClosing, setIsClosing] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    const phoneInputRef = useRef(null);
    const firstNameInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    useEffect(() => {
        let timer;

        if (isActive.login) timer = setTimeout(() =>
                setIsClosing(true),
            1200)
        else timer = setTimeout(() =>
                setIsClosing(false),
            1000);

        return () => clearTimeout(timer);
    }, [isActive.login]);

    const handlePhoneAccept = (value) => {
        setFormData({...formData, phone_number: value});
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }

    const handleBack = () => {
        setLoginStep(prev => prev - 1);
    }

    const handleCancel = useCallback(() => {
        document.body.style.overflowY = 'auto';
        setIsActive({register: false, login: false});
    }, [setIsActive]);

    const handleContinue = () => {
        if (loginStep >= 2) return;

        setLoginStep(prev => prev + 1);
    }

    const toggleEyePassword = () => {
        setIsPasswordHidden(prev => !prev);
    }

    useEffect(() => {
        return swipeClose(handleCancel);
    }, [handleCancel]);

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        if (loginStep === 2) {
            if (e.target.name === 'password') {
                handleSubmit(e);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loginStep === 2) {
            console.log("Форма отправлена!");
        }
    };

    return (
        <div id="login" className={`modal ${isActive.login ? 'active' : ''}`}>
            <form className={`${isActive.login ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
                <div className={`steps-progress step-${loginStep}`}>
                    <div className="steps-name">
                        <p className="small">Контакт</p>
                        <p className="small">Пароль</p>
                    </div>

                    <div className="steps-progress-bar"></div>
                </div>

                <div className="title">
                    <div className="icon">
                        <img src={profile} alt="Вход в аккаунт"/>
                    </div>

                    <h4>Вход в аккаунт</h4>
                </div>

                <div className={`step ${loginStep === 1 ? 'current' : 'prev'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="phone_number_login">Номер телефона</label>
                            <IMaskInput
                                mask="+{7} (000) 000-00-00"
                                type="tel"
                                inputMode="tel"
                                name="phone_number"
                                id="phone_number_login"
                                placeholder="+7 (000) 000-00-00"
                                value={formData.phone_number}
                                onAccept={value =>
                                    handlePhoneAccept(value)
                                }
                                prepare={(appended, masked) =>
                                    preparePhoneValue(appended, masked)
                                }
                                autoComplete="tel phone"
                                enterKeyHint="next"
                                inputRef={phoneInputRef}
                                onBlur={() => {
                                    firstNameInputRef.current?.focus();
                                    handleContinue();
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className={`step ${loginStep === 2 ? 'current' : 'next'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="password_login">Пароль</label>
                            <input
                                type={isPasswordHidden ? "password" : "text"}
                                inputMode="text"
                                name="password"
                                id="password_login"
                                placeholder="Введите пароль"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                enterKeyHint="done"
                                onKeyDown={handleKeyDown}
                                ref={passwordInputRef}
                            />

                            <div
                                className={`eye-password ${isPasswordHidden ? 'hidden' : 'visible'}`}
                                onClick={toggleEyePassword}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button
                        type="button"
                        className="btn"
                        onClick={loginStep === 2 ? handleSubmit : handleContinue}
                    >
                        {loginStep === 2 ? 'Войти' : 'Продолжить'}
                    </button>

                    <button
                        type="button"
                        className="btn cancel"
                        onClick={loginStep === 1 ? handleCancel : handleBack}
                    >
                        {loginStep === 1 ? 'Отмена' : 'Назад'}
                    </button>
                </div>
            </form>
        </div>
    )
}