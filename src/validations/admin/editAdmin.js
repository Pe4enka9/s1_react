import {z} from "zod";

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const editAdminSchema = z.object({
    avatar: z.any().refine(files => {
        if (!files || files.length === 0) return true;

        const file = files[0];

        return ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE;
    }, {message: 'Неподдерживаемый формат или размер файла. Разрешены: JPEG, JPG, PNG, WEBP до 2 МБ.'})
        .optional(),
});
