import MyInput from "../../Input/MyInput.jsx";
import profileIcon from '../../../icons/profile.svg';
import PhoneInput from "../../Input/PhoneInput.jsx";
import StepForm from "../Base/StepForm.jsx";
import {useContext, useState} from "react";
import client from "../../../api/client.js";
import {UserContext} from "../../../context/UserContext.js";
import {useUI} from "../../../hooks/useUI.js";

const validators = {
    phone: (value) => {
        if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value.trim())) {
            return 'Введите корректный номер телефона.';
        }
    },
    firstName: (value) => {
        if (!/^[a-zA-Zа-яА-ЯёЁ]{2,}([-'][a-zA-Zа-яА-ЯёЁ]{2,})*$/.test(value.trim())) {
            return 'Имя обязательно.';
        }
    },
    lastName: (value) => {
        if (!/^[a-zA-Zа-яА-ЯёЁ]{2,}([-'][a-zA-Zа-яА-ЯёЁ]{2,})*$/.test(value.trim())) {
            return 'Фамилия обязательна.';
        }
    },
    password: (value) => {
        if (value.trim().length < 6) {
            return 'Пароль должен содержать не менее 6 символов.';
        }
    },
    passwordConfirmation: (value, formData) => {
        if (value.trim() !== formData.password.trim()) {
            return 'Пароли не совпадают.';
        }
    },
};

export default function Register() {
    const {setUser} = useContext(UserContext);
    const {isOpenRegister, setIsOpenRegister} = useUI();

    const [formData, setFormData] = useState({
        phone: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
                const regex = /^[a-zA-Zа-яА-ЯёЁ]{2,}([-'][a-zA-Zа-яА-ЯёЁ]{2,})*$/;

                if (!regex.test(formData.first_name.trim())) {
                    isValid = false;
                    newErrors.first_name = 'Имя обязательно.';
                }

                if (!regex.test(formData.last_name.trim())) {
                    isValid = false;
                    newErrors.last_name = 'Фамилия обязательна.';
                }
                break;
            }
            case 3:
                if (formData.password.trim().length < 6) {
                    isValid = false;
                    newErrors.password = 'Пароль должен содержать не менее 6 символов.';
                }

                if (formData.password.trim() !== formData.password_confirmation.trim()) {
                    isValid = false;
                    newErrors.password_confirmation = 'Пароли не совпадают.';
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

            const {data} = await client.post('/register', formData);
            setUser(data);

            setFormData({phone: '', first_name: '', last_name: '', password: '', password_confirmation: ''});
            setIsOpenRegister(false);
        } catch (e) {
            const {errors} = e.response.data;
            setErrors(errors);

            for (const [field] of Object.entries(errors)) {
                switch (field) {
                    case 'phone':
                        return 1;
                    case 'first_name':
                    case 'last_name':
                        return 2;
                    case 'password':
                        return 3;
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <StepForm
            stepLabels={['Контакт', 'Личные данные', 'Пароль']}
            title="Создание аккаунта"
            button="Зарегистрироваться"
            icon={profileIcon}
            isOpen={isOpenRegister}
            setIsOpen={setIsOpenRegister}
            onSubmit={handleSubmit}
            loading={loading}
            validateStep={validateStep}
        >
            <div className="flex flex-col gap-4 w-full shrink-0 px-5">
                <PhoneInput
                    id="register_phone"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.phone}
                />
            </div>

            <div className="flex flex-col gap-4 w-full shrink-0 px-5">
                <MyInput
                    label="Имя"
                    type="text"
                    name="first_name"
                    id="register_first_name"
                    placeholder="Введите ваше имя"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.firstName}
                />

                <MyInput
                    label="Фамилия"
                    type="text"
                    name="last_name"
                    id="register_last_name"
                    placeholder="Введите вашу фамилию"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.lastName}
                />
            </div>

            <div className="flex flex-col gap-4 w-full shrink-0 px-5">
                <MyInput
                    label="Пароль"
                    type="password"
                    name="password"
                    id="register_password"
                    placeholder="Введите пароль"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.password}
                />

                <MyInput
                    label="Повтор пароля"
                    type="password"
                    name="password_confirmation"
                    id="register_password_confirmation"
                    placeholder="Повторите пароль"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.passwordConfirmation}
                />
            </div>
        </StepForm>
    );
}
