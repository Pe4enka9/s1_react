/** @type {string} */
import profile from '../img/icons/profile.svg';
import {useCallback, useEffect, useRef, useState} from "react";
import {IMaskInput} from "react-imask";
import preparePhoneValue from "../handlers/preparePhoneValue.js";
import swipeClose from "../handlers/swipeClose.js";
import axios from "axios";

export default function RegisterForm({isActive, setIsActive, registerStep, setRegisterStep}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
    });
    // Ошибки валидации
    const [errors, setErrors] = useState({});
    // Закрытие формы
    const [isClosing, setIsClosing] = useState(false);
    // Скрытие пароля
    const [isPasswordHidden, setIsPasswordHidden] = useState({
        password: true,
        password_confirmation: true,
    });
    // Блокировка кнопки
    const [isDisabledButton, setIsDisabledButton] = useState(true);
    // Загрузка
    const [isLoading, setIsLoading] = useState(false);
    // Проверка отправляется ли форма сейчас
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Ошибка сервера
    const [isServerError, setIsServerError] = useState(false);

    const phoneInputRef = useRef(null);
    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordConfirmationInputRef = useRef(null);

    // Закрытие формы с анимацией быстрее, чем анимация появления
    useEffect(() => {
        let timer;

        if (isActive.register) timer = setTimeout(() =>
                setIsClosing(true),
            1200)
        else timer = setTimeout(() =>
                setIsClosing(false),
            1000);

        return () => clearTimeout(timer);
    }, [isActive.register]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});

        event.target.classList.remove('error-input');
        event.target.nextSibling.classList.remove('active');
        setErrors({...errors, [name]: ''});
    }

    const handlePhoneAccept = (value) => {
        setFormData({...formData, phone_number: value});

        const phoneNumberInput = document.getElementById('phone_number');

        phoneNumberInput.classList.remove('error-input');
        phoneNumberInput.nextSibling.classList.remove('active');
        setErrors({...errors, phone_number: ''});
    }

    // Вернуться на шаг назад
    const handleBack = () => {
        setRegisterStep(prev => prev - 1);
    }

    // Перейти на шаг вперёд
    const handleContinue = () => {
        if (registerStep >= 3) return;

        setRegisterStep(prev => prev + 1);
    }

    const failedValidation = useCallback(() => {
        let isDisabled = false;

        if (registerStep === 1) {
            isDisabled = formData.phone_number.length !== 18;
        } else if (registerStep === 2) {
            isDisabled = !formData.first_name.trim() || !formData.last_name.trim();
        } else if (registerStep === 3) {
            isDisabled = !formData.password.trim() || !formData.password_confirmation.trim();
        }

        setIsDisabledButton(isDisabled);
        return isDisabled;
    }, [formData.first_name, formData.last_name, formData.password, formData.password_confirmation, formData.phone_number.length, registerStep]);

    // Блокировка кнопки "Продолжить" или "Войти" в случае пустых полей
    useEffect(() => {
        failedValidation();
    }, [failedValidation]);

    const handleOnFocus = (step) => {
        if (step !== registerStep) {
            if (failedValidation()) {
                if (registerStep === 1) {
                    phoneInputRef.current?.focus();
                } else if (registerStep === 2) {
                    if (!formData.first_name.trim()) {
                        firstNameInputRef.current?.focus();
                    } else {
                        lastNameInputRef.current?.focus();
                    }
                } else if (registerStep === 3) {
                    if (!formData.password.trim()) {
                        passwordInputRef.current?.focus();
                    } else {
                        passwordConfirmationInputRef.current?.focus();
                    }
                }
                return;
            }

            setRegisterStep(step);
        }
    };

    // Закрытие формы
    const handleCancel = useCallback(() => {
        document.body.style.overflowY = 'auto';
        setIsActive({register: false, login: false, booking: false});
    }, [setIsActive]);

    // Показать / скрыть пароль
    const toggleEyePassword = (e) => {
        const elementId = e.target.parentElement.querySelector('input').id;

        setIsPasswordHidden(prev =>
            ({
                ...prev,
                [elementId]: !prev[elementId]
            }));
    }

    // Закрытие формы с помощью свайпа
    useEffect(() => {
        return swipeClose(handleCancel);
    }, [handleCancel]);

    // Переход к следующему input при нажатии на Enter
    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        if (
            registerStep === 3 &&
            e.target.name === 'password_confirmation' &&
            !isLoading && !isSubmitting && !failedValidation()
        ) {
            setIsSubmitting(true);
            handleSubmit(e);
        }
    };

    // Отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (registerStep === 3) {
            setIsLoading(true);
            setErrors({});
            setIsServerError(false);

            try {
                const response = await axios.post(import.meta.env.VITE_API_URL + '/register', formData);

                if (response.status === 201) {
                    setIsActive({register: false, login: false, booking: false});
                    setFormData({
                        phone_number: '',
                        first_name: '',
                        last_name: '',
                        password: '',
                        password_confirmation: ''
                    });

                    const timer = setTimeout(() =>
                            setRegisterStep(0),
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
                }

                const currentErrors = err.response.data.errors;
                setErrors(currentErrors);

                // Переход к шагу, где возникла ошибка
                if (currentErrors.password) {
                    setRegisterStep(3);
                } else if (currentErrors.first_name || currentErrors.last_name) {
                    setRegisterStep(2);
                } else if (currentErrors.phone_number) {
                    setRegisterStep(1)
                }
            } finally {
                setIsLoading(false);
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div id="register" className={`modal ${isActive.register ? 'active' : ''}`}>
            <form className={`${isActive.register ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
                <div className={`steps-progress step-${registerStep}`}>
                    <div className="steps-name">
                        <p className="small">Контакт</p>
                        <p className="small">Личные данные</p>
                        <p className="small">Пароль</p>
                    </div>

                    <div className="steps-progress-bar"></div>
                </div>

                <div className="title">
                    <div className="icon">
                        <img src={profile} alt="Создание аккаунта"/>
                    </div>

                    <h4>Создать аккаунт</h4>
                </div>

                <div className={`step ${registerStep === 1 ? 'current' : 'prev'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="phone_number">Номер телефона</label>
                            <IMaskInput
                                mask="+{7} (000) 000-00-00"
                                type="tel"
                                inputMode="tel"
                                name="phone_number"
                                id="phone_number"
                                className={errors.phone_number ? 'error-input' : ''}
                                placeholder="+7 (000) 000-00-00"
                                value={formData.phone_number}
                                onAccept={value =>
                                    handlePhoneAccept(value)
                                }
                                onFocus={() => handleOnFocus(1)}
                                prepare={(appended, masked) =>
                                    preparePhoneValue(appended, masked)
                                }
                                autoComplete="tel phone"
                                enterKeyHint="next"
                                inputRef={phoneInputRef}
                            />
                            {<p className={`error ${errors.phone_number ? 'active' : ''}`}>{errors.phone_number}</p>}
                        </div>
                    </div>
                </div>

                <div className={`step ${registerStep === 2 ? 'current' : registerStep === 3 ? 'prev' : 'next'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="first_name">Имя</label>
                            <input
                                type="text"
                                inputMode="text"
                                name="first_name"
                                id="first_name"
                                className={errors.first_name ? 'error-input' : ''}
                                placeholder="Введите ваше имя"
                                autoComplete="given-name"
                                value={formData.first_name}
                                onChange={handleChange}
                                onFocus={() => handleOnFocus(2)}
                                onKeyDown={handleKeyDown}
                                enterKeyHint="next"
                                ref={firstNameInputRef}
                            />
                            {<p className={`error ${errors.first_name ? 'active' : ''}`}>{errors.first_name}</p>}
                        </div>

                        <div className="field">
                            <label htmlFor="last_name">Фамилия</label>
                            <input
                                type="text"
                                inputMode="text"
                                name="last_name"
                                id="last_name"
                                className={errors.last_name ? 'error-input' : ''}
                                placeholder="Введите вашу фамилию"
                                autoComplete="family-name"
                                value={formData.last_name}
                                onChange={handleChange}
                                onFocus={() => handleOnFocus(2)}
                                onKeyDown={handleKeyDown}
                                enterKeyHint="next"
                                ref={lastNameInputRef}
                            />
                            {<p className={`error ${errors.last_name ? 'active' : ''}`}>{errors.last_name}</p>}
                        </div>
                    </div>
                </div>

                <div className={`step ${registerStep === 3 ? 'current' : 'next'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="password">Пароль</label>
                            <input
                                type={isPasswordHidden.password ? "password" : "text"}
                                inputMode="text"
                                name="password"
                                id="password"
                                className={errors.password ? 'error-input' : ''}
                                placeholder="Введите пароль"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => handleOnFocus(3)}
                                onKeyDown={handleKeyDown}
                                enterKeyHint="next"
                                ref={passwordInputRef}
                            />
                            {<p className={`error ${errors.password ? 'active' : ''}`}>
                                {errors.password ? errors.password[0] : null}
                            </p>}

                            <div
                                className={`eye-password ${isPasswordHidden.password ? 'hidden' : 'visible'}`}
                                onClick={toggleEyePassword}
                            ></div>
                        </div>

                        <div className="field">
                            <label htmlFor="password_confirmation">Повтор пароля</label>
                            <input
                                type={isPasswordHidden.password_confirmation ? "password" : "text"}
                                inputMode="text"
                                name="password_confirmation"
                                id="password_confirmation"
                                className={errors.password_confirmation ? 'error-input' : ''}
                                placeholder="Повторите пароль"
                                autoComplete="new-password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                onFocus={() => handleOnFocus(3)}
                                onKeyDown={handleKeyDown}
                                enterKeyHint="done"
                                ref={passwordConfirmationInputRef}
                            />

                            <div
                                className={`eye-password ${isPasswordHidden.password_confirmation ? 'hidden' : 'visible'}`}
                                onClick={toggleEyePassword}></div>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button
                        type="button"
                        className={`btn ${isLoading ? 'loading' : ''}`}
                        onClick={registerStep === 3 ? handleSubmit : handleContinue}
                        disabled={isDisabledButton || isLoading}
                    >
                        {registerStep === 3 && !isServerError ? 'Зарегистрироваться' :
                            registerStep === 3 && isServerError ? 'Ошибка сервера'
                                : 'Продолжить'}
                        <div className={`loader ${isLoading ? 'active' : ''}`}></div>
                    </button>

                    <button
                        type="button"
                        className="btn cancel"
                        onClick={registerStep === 1 ? handleCancel : handleBack}
                    >
                        {registerStep === 1 ? 'Отмена' : 'Назад'}
                    </button>
                </div>
            </form>
        </div>
    )
}