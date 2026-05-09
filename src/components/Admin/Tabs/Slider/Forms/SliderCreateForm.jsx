import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createSliderSchema} from "../../../../../validations/slider/createSlider.js";
import client from "../../../../../api/client.js";
import {useEffect, useState} from "react";
import {Plus} from "@gravity-ui/icons";
import {Button, Description, FieldError, Input, Label, TextArea, TextField} from "@heroui/react";
import FileInput from "../../../../Input/FileInput.jsx";

export default function SliderCreateForm({setSliders}) {
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
        resolver: zodResolver(createSliderSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            bg_img: null,
            icon: null,
            icon_text: '',
            button: '',
        },
    });

    useEffect(() => {
        if (isOpen) clearErrors();
    }, [clearErrors, isOpen]);

    const onSubmit = async (values) => {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('icon_text', values.icon_text || '');
        formData.append('button', values.button || '');

        if (values.bg_img && values.bg_img.length > 0) {
            formData.append('bg_img', values.bg_img[0]);
        }

        if (values.icon && values.icon.length > 0) {
            formData.append('icon', values.icon[0]);
        }

        try {
            const {data} = await client.post('/sliders', formData);

            setSliders(prev => [...prev, data]);
            setIsOpen(false);

            reset();
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
            id="create-slide-form"
            title="Добавить слайд"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sendButton="Сохранить"
            handleSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            icon={<Plus/>}
            enctype="multipart/form-data"
            trigger={<Button>Добавить слайд</Button>}
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

            <Controller
                control={control}
                name="description"
                render={({field}) => (
                    <TextField isInvalid={!!errors.description}>
                        <Label>Описание</Label>

                        <TextArea
                            placeholder="Введите описание"
                            variant="secondary"
                            {...field}
                        />

                        <FieldError>{errors.description?.message}</FieldError>
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
            />

            <Controller
                control={control}
                name="icon_text"
                render={({field}) => (
                    <TextField isInvalid={!!errors.icon_text}>
                        <Label>Подпись к иконке</Label>

                        <Input
                            placeholder="Введите подпись"
                            variant="secondary"
                            {...field}
                        />

                        <FieldError>{errors.icon_text?.message}</FieldError>
                    </TextField>
                )}
            />

            <Controller
                control={control}
                name="button"
                render={({field}) => (
                    <TextField isInvalid={!!errors.button}>
                        <Label>Текст кнопки</Label>

                        <Input
                            placeholder="Например: Забронировать"
                            variant="secondary"
                            {...field}
                        />

                        <Description>Оставьте пустым, чтобы не показывать кнопку</Description>
                        <FieldError>{errors.button?.message}</FieldError>
                    </TextField>
                )}
            />
        </ModalForm>
    );
}
