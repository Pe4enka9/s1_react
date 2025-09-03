/** @type {string} */
import calendar from '../img/icons/calendar.svg';
import React, {useCallback, useEffect, useRef, useState} from "react";
import swipeClose from "../handlers/swipeClose.js";
import preparePhoneValue from "../handlers/preparePhoneValue.js";
import {IMaskInput} from "react-imask";
import DatePicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {ru} from "date-fns/locale/ru";

registerLocale('ru', ru);

export default function BookingForm({isActive, setIsActive, bookingStep, setBookingStep}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        date: '',
        time: '',
        number_of_people: '',
    });
    const [isClosing, setIsClosing] = useState(false);
    const [isCalendarActive, setIsCalendarActive] = useState(false);

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

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }

    const handlePhoneAccept = (value) => {
        setFormData({...formData, phone_number: value});
    }

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

    const handleKeyDown = (event) => {
        if (event.key !== 'Enter') return;

        event.preventDefault();

        if (bookingStep === 3) {
            if (event.target.name === 'number_of_people') {
                handleSubmit(event);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (bookingStep === 3) {
            console.log("Форма отправлена!");
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
                                onBlur={handleContinue}
                                onKeyDown={event => {
                                    if (event.key === 'Tab' || event.key === 'Enter') {
                                        event.preventDefault();
                                        handleContinue();
                                    }
                                }}
                            />
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
                                showMonthYearDropdown={false}
                                showTimeSelect
                                selected={formData.date ? new Date(formData.date) : null}
                                minDate={new Date()}
                                onChange={date => setFormData({...formData, date: date})}
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
                                placeholder="Максимум 5"
                                value={formData.number_of_people}
                                onChange={handleChange}
                                enterKeyHint="done"
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button
                        type="button"
                        className="btn"
                        onClick={bookingStep === 3 ? handleSubmit : handleContinue}
                    >
                        {bookingStep === 3 ? 'Забронировать' : 'Продолжить'}
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