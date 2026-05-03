import calendarIcon from '../../icons/calendar.svg';
import MyInput from "../Input/MyInput.jsx";
import PhoneInput from "../Input/PhoneInput.jsx";
import {useContext, useEffect} from "react";
import client from "../../api/client.js";
import {useUI} from "../../hooks/useUI.js";
import {UserContext} from "../../context/UserContext.js";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import ModalForm from "./Base/ModalForm.jsx";
import {bookingSchema} from "../../validations/booking.js";

export default function Booking() {
    const {user} = useContext(UserContext);
    const {isOpenBooking, setIsOpenBooking} = useUI();

    const {
        control,
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
        setValue,
        setError,
        reset,
        clearErrors,
    } = useForm({
        resolver: zodResolver(bookingSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            phone: '',
            date: '',
            duration: '',
            peoples: '',
        },
    });

    useEffect(() => {
        setValue('phone', user?.phone);
    }, [setValue, user, isOpenBooking]);

    useEffect(() => {
        if (!isOpenBooking) clearErrors();
    }, [clearErrors, isOpenBooking]);

    const onSubmit = async (data) => {
        try {
            await client.post('/bookings', data);

            setIsOpenBooking(false);

            reset();
        } catch (e) {
            const {errors} = e.response.data;

            Object.keys(errors).forEach(field => {
                setError(field, {
                    type: 'server',
                    message: errors[field][0],
                });
            });
        }
    };

    return (
        <ModalForm
            title="Бронирование"
            button="Забронировать"
            icon={calendarIcon}
            isOpen={isOpenBooking}
            setIsOpen={setIsOpenBooking}
            onSubmit={handleSubmit(onSubmit)}
            loading={isSubmitting}
        >
            <Controller
                name="phone"
                control={control}
                render={({field}) => (
                    <PhoneInput
                        id="register_phone"
                        error={errors.phone}
                        {...field}
                    />
                )}
            />

            <MyInput
                label="Дата и время"
                type="datetime-local"
                id="booking_date"
                min={new Date(new Date() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                error={errors.date}
                {...register('date')}
            />

            <div className="flex gap-5">
                <MyInput
                    label="Продолжительность (в часах)"
                    type="number"
                    id="booking_duration"
                    placeholder="2"
                    error={errors.duration}
                    {...register('duration')}
                />

                <MyInput
                    label="Количество человек"
                    type="number"
                    id="booking_peoples"
                    placeholder="Максимум 5"
                    error={errors.peoples}
                    {...register('peoples')}
                />
            </div>
        </ModalForm>
    );
}