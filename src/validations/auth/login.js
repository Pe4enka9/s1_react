import {z} from "zod";

export const loginSchema = z.object({
    phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Введите корректный номер телефона.'),
    password: z.string().min(1, 'Пароль обязателен.'),
});
