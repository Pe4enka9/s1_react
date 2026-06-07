import {Button, ErrorMessage, FieldError, Input, Label, TextField, toast} from "@heroui/react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PhoneInput} from "../../Input/PhoneInput.jsx";
import api, {getCsrf} from "../../../api/api.js";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../../context/UserContext.js";
import {loginSchema} from "../../../validations/auth/login.js";
import ModalForm from "../Base/ModalForm.jsx";
import {Person} from "@gravity-ui/icons";

export default function Login() {
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
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            phone: '',
            password: '',
        },
    });

    useEffect(() => {
        if (isOpen) clearErrors();
    }, [clearErrors, isOpen]);

    const onSubmit = async (values) => {
        try {
            await getCsrf();
            const {data} = await api.post('/login', values);

            setUser(data);
            setIsOpen(false);
            reset();

            toast.success(`Вы вошли`);
        } catch (e) {
            const {errors} = e.response.data;

            if (!errors) {
                setError('auth', {
                    type: 'server',
                    message: 'Неверный логин или пароль.',
                });
                return;
            }

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
            id="login-form"
            title="Вход в аккаунт"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sendButton="Войти"
            handleSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            icon={<Person/>}
            trigger={<Button>Вход</Button>}
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

                        <FieldError>{errors.password?.message}</FieldError>
                    </TextField>
                )}
            />

            {errors.auth && (
                <ErrorMessage className="m-auto">{errors.auth?.message}</ErrorMessage>
            )}
        </ModalForm>
    );
}
