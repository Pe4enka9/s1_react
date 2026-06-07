import {Button, FieldError, Input, Label, TextField, toast} from "@heroui/react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PhoneInput} from "../Input/PhoneInput.jsx";
import client from "../../api/api.js";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserContext.js";
import {bookingSchema} from "../../validations/booking.js";
import {formatDateTime, formatDateTimeHuman} from "../../utils/formatDateTime.js";
import ModalForm from "./Base/ModalForm.jsx";
import {Calendar} from '@gravity-ui/icons';
import DateTimeInput from "../Input/DateTimeInput.jsx";
import {getLocalTimeZone, now} from "@internationalized/date";

export default function Booking({button}) {
    const {user} = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    const {
        control,
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
            date: now(getLocalTimeZone()),
            duration: '',
            peoples: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setValue('phone', user?.phone);
        }
    }, [clearErrors, isOpen, setValue, user]);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            date: formatDateTime(data.date),
        };

        try {
            await client.post('/bookings', payload);

            setIsOpen(false);
            reset();

            toast.success('Бронирование успешно создано', {
                description: `Дата: ${formatDateTimeHuman(data.date)}`,
                indicator: <Calendar/>,
            });
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
            id="booking-form"
            title="Бронирование"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sendButton="Забронировать"
            handleSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            icon={<Calendar/>}
            trigger={<Button size="lg">{button}</Button>}
        >
            <TextField
                isInvalid={!!errors.phone}
                isRequired
            >
                <Label>Номер телефона</Label>

                <Controller
                    control={control}
                    name="phone"
                    render={({field}) => (
                        <PhoneInput
                            placeholder="+7 (___) ___-__-__"
                            {...field}
                        />
                    )}
                />

                <FieldError>{errors.phone?.message}</FieldError>
            </TextField>

            <Controller
                control={control}
                name="date"
                render={({field}) => (
                    <DateTimeInput
                        label="Дата и время"
                        field={field}
                        error={errors.date}
                    />
                )}
            />

            <div className="flex gap-5 *:flex-1">
                <Controller
                    control={control}
                    name="duration"
                    render={({field}) => (
                        <TextField
                            type="number"
                            isInvalid={!!errors.duration}
                            isRequired
                        >
                            <Label>Продолжительность (в часах)</Label>

                            <Input
                                placeholder="2"
                                variant="secondary"
                                {...field}
                            />

                            <FieldError>{errors.duration?.message}</FieldError>
                        </TextField>
                    )}
                />

                <Controller
                    control={control}
                    name="peoples"
                    render={({field}) => (
                        <TextField
                            type="number"
                            isInvalid={!!errors.peoples}
                            isRequired
                        >
                            <Label>Количество человек</Label>

                            <Input
                                placeholder="Максимум 5"
                                variant="secondary"
                                {...field}
                            />

                            <FieldError>{errors.peoples?.message}</FieldError>
                        </TextField>
                    )}
                />
            </div>
        </ModalForm>
    );
}
