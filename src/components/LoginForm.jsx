/** @type {string} */
import profile from '../img/icons/profile.svg';
import {useCallback, useEffect, useRef, useState} from "react";
import {IMaskInput} from "react-imask";
import preparePhoneValue from "../handlers/preparePhoneValue.js";
import swipeClose from "../handlers/swipeClose.js";
import axios from "axios";

export default function LoginForm({isActive, setIsActive, loginStep, setLoginStep}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        password: '',
    });
    // Ошибки валидации
    const [errors, setErrors] = useState({});
    // Закрытие формы
    const [isClosing, setIsClosing] = useState(false);
    // Скрытие пароля
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    // Загрузка
    const [isLoading, setIsLoading] = useState(false);
    // Ошибка сервера
    const [isServerError, setIsServerError] = useState(false)
    // Проверка отправляется ли форма сейчас
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisabledButton, setIsDisabledButton] = useState(true);

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

    // Блокировка кнопки "Продолжить" или "Зарегистрироваться" в случае пустых полей
    useEffect(() => {
        let isDisabled = false;

        if (loginStep === 1) {
            isDisabled = formData.phone_number.length !== 18;
        } else if (loginStep === 2) {
            isDisabled = !formData.password.trim();
        }

        setIsDisabledButton(isDisabled);
    }, [formData.password, formData.phone_number.length, loginStep]);

    const handlePhoneAccept = (value) => {
        setFormData({...formData, phone_number: value});

        const phoneNumberInput = document.getElementById('phone_number');

        phoneNumberInput.classList.remove('error-input');
        phoneNumberInput.nextSibling.classList.remove('active');
        setErrors({...errors, phone_number: ''});
    }

    // Фокус на следующий input после события blur (только для номера телефона)
    const handleOnBlur = () => {
        if (formData.phone_number.length === 18) {
            setIsDisabledButton(false);
            firstNameInputRef.current?.focus();
            handleContinue();
        } else {
            setIsDisabledButton(true);
        }
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});

        event.target.classList.remove('error-input');
        event.target.nextSibling.classList.remove('active');
        setErrors({...errors, [name]: ''});
    }

    const handleBack = () => {
        setLoginStep(prev => prev - 1);
    }

    const handleCancel = useCallback(() => {
        document.body.style.overflowY = 'auto';
        setIsActive({register: false, login: false, booking: false});
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
                if (!isLoading && !isSubmitting) {
                    setIsSubmitting(true);
                    handleSubmit(e);
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loginStep === 2) {
            try {
                setIsLoading(true);
                setErrors({});
                setIsServerError(false);

                const response = await axios.post(import.meta.env.VITE_API_URL + '/login', formData);


                if (response.status === 200) {
                    setIsActive({register: false, login: false, booking: false});
                    setFormData({phone_number: '', password: ''});

                    const timer = setTimeout(() =>
                            setLoginStep(0),
                        1000);

                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    window.dispatchEvent(new Event('storage'));

                    return () => clearTimeout(timer);
                }
            } catch (err) {
                if (err.code === 'ERR_NETWORK') {
                    setIsServerError(true);

                    const timer = setTimeout(() =>
                            setIsServerError(false),
                        2000);

                    return () => clearTimeout(timer);
                } else if (err.status === 401) {
                    setErrors({password: 'Неверный логин или пароль'});
                    return;
                }

                const currentErrors = err.response.data.errors;
                setErrors(currentErrors);

                // Переход к шагу, где возникла ошибка
                if (currentErrors.password) {
                    setLoginStep(2);
                } else if (currentErrors.phone_number) {
                    setLoginStep(1)
                }
            } finally {
                setIsLoading(false);
                setIsSubmitting(false);
            }
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
                                className={errors.phone_number ? 'error-input' : ''}
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
                                onBlur={handleOnBlur}
                            />
                            {<p className={`error ${errors.phone_number ? 'active' : ''}`}>{errors.phone_number}</p>}
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
                                className={errors.password ? 'error-input' : ''}
                                placeholder="Введите пароль"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                enterKeyHint="done"
                                onKeyDown={handleKeyDown}
                                ref={passwordInputRef}
                            />
                            {<p className={`error ${errors.password ? 'active' : ''}`}>{errors.password}</p>}

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
                        disabled={isDisabledButton || isLoading}
                    >
                        {loginStep === 2 && !isServerError ? 'Войти'
                            : loginStep === 2 && isServerError ? 'Ошибка сервера'
                                : 'Продолжить'}
                        <div className={`loader ${isLoading ? 'active' : ''}`}></div>
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