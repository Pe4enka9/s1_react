/** @type {string} */
import profile from '../img/icons/profile.svg';
import Step from "./Step.jsx";
import InputField from "./InputField.jsx";
import PhoneNumberInput from "./PhoneNumberInput.jsx";
import BaseForm from "./BaseForm.jsx";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import getFirstError from "../handlers/getFirstError.js";

export default function RegisterForm({isActive, setIsActive}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [isPasswordHidden, setIsPasswordHidden] = useState({
        password_register: true,
        password_confirmation: true,
    });
    const [currentStep, setCurrentStep] = useState(0);
    const [isDisabledButton, setIsDisabledButton] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);
    const [prevStep, setPrevStep] = useState(null);
    const [direction, setDirection] = useState('next');
    const [isAnimating, setIsAnimating] = useState(false);

    const phoneNumberInputRef = useRef(null);
    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordConfirmationInputRef = useRef(null);
    const successTimerRef = useRef(null);
    const errorTimerRef = useRef(null);

    const handleChange = useCallback((e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setErrors({...errors, [name]: ''});
    }, [errors, formData]);

    const failedValidation = useCallback(() => {
        let isDisabled = false;

        if (currentStep === 1) {
            isDisabled = formData.phone_number.length !== 18;
        } else if (currentStep === 2) {
            isDisabled = !formData.first_name.trim() || !formData.last_name.trim();
        } else if (currentStep === 3) {
            isDisabled = !formData.password.trim();
        }

        return isDisabled;
    }, [currentStep, formData.first_name, formData.last_name, formData.password, formData.phone_number.length]);

    const handleSubmit = useCallback(async () => {
        try {
            passwordConfirmationInputRef.current?.blur();
            setIsLoading(true);
            setErrors({});
            setIsServerError(false);

            const response = await axios.post(import.meta.env.VITE_API_URL + '/register', formData);

            if (response.status === 201) {
                setIsAnimating(false);

                successTimerRef.current = setTimeout(() => {
                    setCurrentStep(0);
                    setFormData({
                        phone_number: '',
                        first_name: '',
                        last_name: '',
                        password: '',
                        password_confirmation: ''
                    });
                    setIsActive(false);
                }, 1200);

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.dispatchEvent(new Event('storage'));
            }
        } catch (err) {
            if (err.code === 'ERR_NETWORK') {
                setIsServerError(true);

                errorTimerRef.current = setTimeout(() =>
                        setIsServerError(false),
                    2000);
            }

            const currentErrors = err.response.data.errors;
            setErrors(currentErrors);

            // Переход к шагу, где возникла ошибка
            if (currentErrors.password && currentStep !== 3) {
                setPrevStep(currentStep);
                setDirection('next');
                setCurrentStep(3);

                setTimeout(() =>
                        passwordInputRef.current?.focus(),
                    800)
            } else if (currentErrors.first_name && currentStep !== 2) {
                setPrevStep(currentStep);
                setDirection('prev');
                setCurrentStep(2);

                setTimeout(() =>
                        firstNameInputRef.current?.focus(),
                    800)
            } else if (currentErrors.last_name && currentStep !== 2) {
                setPrevStep(currentStep);
                setDirection('prev');
                setCurrentStep(2);

                setTimeout(() =>
                        lastNameInputRef.current?.focus(),
                    800)
            } else if (currentErrors.phone_number && currentStep !== 1) {
                setPrevStep(currentStep);
                setDirection('prev');
                setCurrentStep(1);

                setTimeout(() =>
                        phoneNumberInputRef.current?.focus(),
                    800)
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentStep, formData, setIsActive]);

    const handleKeyDown = useCallback((e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();

        if (currentStep === 2 && e.target.id === 'first_name') {
            lastNameInputRef.current?.focus();
        } else if (currentStep === 3 && e.target.id === 'password') {
            passwordConfirmationInputRef.current?.focus();
        }
    }, [currentStep]);

    const steps = useMemo(() => [
        <Step key="step-1">
            <InputField
                id="phone_number"
                label="Номер телефона"
                error={getFirstError(errors.phone_number)}
            >
                <PhoneNumberInput
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    inputRef={phoneNumberInputRef}
                />
            </InputField>
        </Step>,
        <Step key="step-2">
            <InputField
                id="first_name"
                label="Имя"
                error={getFirstError(errors.first_name)}
            >
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
                    onKeyDown={handleKeyDown}
                    enterKeyHint="next"
                    ref={firstNameInputRef}
                />
            </InputField>

            <InputField
                id="last_name"
                label="Фамилия"
                error={getFirstError(errors.last_name)}
            >
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
                    enterKeyHint="next"
                    ref={lastNameInputRef}
                />
            </InputField>
        </Step>,
        <Step key="step-3">
            <InputField
                id="password"
                label="Пароль"
                error={getFirstError(errors.password)}
                isPasswordHidden={isPasswordHidden}
                setIsPasswordHidden={setIsPasswordHidden}
                isPassword
            >
                <input
                    type={isPasswordHidden.password_register ? "password" : "text"}
                    inputMode="text"
                    name="password"
                    id="password"
                    className={errors.password ? 'error-input' : ''}
                    placeholder="Введите пароль"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    enterKeyHint="next"
                    ref={passwordInputRef}
                />
            </InputField>

            <InputField
                id="password_confirmation"
                label="Повтор пароля"
                error={getFirstError(errors.password_confirmation)}
                isPasswordHidden={isPasswordHidden}
                setIsPasswordHidden={setIsPasswordHidden}
                isPassword
            >
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
                    enterKeyHint="done"
                    ref={passwordConfirmationInputRef}
                />
            </InputField>
        </Step>,
    ], [errors, formData, handleChange, handleKeyDown, isPasswordHidden]);

    useEffect(() => {
        return () => {
            if (successTimerRef.current) clearTimeout(successTimerRef.current);
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        };
    }, []);

    useEffect(() => {
        let timer = null;

        if (currentStep === 2) {
            timer = setTimeout(() =>
                    firstNameInputRef.current?.focus(),
                800);
        } else if (currentStep === 3) {
            timer = setTimeout(() =>
                    passwordInputRef.current?.focus(),
                800);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [currentStep]);

    return (
        <BaseForm
            isActive={isActive}
            setIsActive={setIsActive}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={steps}
            isDisabledButton={isDisabledButton}
            setIsDisabledButton={setIsDisabledButton}
            isServerError={isServerError}
            isLoading={isLoading}
            direction={direction}
            setDirection={setDirection}
            prevStep={prevStep}
            setPrevStep={setPrevStep}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            id="register"
            failedValidation={failedValidation}
            icon={<img src={profile} alt="Создание аккаунта"/>}
            title="Создание аккаунта"
            buttonText="Зарегистрироваться"
            progressLabels={['Контакт', 'Личные данные', 'Пароль']}
            onSubmit={handleSubmit}
        />
    )
};