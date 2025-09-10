/** @type {string} */
import profile from '../img/icons/profile.svg';
import {useCallback, useEffect, useRef, useState} from "react";
import swipeClose from "../handlers/swipeClose.js";
import axios from "axios";
import InputField from "./InputField.jsx";
import PhoneNumberInput from "./PhoneNumberInput.jsx";
import Step from "./Step.jsx";

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
    const [isServerError, setIsServerError] = useState(false);
    // Проверка отправляется ли форма сейчас
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Блокировка кнопки
    const [isDisabledButton, setIsDisabledButton] = useState(true);
    // Активность формы
    const [isFormActive, setIsFormActive] = useState(false);
    const [direction, setDirection] = useState('next');
    const [prevStep, setPrevStep] = useState(null);

    const phoneInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    // Валидация
    const failedValidation = useCallback(() => {
        let isDisabled = false;

        if (loginStep === 1) {
            isDisabled = formData.phone_number.length !== 18;
        } else if (loginStep === 2) {
            isDisabled = !formData.password.trim();
        }

        setIsDisabledButton(isDisabled);
        return isDisabled;
    }, [formData.password, formData.phone_number.length, loginStep]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});

        e.target.classList.remove('error-input');
        e.target.nextSibling.classList.remove('active');
        setErrors({...errors, [name]: ''});
    }

    const handleBack = () => {
        if (loginStep <= 1) return;
        setDirection('prev');
        setPrevStep(loginStep);
        setLoginStep(prev => prev - 1);
    }

    const handleCancel = useCallback(() => {
        document.body.style.overflowY = 'auto';

        setIsClosing(true);
        setIsFormActive(false);

        const timer = setTimeout(() =>
                setIsActive(prev => ({...prev, login: false})),
            1000);

        return () => clearTimeout(timer);
    }, [setIsActive]);

    const handleContinue = () => {
        if (loginStep >= 2) return;
        setDirection('next');
        setPrevStep(loginStep);
        setLoginStep(prev => prev + 1);
    }

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        if (
            loginStep === 2 &&
            e.target.name === 'password' &&
            !isLoading && !isSubmitting && !failedValidation()
        ) {
            setIsSubmitting(true);
            handleSubmit(e);
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
                if (currentErrors.password && loginStep !== 2) {
                    setPrevStep(loginStep);
                    setDirection('next');
                    setLoginStep(2);
                } else if (currentErrors.phone_number && loginStep !== 1) {
                    setPrevStep(loginStep);
                    setDirection('prev');
                    setLoginStep(1);
                }
            } finally {
                setIsLoading(false);
                setIsSubmitting(false);
            }
        } else {
            handleContinue();
        }
    };

    const steps = [
        <Step>
            <InputField
                id="phone_number"
                label="Номер телефона"
                error={errors.phone_number}
            >
                <PhoneNumberInput
                    formData={formData}
                    setFormData={setFormData}
                    inputRef={phoneInputRef}
                    errors={errors}
                    setErrors={setErrors}
                />
            </InputField>
        </Step>,
        <Step>
            <InputField
                id="password_login"
                label="Пароль"
                error={errors.password}
                isPasswordHidden={isPasswordHidden}
                setIsPasswordHidden={setIsPasswordHidden}
                isPassword
            >
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
            </InputField>
        </Step>
    ];

    useEffect(() => {
        if (isActive) {
            setIsClosing(false);
            requestAnimationFrame(() => setIsFormActive(true));
        }
    }, [isActive, setIsActive]);

    useEffect(() => {
        return swipeClose(handleCancel);
    }, [handleCancel]);

    // Блокировка кнопки "Продолжить" или "Войти" в случае пустых полей
    useEffect(() => {
        failedValidation();
    }, [failedValidation]);

    useEffect(() => {
        if (loginStep === 2) {
            const timer = setTimeout(() =>
                    passwordInputRef.current.focus(),
                800);

            return () => clearTimeout(timer);
        }
    }, [loginStep]);

    return (
        <>
            {isActive && (
                <div id="login" className={`modal ${isFormActive ? 'active' : ''}`}>
                    <form className={`${isFormActive ? 'active' : ''} ${isClosing ? 'closing' : ''}`}
                          onSubmit={handleSubmit}>
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

                        <div className="step-container">
                            {prevStep !== null && (
                                <div
                                    key={`step-${prevStep}`}
                                    className={`step leaving ${direction === 'next' ? 'slide-out-left' : 'slide-out-right'}`}
                                    onAnimationEnd={() => setPrevStep(null)}
                                >
                                    {steps[prevStep - 1]}
                                </div>
                            )}

                            <div
                                key={`step-${loginStep}`}
                                className={`step entering ${direction === 'next' ? 'slide-in-right' : 'slide-in-left'}`}
                            >
                                {steps[loginStep - 1]}
                            </div>
                        </div>

                        <div className="buttons">
                            <button
                                type="submit"
                                className="btn"
                                onClick={handleSubmit}
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
            )}
        </>
    )
}