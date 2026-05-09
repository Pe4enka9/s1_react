import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/client.js";
import {useEffect, useState} from "react";
import {editSlideSchema} from "../../../../../validations/slide/editSlide.js";
import {Pencil, PencilToSquare} from "@gravity-ui/icons";
import {Description, FieldError, Input, Label, ListBox, Select, TextArea, TextField} from "@heroui/react";
import FileInput from "../../../../Input/FileInput.jsx";

export default function SlideEditForm({
                                          setSlides,
                                          slide,
                                          menus,
                                      }) {
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
        resolver: zodResolver(editSlideSchema),
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
        if (isOpen && slide) {
            clearErrors();

            reset({
                menu_id: slide.menu.id,
                name: slide.name,
                description: slide.description,
                bg_img: null,
                button: slide.button || '',
            });
        }
    }, [clearErrors, isOpen, reset, slide]);

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append('menu_id', data.menu_id);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('button', data.button || '');

        if (data.bg_img && data.bg_img.length > 0) {
            formData.append('bg_img', data.bg_img[0]);
        }

        try {
            const {data} = await client.patch(`/slides/${slide.id}`, formData);

            setSlides(prev => prev.map(item => item.id === data.id ? data : item));
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
            id="edit-slide-form"
            title="Редактировать слайд меню"
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
                editPreview={slide.bg_img}
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
