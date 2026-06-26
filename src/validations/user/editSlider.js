import {z} from "zod";

export const editUserSchema = z.object({
    comment: z.string().optional(),
});
