/** @type {string} */
import profile from '../img/icons/profile.svg';
import Step from "./Step.jsx";
import InputField from "./InputField.jsx";
import PhoneNumberInput from "./PhoneNumberInput.jsx";
import BaseForm from "./BaseForm.jsx";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";

export default function LoginForm({isActive, setIsActive}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [isDisabledButton, setIsDisabledButton] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);
    const [prevStep, setPrevStep] = useState(null);
    const [direction, setDirection] = useState('next');
    const [isAnimating, setIsAnimating] = useState(false);

    const phoneNumberInputRef = useRef(null);
    const passwordInputRef = useRef(null);
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
            isDisabled = !formData.password.trim();
        }

        return isDisabled;
    }, [currentStep, formData.password, formData.phone_number.length]);

    const handleSubmit = useCallback(async () => {
        try {
            passwordInputRef.current?.blur();
            setIsLoading(true);
            setErrors({});
            setIsServerError(false);

            const response = await axios.post(import.meta.env.VITE_API_URL + '/login', formData);

            if (response.status === 200) {
                setIsAnimating(false);

                successTimerRef.current = setTimeout(() => {
                    setCurrentStep(0);
                    setFormData({phone_number: '', password: ''});
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
            } else if (err.status === 401) {
                setErrors({password: 'Неверный логин или пароль'});
                return;
            }

            const currentErrors = err.response.data.errors;
            setErrors(currentErrors);

            // Переход к шагу, где возникла ошибка
            if (currentErrors.password && currentStep !== 2) {
                setPrevStep(currentStep);
                setDirection('next');
                setCurrentStep(2);

                setTimeout(() =>
                        passwordInputRef.current?.focus(),
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

    const steps = useMemo(() => [
        <Step key="step-1">
            <InputField
                id="phone_number"
                label="Номер телефона"
                error={errors.phone_number}
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
                id="password"
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
                    id="password"
                    className={errors.password ? 'error-input' : ''}
                    placeholder="Введите пароль"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    enterKeyHint="done"
                    ref={passwordInputRef}
                />
            </InputField>
        </Step>
    ], [errors, formData, handleChange, isPasswordHidden]);

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
            id="login"
            failedValidation={failedValidation}
            icon={<img src={profile} alt="Вход в аккаунт" loading="lazy"/>}
            title="Вход в аккаунт"
            buttonText="Войти"
            progressLabels={['Контакт', 'Пароль']}
            onSubmit={handleSubmit}
        />
    )
};