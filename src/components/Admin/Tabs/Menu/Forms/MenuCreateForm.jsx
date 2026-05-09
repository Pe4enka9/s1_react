import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/client.js";
import {useEffect, useState} from "react";
import {createMenuSchema} from "../../../../../validations/menu/createMenu.js";
import {Plus} from "@gravity-ui/icons";
import {Button, FieldError, Input, Label, TextField} from "@heroui/react";
import FileInput from "../../../../Input/FileInput.jsx";

export default function MenuCreateForm({setMenus}) {
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
        resolver: zodResolver(createMenuSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            bg_img: null,
            icon: null,
        },
    });

    useEffect(() => {
        if (isOpen) clearErrors();
    }, [clearErrors, isOpen]);

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
            const {data} = await client.post('/menus', formData);

            setMenus(prev => [...prev, data]);
            setIsOpen(false);

            reset();
        } catch (e) {
            const {errors} = e.response.data;
            console.log(errors);

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
            id="create-menu-form"
            title="Добавить пункт меню"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sendButton="Сохранить"
            handleSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            icon={<Plus/>}
            enctype="multipart/form-data"
            trigger={<Button>Добавить пункт меню</Button>}
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
                isRequired
            />

            <FileInput
                control={control}
                name="icon"
                label="Иконка (SVG)"
                description="SVG до 2 MB"
                isRequired
            />
        </ModalForm>
    );
}
