import {z} from "zod";
import {getLocalTimeZone} from "@internationalized/date";

export const bookingSchema = z.object({
    phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Введите корректный номер телефона.'),
    date: z.any()
        .refine(val => val != null, {
            message: 'Выберите дату',
        })
        .refine(val => 'toDate' in val, {
            message: 'Некорректная дата',
        })
        .refine(val => {
            const jsDate = val.toDate(getLocalTimeZone());
            return jsDate >= new Date();
        }, {
            message: 'Дата не может быть в прошлом',
        }),
    duration: z.coerce.number().min(1, 'Число не может быть меньше 1.').max(10, 'Число не может быть больше 10.'),
    peoples: z.coerce.number().min(1, 'Число не может быть меньше 1.').max(5, 'Число не может быть больше 5.'),
});
