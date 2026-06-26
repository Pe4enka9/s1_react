import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import api from "../../../../../api/api.js";
import {useEffect, useState} from "react";
import {Pencil, PencilToSquare} from "@gravity-ui/icons";
import {FieldError, Label, TextArea, TextField} from "@heroui/react";
import {editUserSchema} from "../../../../../validations/user/editSlider.js";

export default function UserEditForm({setUsers, user}) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
        setError,
        reset,
        clearErrors,
    } = useForm({
        resolver: zodResolver(editUserSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            comment: '',
        },
    });

    useEffect(() => {
        if (isOpen && user) {
            clearErrors();

            reset({
                comment: user.comment || '',
            });
        }
    }, [clearErrors, isOpen, reset, user]);

    const onSubmit = async (values) => {
        try {
            const {data} = await api.post(`/users/${user.id}/comment`, values);

            setUsers(prev => prev.map(item => item.id === data.id ? data : item));
            setIsOpen(false);
        } catch (e) {
            const {errors} = e.response.data;

            Object.keys(errors).forEach(field => {
                setError(field, {
                    type: 'server',
                    message: errors[field][0],
                });
            });
        }
    };

    return (
        <ModalForm
            id="edit-user-form"
            title="Редактировать пользователя"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sendButton="Сохранить"
            handleSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            icon={<Pencil/>}
            trigger={
                <div
                    className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-white/10 transition-colors duration-200 flex justify-center items-center"
                >
                    <PencilToSquare className="w-full h-full object-contain"/>
                </div>
            }
        >
            <Controller
                control={control}
                name="comment"
                render={({field}) => (
                    <TextField isInvalid={!!errors.comment}>
                        <Label>Комментарий</Label>

                        <TextArea
                            placeholder="Введите комментарий"
                            variant="secondary"
                            {...field}
                        />

                        <FieldError>{errors.comment?.message}</FieldError>
                    </TextField>
                )}
            />
        </ModalForm>
    );
}
