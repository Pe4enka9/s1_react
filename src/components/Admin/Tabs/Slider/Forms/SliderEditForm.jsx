import MyInput from "../../../../Input/MyInput.jsx";
import MyTextarea from "../../../../Input/MyTextarea.jsx";
import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/client.js";
import {useEffect, useState} from "react";
import {editSliderSchema} from "../../../../../validations/slider/editSlider.js";
import {handleImgChange} from "../../../../../functions/handleImgChange.js";
import MyFileInput from "../../../../Input/MyFileInput.jsx";

export default function SliderEditForm({
                                           isOpen,
                                           setIsOpen,
                                           setSliders,
                                           slider,
                                       }) {
    const [previewBgImg, setPreviewBgImg] = useState(null);
    const [previewIcon, setPreviewIcon] = useState(null);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
        setError,
        reset,
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewBgImg(null);

            reset({
                name: slider.name,
                description: slider.description || '',
                bg_img: null,
                icon: null,
                icon_text: slider.icon_text || '',
                button: slider.button || '',
            });
        }
    }, [isOpen, reset, slider]);

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
            title="Редактировать слайд"
            button="Сохранить"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={handleSubmit(onSubmit)}
            loading={isSubmitting}
            isFile
        >
            <MyInput
                label="Заголовок"
                type="text"
                id="slider-edit-name"
                placeholder="Введите заголовок"
                error={errors.name}
                {...register('name')}
            />

            <MyTextarea
                label="Описание"
                secondaryLabel="Необязательно"
                id="slider-edit-description"
                placeholder="Введите описание"
                error={errors.description}
                {...register('description')}
            />

            <MyFileInput
                label="Фоновое изображение"
                id="slider-edit-bg-img"
                error={errors.bg_img}
                preview={previewBgImg || slider?.bg_img}
                {...register('bg_img')}
                onChange={(e) =>
                    handleImgChange(e, setPreviewBgImg, register('bg_img').onChange)
                }
            />

            <MyFileInput
                label="Иконка (SVG)"
                secondaryLabel="Необязательно"
                id="slider-edit-icon"
                error={errors.icon}
                preview={previewIcon || slider?.icon}
                {...register('icon')}
                onChange={(e) =>
                    handleImgChange(e, setPreviewIcon, register('icon').onChange)
                }
            />

            <MyInput
                label="Подпись к иконке"
                secondaryLabel="Необязательно"
                type="text"
                id="slider-edit-icon-text"
                placeholder="Введите подпись"
                error={errors.icon_text}
                {...register('icon_text')}
            />

            <MyInput
                label="Текст кнопки"
                secondaryLabel="оставьте пустым, чтобы не показывать кнопку"
                type="text"
                id="slider-edit-button"
                placeholder="Например: Забронировать"
                error={errors.button}
                {...register('button')}
            />
        </ModalForm>
    );
}
