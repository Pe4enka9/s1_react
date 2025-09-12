import {useCallback, useEffect, useRef, useState} from "react";
import swipeClose from "../handlers/swipeClose.js";

export default function BaseForm({
                                     isActive,
                                     setIsActive,
                                     currentStep,
                                     setCurrentStep,
                                     steps,
                                     isDisabledButton,
                                     setIsDisabledButton,
                                     isServerError,
                                     isLoading,
                                     direction,
                                     setDirection,
                                     prevStep,
                                     setPrevStep,
                                     isAnimating,
                                     setIsAnimating,
                                     id = null,
                                     failedValidation = () => {
                                     },
                                     icon = null,
                                     title = 'Форма',
                                     buttonText = 'Отправить',
                                     progressLabels = [],
                                     onSubmit = () => {
                                     },
                                     isCalendar = false,
                                     isCalendarActive = false
                                 }) {
    const [isClosing, setIsClosing] = useState(false);

    const cancelTimerRef = useRef(null);

    const handleBack = useCallback(() => {
        if (currentStep <= 1) return;
        setDirection('prev');
        setPrevStep(currentStep);
        setCurrentStep(prev => prev - 1);
    }, [currentStep, setCurrentStep, setDirection, setPrevStep]);

    const handleContinue = useCallback(() => {
        if (currentStep >= steps.length) return;
        setDirection('next');
        setPrevStep(currentStep);
        setCurrentStep(prev => prev + 1);
    }, [currentStep, setCurrentStep, setDirection, setPrevStep, steps.length]);

    const handleCancel = useCallback(() => {
        document.body.style.overflowY = 'auto';
        setIsClosing(true);
        setIsAnimating(false);

        cancelTimerRef.current = setTimeout(() =>
                setIsActive(false),
            1000);
    }, [setIsActive, setIsAnimating]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (currentStep === steps.length) onSubmit();
        else handleContinue();
    }, [currentStep, handleContinue, onSubmit, steps.length]);

    useEffect(() => {
        setIsDisabledButton(failedValidation());
    }, [failedValidation, setIsDisabledButton]);

    useEffect(() => {
        return () => {
            if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
        }
    }, []);

    useEffect(() => {
        if (isActive) {
            setIsClosing(false);
            requestAnimationFrame(() => setIsAnimating(true));
        }
    }, [isActive, setIsActive, setIsAnimating]);

    useEffect(() => {
        if (isCalendar) return swipeClose(handleCancel, isCalendarActive);
        return swipeClose(handleCancel);
    }, [handleCancel, isCalendar, isCalendarActive]);

    useEffect(() => {
        if (isActive && currentStep === 0) {
            const timer = setTimeout(() =>
                    setCurrentStep(prev => prev + 1),
                1000);

            return () => clearTimeout(timer);
        }
    }, [currentStep, isActive, setCurrentStep]);

    return (
        <>
            {isActive && (
                <div className={`modal ${isAnimating ? 'active' : ''}`}>
                    <form id={id} className={`${isAnimating ? 'active' : ''} ${isClosing ? 'closing' : ''}`}
                          onSubmit={handleSubmit}>
                        <div className={`steps-progress step-${currentStep}`}>
                            <div className="steps-name">
                                {progressLabels.map((label, idx) => (
                                    <p key={idx} className="small">{label}</p>
                                ))}
                            </div>

                            <div className="steps-progress-bar"></div>
                        </div>

                        <div className="title">
                            {icon && (
                                <div className="icon">
                                    {icon}
                                </div>
                            )}

                            <h4>{title}</h4>
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
                                key={`step-${currentStep}`}
                                className={`step entering ${direction === 'next' ? 'slide-in-right' : 'slide-in-left'}`}
                            >
                                {steps[currentStep - 1]}
                            </div>
                        </div>

                        <div className="buttons">
                            <button
                                type="submit"
                                className="btn"
                                disabled={isDisabledButton || isLoading}
                            >
                                {currentStep === steps.length && !isServerError ? buttonText
                                    : currentStep === steps.length && isServerError ? 'Ошибка сервера'
                                        : 'Продолжить'}
                                <div className={`loader ${isLoading ? 'active' : ''}`}></div>
                            </button>

                            <button
                                type="button"
                                className="btn cancel"
                                onClick={currentStep === 1 ? handleCancel : handleBack}
                            >
                                {currentStep === 1 ? 'Отмена' : 'Назад'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}