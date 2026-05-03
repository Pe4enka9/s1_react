import {useContext} from "react";
import client from "../../../api/client.js";
import {UserContext} from "../../../context/UserContext.js";
import {useUI} from "../../../hooks/useUI.js";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {registerSchema} from "../../../validations/auth/register.js";
import PhoneInput from "../../Input/PhoneInput.jsx";
import MyInput from "../../Input/MyInput.jsx";
import ModalForm from "../Base/ModalForm.jsx";
import profileIcon from '../../../icons/profile.svg';

export default function Register() {
    const {setUser} = useContext(UserContext);
    const {isOpenRegister, setIsOpenRegister} = useUI();

    const {
        control,
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
        setError,
        reset,
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

    const onSubmit = async (values) => {
        try {
            const {data} = await client.post('/register', values);

            setUser(data);
            setIsOpenRegister(false);

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
            title="Создание аккаунта"
            button="Зарегистироваться"
            icon={profileIcon}
            isOpen={isOpenRegister}
            setIsOpen={setIsOpenRegister}
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
                label="Пароль"
                type="password"
                id="register_password"
                placeholder="Введите пароль"
                error={errors.password}
                {...register('password')}
            />

            <MyInput
                label="Повтор пароля"
                type="password"
                id="register_password_confirmation"
                placeholder="Повторите пароль"
                error={errors.password_confirmation}
                {...register('password_confirmation')}
            />
        </ModalForm>
    );
}
