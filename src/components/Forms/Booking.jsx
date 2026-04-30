import StepForm from "./Base/StepForm.jsx";
import calendarIcon from '../../icons/calendar.svg';
import MyInput from "../Input/MyInput.jsx";
import PhoneInput from "../Input/PhoneInput.jsx";
import {useContext, useEffect, useState} from "react";
import client from "../../api/client.js";
import {useUI} from "../../hooks/useUI.js";
import {UserContext} from "../../context/UserContext.js";
import {useLockBodyScroll} from "../../hooks/useLockBodyScroll.js";

const validators = {
    phone: (value) => {
        if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value.trim())) {
            return 'Введите корректный номер телефона.';
        }
    },
    date: (value) => {
        if (!value) return 'Дата обязательна.';

        const selectedDate = new Date(value);
        const today = new Date();

        if (selectedDate < today) {
            return 'Дата не может быть в прошлом.';
        }
    },
    duration: (value) => {
        if (!value) return 'Продолжительность обязательна.';

        if (value < 1) {
            return 'Число не может быть меньше 1.';
        }

        if (value > 10) {
            return 'Число не может быть больше 10.';
        }
    },
    peoples: (value) => {
        if (!value) return 'Количество человек обязательно.';

        if (value < 1) {
            return 'Число не может быть меньше 1.';
        }

        if (value > 5) {
            return 'Число не может быть больше 5.';
        }
    },
};

export default function Booking() {
    const {user} = useContext(UserContext);
    const {isOpenBooking, setIsOpenBooking} = useUI();
    useLockBodyScroll(isOpenBooking);

    const [formData, setFormData] = useState({
        phone: '',
        date: '',
        duration: '',
        peoples: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => ({...prev, phone: user?.phone ?? ''}));
    }, [user]);

    const validateStep = (step) => {
        let newErrors = {...errors};
        let isValid = true;

        switch (step) {
            case 1:
                if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(formData.phone.trim())) {
                    isValid = false;
                    newErrors.phone = 'Введите корректный номер телефона.';
                }
                break;
            case 2: {
                if (!formData.date) {
                    isValid = false;
                    newErrors.date = 'Дата обязательна.';
                }

                const selectedDate = new Date(formData.date);
                const today = new Date();

                if (selectedDate < today) {
                    isValid = false;
                    newErrors.date = 'Дата не может быть в прошлом.';
                }

                if (!formData.duration) {
                    isValid = false;
                    newErrors.duration = 'Продолжительность обязательна.';
                } else if (formData.duration < 1) {
                    isValid = false;
                    newErrors.duration = 'Число не может быть меньше 1.';
                } else if (formData.duration > 10) {
                    isValid = false;
                    newErrors.duration = 'Число не может быть больше 10.';
                }
                break;
            }
            case 3:
                if (!formData.peoples) {
                    isValid = false;
                    newErrors.peoples = 'Количество человек обязательно.';
                } else if (formData.peoples < 1) {
                    isValid = false;
                    newErrors.peoples = 'Число не может быть меньше 1.';
                } else if (formData.peoples > 5) {
                    isValid = false;
                    newErrors.peoples = 'Число не может быть больше 5.';
                }
                break;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setErrors({});

            await client.post('/bookings', formData);

            setFormData({phone: user?.phone ?? '', date: '', duration: '', peoples: ''});
            setIsOpenBooking(false);
        } catch (e) {
            const {errors} = e.response.data;
            setErrors(errors);

            for (const [field] of Object.entries(errors)) {
                switch (field) {
                    case 'phone':
                        return 1;
                    case 'date':
                    case 'duration':
                        return 2;
                    case 'peoples':
                        return 3;
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <StepForm
            stepLabels={['Контакт', 'Дата и время', 'Люди']}
            title="Бронирование"
            button="Забронировать"
            icon={calendarIcon}
            isOpen={isOpenBooking}
            setIsOpen={setIsOpenBooking}
            onSubmit={handleSubmit}
            loading={loading}
            validateStep={validateStep}
        >
            <div className="flex flex-col gap-4 w-full shrink-0 px-5">
                <PhoneInput
                    id="booking_phone"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.phone}
                />
            </div>

            <div className="flex flex-col gap-4 w-full shrink-0 px-5">
                <MyInput
                    label="Дата и время"
                    type="datetime-local"
                    name="date"
                    id="booking_date"
                    min={new Date(new Date() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.date}
                />

                <MyInput
                    label="Продолжительность (в часах)"
                    type="number"
                    name="duration"
                    id="booking_duration"
                    placeholder="2"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.duration}
                />
            </div>

            <div className="flex flex-col gap-4 w-full shrink-0 px-5">
                <MyInput
                    label="Количество человек"
                    type="number"
                    name="peoples"
                    id="booking_peoples"
                    placeholder="Максимум 5"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.peoples}
                />
            </div>
        </StepForm>
    );
}