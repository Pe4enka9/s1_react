import {z} from "zod";

export const bookingSchema = z.object({
    phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Введите корректный номер телефона.'),
    date: z.string().min(1, 'Выберите дату')
        .transform(val => new Date(val))
        .refine(value => value >= new Date(), {
            message: 'Дата не может быть в прошлом.',
        }),
    duration: z.coerce.number().min(1, 'Число не может быть меньше 1.').max(10, 'Число не может быть больше 10.'),
    peoples: z.coerce.number().min(1, 'Число не может быть меньше 1.').max(5, 'Число не может быть больше 5.'),
});
