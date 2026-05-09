import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/client.js";
import {useEffect, useState} from "react";
import {editSliderSchema} from "../../../../../validations/slider/editSlider.js";
import {Pencil, PencilToSquare} from "@gravity-ui/icons";
import {Description, FieldError, Input, Label, TextArea, TextField} from "@heroui/react";
import FileInput from "../../../../Input/FileInput.jsx";

export default function SliderEditForm({setSliders, slider}) {
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
        resolver: zodResolver(editSliderSchema),
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
        if (isOpen && slider) {
            clearErrors();

            reset({
                name: slider.name,
                description: slider.description || '',
                bg_img: null,
                icon: null,
                icon_text: slider.icon_text || '',
                button: slider.button || '',
            });
        }
    }, [clearErrors, isOpen, reset, slider]);

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('description', data.description || '');
        formData.append('icon_text', data.icon_text || '');
        formData.append('button', data.button || '');

        if (data.bg_img && data.bg_img.length > 0) {
            formData.append('bg_img', data.bg_img[0]);
        }

        if (data.icon && data.icon.length > 0) {
            formData.append('icon', data.icon[0]);
        }

        try {
            const {data} = await client.patch(`/sliders/${slider.id}`, formData);

            setSliders(prev => prev.map(item => item.id === data.id ? data : item));
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
            id="edit-slide-form"
            title="Редактировать слайд"
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
                editPreview={slider.bg_img}
                isRequired
            />

            <FileInput
                control={control}
                name="icon"
                label="Иконка (SVG)"
                description="SVG до 2 MB"
                editPreview={slider.icon}
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
