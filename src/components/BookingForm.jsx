/** @type {string} */
import calendar from '../img/icons/calendar.svg';
import Step from "./Step.jsx";
import InputField from "./InputField.jsx";
import PhoneNumberInput from "./PhoneNumberInput.jsx";
import BaseForm from "./BaseForm.jsx";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import getFirstError from "../handlers/getFirstError.js";
import DatePicker, {registerLocale} from "react-datepicker";
import {ru} from "date-fns/locale/ru";
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ru', ru);

export default function BookingForm({isActive, setIsActive}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        date: '',
        duration: '',
        number_of_people: '',
    });
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [isDisabledButton, setIsDisabledButton] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);
    const [prevStep, setPrevStep] = useState(null);
    const [direction, setDirection] = useState('next');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isCalendarActive, setIsCalendarActive] = useState(false);

    const phoneNumberInputRef = useRef(null);
    const durationInputRef = useRef(null);
    const numberOfPeopleInputRef = useRef(null);
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
            isDisabled = formData.phone_number.length < 18;
        } else if (currentStep === 2) {
            isDisabled = !formData.date.trim() || !formData.duration.trim();
        } else if (currentStep === 3) {
            isDisabled = !formData.number_of_people.trim();
        }

        return isDisabled;
    }, [currentStep, formData.date, formData.duration, formData.number_of_people, formData.phone_number.length]);

    const handleSubmit = useCallback(async () => {
        try {
            numberOfPeopleInputRef.current?.blur();
            setIsLoading(true);
            setErrors({});
            setIsServerError(false);

            const response = await axios.post(import.meta.env.VITE_API_URL + '/booking', formData);

            if (response.status === 201) {
                setIsAnimating(false);

                successTimerRef.current = setTimeout(() => {
                    setCurrentStep(0);
                    setFormData({phone_number: '', date: '', duration: '', number_of_people: ''});
                    setIsActive(false);
                }, 1200);
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
            if (currentErrors.number_of_people && currentStep !== 3) {
                setPrevStep(currentStep);
                setDirection('next');
                setCurrentStep(3);

                setTimeout(() =>
                        numberOfPeopleInputRef.current?.focus(),
                    800)
            } else if (currentErrors.date && currentStep !== 2) {
                setPrevStep(currentStep);
                setDirection('prev');
                setCurrentStep(2);
            } else if (currentErrors.duration && currentStep !== 2) {
                setPrevStep(currentStep);
                setDirection('prev');
                setCurrentStep(2);

                setTimeout(() =>
                        durationInputRef.current?.focus(),
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
                id="date"
                label="Дата"
                error={getFirstError(errors.date)}
            >
                <DatePicker
                    name="date"
                    id="date"
                    className={errors.date ? 'error-input' : ''}
                    showMonthYearDropdown={false}
                    showTimeSelect
                    selected={formData.date ? new Date(formData.date) : null}
                    minDate={new Date()}
                    onChange={date => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');

                        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:00`;
                        setFormData({...formData, date: formattedDate});
                    }}
                    onCalendarOpen={() => {
                        setTimeout(() => setIsCalendarActive(true), 100)
                    }}
                    onCalendarClose={() => {
                        setTimeout(() => setIsCalendarActive(false), 500)
                    }}
                    placeholderText="Введите дату"
                    dateFormat="dd MMMM yyyy, HH:mm"
                    locale="ru"
                    withPortal
                    portalId="calendar"
                    calendarClassName={`calendar ${isCalendarActive ? 'active' : ''}`}
                    portalClassName="portal"
                    onFocus={e => e.target.readOnly = true}
                    dayClassName={date => {
                        const day = date.getDay();
                        let className = 'calendar-day';
                        if (day === 0 || day === 6) className += ' weekend';
                        return className;
                    }}
                    timeIntervals={60}
                    timeCaption="Время"
                    timeClassName={() => "time-item"}
                />
            </InputField>

            <InputField
                id="duration"
                label="Продолжительность"
                error={getFirstError(errors.duration)}
            >
                <input
                    type="number"
                    name="duration"
                    id="duration"
                    className={errors.duration ? 'error-input' : ''}
                    placeholder="2 часа"
                    value={formData.duration}
                    onChange={handleChange}
                    ref={durationInputRef}
                />
            </InputField>
        </Step>,
        <Step key="step-3">
            <InputField
                id="number_of_people"
                label="Количество человек"
                error={getFirstError(errors.number_of_people)}
            >
                <input
                    type="number"
                    inputMode="numeric"
                    name="number_of_people"
                    id="number_of_people"
                    className={errors.number_of_people ? 'error-input' : ''}
                    placeholder="Максимум 5"
                    value={formData.number_of_people}
                    onChange={handleChange}
                    enterKeyHint="done"
                    ref={numberOfPeopleInputRef}
                />
            </InputField>
        </Step>,
    ], [errors, formData, handleChange, isCalendarActive]);

    useEffect(() => {
        return () => {
            if (successTimerRef.current) clearTimeout(successTimerRef.current);
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        };
    }, []);

    useEffect(() => {
        let timer = null;

        if (currentStep === 3) {
            timer = setTimeout(() =>
                    numberOfPeopleInputRef.current?.focus(),
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
            id="booking"
            failedValidation={failedValidation}
            icon={<img src={calendar} alt="Бронирование"/>}
            title="Бронирование"
            buttonText="Забронировать"
            progressLabels={['Контакт', 'Дата и время', 'Люди']}
            onSubmit={handleSubmit}
            isCalendar
            isCalendarActive={isCalendarActive}
        />
    )
};