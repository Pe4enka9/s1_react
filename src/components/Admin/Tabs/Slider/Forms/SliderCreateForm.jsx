import MyInput from "../../../../Input/MyInput.jsx";
import MyTextarea from "../../../../Input/MyTextarea.jsx";
import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createSliderSchema} from "../../../../../validations/slider/createSlider.js";
import client from "../../../../../api/client.js";
import {useState} from "react";

export default function SliderCreateForm({
                                             isOpen,
                                             setIsOpen,
                                             setSliders,
                                         }) {
    const [previewBgImg, setPreviewBgImg] = useState(null);

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

    const handleBgImgChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewBgImg(objectUrl);
        } else {
            setPreviewBgImg(null);
        }
    };

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
            const {data} = await client.post('/sliders', formData);

            setSliders(prev => [...prev, data]);
            setIsOpen(false);
            setPreviewBgImg(null);

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
            title="Добавить слайд"
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
                id="slider-create-name"
                placeholder="Введите заголовок"
                error={errors.name}
                {...register('name')}
            />

            <MyTextarea
                label="Описание"
                secondaryLabel="Необязательно"
                id="slider-create-description"
                placeholder="Введите описание"
                error={errors.description}
                {...register('description')}
            />

            <div className="flex items-end gap-2">
                <MyInput
                    label="Фоновое изображение"
                    type="file"
                    id="slider-create-bg-img"
                    error={errors.bg_img}
                    {...register('bg_img')}
                    onChange={handleBgImgChange}
                />

                <img
                    src={previewBgImg}
                    alt=""
                    className="w-16 h-16 rounded-lg border border-my-border object-cover"
                />
            </div>

            <MyInput
                label="Иконка (SVG)"
                secondaryLabel="Необязательно"
                type="file"
                id="slider-create-icon"
                error={errors.icon}
                {...register('icon')}
            />

            <MyInput
                label="Подпись к иконке"
                secondaryLabel="Необязательно"
                type="text"
                id="slider-create-icon-text"
                placeholder="Введите подпись"
                error={errors.icon_text}
                {...register('icon_text')}
            />

            <MyInput
                label="Текст кнопки"
                secondaryLabel="оставьте пустым, чтобы не показывать кнопку"
                type="text"
                id="slider-create-button"
                placeholder="Например: Забронировать"
                error={errors.button}
                {...register('button')}
            />
        </ModalForm>
    );
}
