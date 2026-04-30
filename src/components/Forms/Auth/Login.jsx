import ModalForm from "../Base/ModalForm.jsx";
import MyInput from "../../Input/MyInput.jsx";
import profileIcon from '../../../icons/profile.svg';
import PhoneInput from "../../Input/PhoneInput.jsx";
import {useContext, useState} from "react";
import client, {getCsrf} from "../../../api/client.js";
import {UserContext} from "../../../context/UserContext.js";
import {useUI} from "../../../hooks/useUI.js";
import {useLockBodyScroll} from "../../../hooks/useLockBodyScroll.js";

const validators = {
    phone: (value) => {
        if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value.trim())) {
            return 'Введите корректный номер телефона.';
        }
    },
    password: (value) => {
        if (!value) {
            return 'Пароль обязателен.';
        }
    },
};

export default function Login() {
    const {setUser} = useContext(UserContext);
    const {isOpenLogin, setIsOpenLogin} = useUI();
    useLockBodyScroll(isOpenLogin);

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setErrors({});

            await getCsrf();
            const {data} = await client.post('/login', formData);
            setUser(data);

            setFormData({phone: '', password: ''});
            setIsOpenLogin(false);
        } catch (e) {
            if (e.response.status === 401) {
                setErrors({auth: 'Неверный логин или пароль.'})
                return;
            }

            const errors = e.response.data.errors;

            if (errors) {
                setErrors(errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalForm
            title="Вход в аккаунт"
            button="Войти"
            icon={profileIcon}
            isOpen={isOpenLogin}
            setIsOpen={setIsOpenLogin}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <PhoneInput
                id="login_phone"
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                validate={validators.phone}
            />

            <MyInput
                label="Пароль"
                type="password"
                name="password"
                id="login_password"
                placeholder="Введите пароль"
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                validate={validators.password}
            />

            {errors.auth && (
                <div className="text-secondary text-center">{errors.auth}</div>
            )}
        </ModalForm>
    );
}
