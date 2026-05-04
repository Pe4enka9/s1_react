import {z} from "zod";

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_ICON_TYPES = ['image/svg+xml', 'image/svg'];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const editMenuSchema = z.object({
    name: z.string().min(1, 'Поле заголовок обязательно.'),
    bg_img: z.any().refine(files => {
        if (!files || files.length === 0) return true;

        const file = files[0];

        return ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE;
    }, {message: 'Неподдерживаемый формат или размер файла. Разрешены: JPEG, JPG, PNG, WEBP до 2 МБ.'})
        .optional(),
    icon: z.any().refine(files => {
        if (!files || files.length === 0) return true;

        const file = files[0];

        return ACCEPTED_ICON_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE;
    }, {message: 'Требуется SVG файл до 2 МБ.'})
        .optional(),
    is_booking: z.boolean().default(false),
});
