import {z} from "zod";

export const registerSchema = z.object({
    phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Введите корректный номер телефона.'),
    password: z.string().min(6, 'Пароль должен содержать не менее 6 символов.'),
    password_confirmation: z.string().min(1, 'Поле подтверждения пароля обязательное.'),
}).refine(data => data.password === data.password_confirmation, {
    message: 'Пароли не совпадают',
    path: ['password_confirmation'],
});
