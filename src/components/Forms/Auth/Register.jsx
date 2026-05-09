import {Button, Description, FieldError, Input, Label, TextField, toast} from "@heroui/react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {registerSchema} from "../../../validations/auth/register.js";
import {PhoneInput} from "../../Input/PhoneInput.jsx";
import client from "../../../api/client.js";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../../context/UserContext.js";
import ModalForm from "../Base/ModalForm.jsx";
import {PersonPlus} from "@gravity-ui/icons";

export default function Register() {
    const {setUser} = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
        setError,
        reset,
        clearErrors,
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            phone: '',
            password: '',
            password_confirmation: '',
        },
    });

    useEffect(() => {
        if (isOpen) clearErrors();
    }, [clearErrors, isOpen]);

    const onSubmit = async (values) => {
        try {
            const {data} = await client.post('/register', values);

            setUser(data);

            setIsOpen(false);
            reset();

            toast.success('Вы успешно зарегистрировались');
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
            id="register-form"
            title="Создание аккаунта"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sendButton="Зарегистрироваться"
            handleSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            icon={<PersonPlus/>}
            trigger={<Button variant="ghost">Регистрация</Button>}
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
                name="password"
                render={({field}) => (
                    <TextField
                        type="password"
                        isInvalid={!!errors.password}
                        isRequired
                    >
                        <Label>Пароль</Label>

                        <Input
                            placeholder="Введите пароль"
                            variant="secondary"
                            {...field}
                        />

                        <Description>Должен содержать не менее 6 символов.</Description>
                        <FieldError>{errors.password?.message}</FieldError>
                    </TextField>
                )}
            />

            <Controller
                control={control}
                name="password_confirmation"
                render={({field}) => (
                    <TextField
                        type="password"
                        isInvalid={!!errors.password_confirmation}
                        isRequired
                    >
                        <Label>Повтор пароля</Label>

                        <Input
                            placeholder="Повторите пароль"
                            variant="secondary"
                            {...field}
                        />

                        <FieldError>{errors.password_confirmation?.message}</FieldError>
                    </TextField>
                )}
            />
        </ModalForm>
    );
}
