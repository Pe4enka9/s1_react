import {Button, FieldError, Label, ListBox, Spinner, TextField, toast} from "@heroui/react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PhoneInput} from "../../Input/PhoneInput.jsx";
import api from "../../../api/api.js";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../../context/UserContext.js";
import {bookingSchema} from "../../../validations/booking.js";
import {formatDate, formatDateTimeCalendar} from "../../../utils/formatDateTime.js";
import ModalForm from "../Base/ModalForm.jsx";
import MyCalendar from "../../Input/MyCalendar.jsx";
import {getLocalTimeZone, now} from "@internationalized/date";
import {Calendar} from "@gravity-ui/icons";
import Slot from "./Slot.jsx";
import MySelect from "../../Input/MySelect.jsx";

export default function Booking({button}) {
    const {user} = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

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
        watch,
    } = useForm({
        resolver: zodResolver(bookingSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            phone: '',
            date: now(getLocalTimeZone()),
            duration: '',
            peoples: '',
            time: '',
        },
    });

    const watchDate = watch('date');
    const watchTime = watch('time');
    const watchDuration = watch('duration');
    const watchPeoples = watch('peoples');

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setValue('phone', user?.phone);
        }
    }, [clearErrors, isOpen, setValue, user]);

    useEffect(() => {
        if (!watchDate || !watchDuration || !watchPeoples) {
            setSlots([]);
            return;
        }

        const fetchSlots = async () => {
            try {
                setLoading(true);
                setValue('time', '')

                const {data} = await api.get('/slots', {
                    params: {
                        date: formatDate(watchDate),
                        peoples: watchPeoples,
                        duration: watchDuration,
                    },
                });

                setSlots(data);
            } catch (e) {
                console.log(e);
                setSlots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [setValue, watchDate, watchDuration, watchPeoples]);

    const handleSlotSelect = (time) => {
        setValue('time', time);
    };

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            date: `${formatDate(data.date)}T${data.time}`,
        };

        try {
            await api.post('/bookings', payload);

            setIsOpen(false);
            reset();

            toast.success('Бронирование успешно создано', {
                description: `Дата: ${formatDateTimeCalendar(data.date, data.time)}`,
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

            <div className="flex flex-col gap-4 *:flex-1 sm:gap-5 sm:flex-row">
                <Controller
                    control={control}
                    name="duration"
                    render={({field}) => (
                        <TextField
                            isInvalid={!!errors.duration}
                            isRequired
                        >
                            <MySelect
                                placeholder="Выберите время"
                                label="Продолжительность (в часах)"
                                field={field}
                            >
                                <ListBox.Item id="1" textValue="1">
                                    1
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>

                                <ListBox.Item id="2" textValue="2">
                                    2
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>

                                <ListBox.Item id="3" textValue="3">
                                    3
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>

                                <ListBox.Item id="4" textValue="4">
                                    4
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>

                                <ListBox.Item id="5" textValue="5">
                                    5
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>
                            </MySelect>

                            <FieldError>{errors.duration?.message}</FieldError>
                        </TextField>
                    )}
                />

                <Controller
                    control={control}
                    name="peoples"
                    render={({field}) => (
                        <TextField
                            isInvalid={!!errors.peoples}
                            isRequired
                        >
                            <MySelect
                                placeholder="Выберите количество"
                                label="Количество человек"
                                field={field}
                            >
                                <ListBox.Item id="1" textValue="1">
                                    1
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>

                                <ListBox.Item id="2" textValue="2">
                                    2
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>

                                <ListBox.Item id="3" textValue="3">
                                    3
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>

                                <ListBox.Item id="4" textValue="4">
                                    4
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>

                                <ListBox.Item id="5" textValue="5">
                                    5
                                    <ListBox.ItemIndicator/>
                                </ListBox.Item>
                            </MySelect>

                            <FieldError>{errors.peoples?.message}</FieldError>
                        </TextField>
                    )}
                />
            </div>

            <Controller
                control={control}
                name="date"
                render={({field}) => (
                    <TextField
                        isInvalid={!!errors.date}
                        isRequired
                    >
                        <Label className="text-center">
                            Дата бронирования
                        </Label>

                        <MyCalendar field={field}/>

                        <FieldError className="text-center">
                            {errors.date?.message}
                        </FieldError>
                    </TextField>
                )}
            />

            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner size="lg"/>
                </div>
            ) : (
                slots.length === 0 ? (
                    <p className="text-center">Нет доступных записей</p>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {slots.map(slot => (
                            <Slot
                                slot={slot}
                                handleSlotSelect={handleSlotSelect}
                                watchTime={watchTime}
                            />
                        ))}
                    </div>
                )
            )}
        </ModalForm>
    );
}
