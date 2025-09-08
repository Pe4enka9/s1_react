/** @type {string} */
import calendar from '../img/icons/calendar.svg';
import React, {useCallback, useEffect, useRef, useState} from "react";
import swipeClose from "../handlers/swipeClose.js";
import preparePhoneValue from "../handlers/preparePhoneValue.js";
import {IMaskInput} from "react-imask";
import DatePicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {ru} from "date-fns/locale/ru";
import axios from "axios";

registerLocale('ru', ru);

export default function BookingForm({isActive, setIsActive, bookingStep, setBookingStep}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        date: '',
        duration: '',
        number_of_people: '',
    });
    // Ошибки валидации
    const [errors, setErrors] = useState({});
    // Загрузка
    const [isLoading, setIsLoading] = useState(false);
    // Ошибка сервера
    const [isServerError, setIsServerError] = useState(false);
    // Закрытие формы
    const [isClosing, setIsClosing] = useState(false);
    // Проверка отправляется ли форма сейчас
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Активен ли календарь
    const [isCalendarActive, setIsCalendarActive] = useState(false);
    // Блокировка кнопки
    const [isDisabledButton, setIsDisabledButton] = useState(true);

    const phoneInputRef = useRef(null);

    useEffect(() => {
        let timer;

        if (isActive.booking) timer = setTimeout(() =>
                setIsClosing(true),
            1200)
        else timer = setTimeout(() =>
                setIsClosing(false),
            1000);

        return () => clearTimeout(timer);
    }, [isActive.booking]);

    // Блокировка кнопки "Продолжить" или "Забронировать" в случае пустых полей
    useEffect(() => {
        let isDisabled = false;

        if (bookingStep === 1) {
            isDisabled = formData.phone_number.length !== 18;
        } else if (bookingStep === 2) {
            isDisabled = !formData.date.trim() || !formData.duration.trim();
        } else if (bookingStep === 3) {
            isDisabled = !formData.number_of_people.trim();
        }

        setIsDisabledButton(isDisabled);
    }, [bookingStep, formData.date, formData.duration, formData.number_of_people, formData.phone_number.length]);

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

    // Фокус на следующий input после события blur (только для номера телефона)
    const handleOnBlur = () => {
        if (formData.phone_number.length === 18) {
            setIsDisabledButton(false);
            handleContinue();
        } else {
            setIsDisabledButton(true);
        }
    };

    const handleBack = () => {
        setBookingStep(prev => prev - 1);
    }

    const handleContinue = () => {
        if (bookingStep >= 3) return;

        setBookingStep(prev => prev + 1);
    }

    const handleCancel = useCallback(() => {
        document.body.style.overflowY = 'auto';
        setIsActive({register: false, login: false, booking: false});
    }, [setIsActive]);

    useEffect(() => {
        return swipeClose(isCalendarActive, handleCancel);
    }, [handleCancel, isCalendarActive]);

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        if (bookingStep === 3) {
            if (e.target.name === 'number_of_people') {
                if (!isLoading && !isSubmitting) {
                    setIsSubmitting(true);
                    handleSubmit(e);
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (bookingStep === 3) {
            try {
                setIsLoading(true);
                setErrors({});
                setIsServerError(false);

                const response = await axios.post(import.meta.env.VITE_API_URL + '/booking', formData);

                if (response.status === 201) {
                    setIsActive({register: false, login: false, booking: false});
                    setFormData({phone_number: '', date: '', duration: '', number_of_people: ''});

                    const timer = setTimeout(() =>
                            setBookingStep(0),
                        1000);

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
                if (currentErrors.number_of_people) {
                    setBookingStep(3);
                } else if (currentErrors.date || currentErrors.duration) {
                    setBookingStep(2);
                } else if (currentErrors.phone_number) {
                    setBookingStep(1);
                }
            } finally {
                setIsLoading(false);
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div id="booking" className={`modal ${isActive.booking ? 'active' : ''}`}>
            <form className={`${isActive.booking ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
                <div className={`steps-progress step-${bookingStep}`}>
                    <div className="steps-name">
                        <p className="small">Контакт</p>
                        <p className="small">Дата и время</p>
                        <p className="small">Люди</p>
                    </div>

                    <div className="steps-progress-bar"></div>
                </div>

                <div className="title">
                    <div className="icon">
                        <img src={calendar} alt="Бронирование"/>
                    </div>

                    <h4>Бронирование</h4>
                </div>

                <div className={`step ${bookingStep === 1 ? 'current' : 'prev'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="phone_number_booking">Номер телефона</label>
                            <IMaskInput
                                mask="+{7} (000) 000-00-00"
                                type="tel"
                                inputMode="tel"
                                name="phone_number"
                                id="phone_number_booking"
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
                                onKeyDown={event => {
                                    if (event.key === 'Tab' || event.key === 'Enter') {
                                        event.preventDefault();
                                        handleContinue();
                                    }
                                }}
                            />
                            {<p className={`error ${errors.phone_number ? 'active' : ''}`}>{errors.phone_number}</p>}
                        </div>
                    </div>
                </div>

                <div className={`step ${bookingStep === 2 ? 'current' : bookingStep === 3 ? 'prev' : 'next'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="date">Дата</label>
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
                                onKeyDown={handleKeyDown}
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
                            {<p className={`error ${errors.date ? 'active' : ''}`}>{errors.date}</p>}
                        </div>

                        <div className="field">
                            <label htmlFor="duration">Продолжительность</label>
                            <input
                                type="number"
                                name="duration"
                                id="duration"
                                className={errors.duration ? 'error-input' : ''}
                                placeholder="2 часа"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                            {<p className={`error ${errors.duration ? 'active' : ''}`}>{errors.duration}</p>}
                        </div>
                    </div>
                </div>

                <div className={`step ${bookingStep === 3 ? 'current' : 'next'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="number_of_people">Количество человек</label>
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
                                onKeyDown={handleKeyDown}
                            />
                            {
                                <p className={`error ${errors.number_of_people ? 'active' : ''}`}>{errors.number_of_people}</p>}
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button
                        type="button"
                        className="btn"
                        onClick={bookingStep === 3 ? handleSubmit : handleContinue}
                        disabled={isDisabledButton || isLoading}
                    >
                        {bookingStep === 3 && !isServerError ? 'Забронировать'
                            : bookingStep === 3 && isServerError ? 'Ошибка сервера'
                                : 'Продолжить'}
                    </button>

                    <button
                        type="button"
                        className="btn cancel"
                        onClick={bookingStep === 1 ? handleCancel : handleBack}
                    >
                        {bookingStep === 1 ? 'Отмена' : 'Назад'}
                    </button>
                </div>
            </form>
        </div>
    )
}