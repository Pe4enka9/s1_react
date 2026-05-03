import ModalForm from "../Base/ModalForm.jsx";
import profileIcon from '../../../icons/profile.svg';
import {useContext, useEffect} from "react";
import client, {getCsrf} from "../../../api/client.js";
import {UserContext} from "../../../context/UserContext.js";
import {useUI} from "../../../hooks/useUI.js";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "../../../validations/auth/login.js";
import MyInput from "../../Input/MyInput.jsx";
import PhoneInput from "../../Input/PhoneInput.jsx";

export default function Login() {
    const {setUser} = useContext(UserContext);
    const {isOpenLogin, setIsOpenLogin} = useUI();

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
        if (!isOpenLogin) clearErrors();
    }, [clearErrors, isOpenLogin]);

    const onSubmit = async (values) => {
        try {
            await getCsrf();
            const {data} = await client.post('/login', values);

            setUser(data);
            setIsOpenLogin(false);

            reset();
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
            title="Вход в аккаунт"
            button="Войти"
            icon={profileIcon}
            isOpen={isOpenLogin}
            setIsOpen={setIsOpenLogin}
            onSubmit={handleSubmit(onSubmit)}
            loading={isSubmitting}
        >
            <Controller
                name="phone"
                control={control}
                render={({field}) => (
                    <PhoneInput
                        id="login_phone"
                        error={errors.phone}
                        {...field}
                    />
                )}
            />

            <MyInput
                label="Пароль"
                type="password"
                id="login_password"
                placeholder="Введите пароль"
                error={errors.password}
                {...register('password')}
            />

            {errors.auth && (
                <div className="text-secondary text-center">{errors.auth.message}</div>
            )}
        </ModalForm>
    );
}
