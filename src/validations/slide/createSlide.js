import {z} from "zod";

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const createSlideSchema = z.object({
    menu_id: z.coerce.number().min(1, 'Выберите меню.'),
    name: z.string().min(1, 'Поле заголовок обязательно.'),
    description: z.string().min(1, 'Поле описание обязательно.'),
    bg_img: z.any().refine(files => {
        if (!files || files.length === 0) return false;

        const file = files[0];

        return ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE;
    }, {message: 'Неподдерживаемый формат или размер файла. Разрешены: JPEG, JPG, PNG, WEBP до 2 МБ.'}),
    button: z.string().optional(),
});
