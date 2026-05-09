import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/client.js";
import {useEffect, useState} from "react";
import {editMenuSchema} from "../../../../../validations/menu/editMenu.js";
import {Pencil, PencilToSquare} from "@gravity-ui/icons";
import {FieldError, Input, Label, TextField} from "@heroui/react";
import FileInput from "../../../../Input/FileInput.jsx";

export default function MenuEditForm({setMenus, menu}) {
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
        resolver: zodResolver(editMenuSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            bg_img: null,
            icon: null,
        },
    });

    useEffect(() => {
        if (isOpen && menu) {
            clearErrors();

            reset({
                name: menu.name,
                bg_img: null,
                icon: null,
            });
        }
    }, [isOpen, reset, menu, clearErrors]);

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append('name', data.name);

        if (data.bg_img && data.bg_img.length > 0) {
            formData.append('bg_img', data.bg_img[0]);
        }

        if (data.icon && data.icon.length > 0) {
            formData.append('icon', data.icon[0]);
        }

        try {
            const {data} = await client.patch(`/menus/${menu.id}`, formData);

            setMenus(prev => prev.map(item => item.id === data.id ? data : item));
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
            id="edit-menu-form"
            title="Редактировать пункт меню"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sendButton="Сохранить"
            handleSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            icon={<Pencil/>}
            enctype="multipart/form-data"
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
                name="name"
                render={({field}) => (
                    <TextField isInvalid={!!errors.name} isRequired>
                        <Label>Заголовок</Label>

                        <Input
                            placeholder="Введите заголовок"
                            variant="secondary"
                            {...field}
                        />

                        <FieldError>{errors.name?.message}</FieldError>
                    </TextField>
                )}
            />

            <FileInput
                control={control}
                name="bg_img"
                label="Фоновое изображение"
                description="JPEG, JPG, PNG, WEBP до 2 MB"
                editPreview={menu.bg_img}
                isRequired
            />

            <FileInput
                control={control}
                name="icon"
                label="Иконка (SVG)"
                description="SVG до 2 MB"
                editPreview={menu.icon}
                isRequired
            />
        </ModalForm>
    );
}
