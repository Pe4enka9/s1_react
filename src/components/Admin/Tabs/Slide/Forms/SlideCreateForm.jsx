import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/api.js";
import {useEffect, useState} from "react";
import {createSlideSchema} from "../../../../../validations/slide/createSlide.js";
import {Plus} from "@gravity-ui/icons";
import {Button, Description, FieldError, Input, Label, ListBox, Select, TextArea, TextField} from "@heroui/react";
import FileInput from "../../../../Input/FileInput.jsx";

export default function SlideCreateForm({setSlides, menus}) {
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
        resolver: zodResolver(createSlideSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            menu_id: '',
            name: '',
            description: '',
            bg_img: null,
            button: '',
        },
    });

    useEffect(() => {
        if (isOpen) clearErrors();
    }, [clearErrors, isOpen]);

    const onSubmit = async (values) => {
        const formData = new FormData();

        formData.append('menu_id', values.menu_id);
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('button', values.button || '');

        if (values.bg_img && values.bg_img.length > 0) {
            formData.append('bg_img', values.bg_img[0]);
        }

        try {
            const {data} = await client.post('/slides', formData);

            setSlides(prev => [data, ...prev]);
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
            title="Добавить слайд меню"
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
                name="menu_id"
                render={({field}) => (
                    <TextField isRequired>
                        <Label>Меню</Label>

                        <Select
                            placeholder="Выберите меню"
                            variant="secondary"
                            isInvalid={!!errors.menu_id}
                            {...field}
                        >
                            <Select.Trigger>
                                <Select.Value/>
                                <Select.Indicator/>
                            </Select.Trigger>

                            <Select.Popover>
                                <ListBox>
                                    {menus.map(menu => (
                                        <ListBox.Item key={menu.id} id={menu.id} textValue={menu.name}>
                                            {menu.name}
                                            <ListBox.ItemIndicator/>
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>

                        <FieldError>{errors.menu_id?.message}</FieldError>
                    </TextField>
                )}
            />

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
                    <TextField isInvalid={!!errors.description} isRequired>
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

            <Controller
                control={control}
                name="button"
                render={({field}) => (
                    <TextField isInvalid={!!errors.button}>
                        <Label>Текст кнопки</Label>

                        <Input
                            placeholder="Например: Подробнее"
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
