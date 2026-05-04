import MyInput from "../../../../Input/MyInput.jsx";
import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/client.js";
import {useEffect, useState} from "react";
import MySelect from "../../../../Input/MySelect.jsx";
import MyTextarea from "../../../../Input/MyTextarea.jsx";
import {editSlideSchema} from "../../../../../validations/slide/editSlide.js";

export default function SlideEditForm({
                                          isOpen,
                                          setIsOpen,
                                          setSlides,
                                          slide,
                                      }) {
    const [menus, setMenus] = useState([]);
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

    const bgImgOnChange = register('bg_img').onChange;

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const {data} = await client.get('/menus');

                setMenus(data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchMenus();
    }, []);

    useEffect(() => {
        if (isOpen && slide) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewBgImg(null);

            reset({
                menu_id: slide.menu.id,
                name: slide.name,
                description: slide.description,
                bg_img: null,
                button: slide.button || '',
            });
        }
    }, [isOpen, reset, slide]);

    const handleBgImgChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewBgImg(objectUrl);
        } else {
            setPreviewBgImg(null);
        }

        bgImgOnChange(e);
    };

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
            title="Редактировать слайд меню"
            button="Сохранить"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={handleSubmit(onSubmit)}
            loading={isSubmitting}
            isFile
        >
            <MySelect
                label="Меню"
                id="slide-edit-menu-id"
                error={errors.menu_id}
                {...register('menu_id')}
            >
                <option value="" hidden>Выберите меню</option>

                {menus.map(menu => (
                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                ))}
            </MySelect>

            <MyInput
                label="Заголовок"
                type="text"
                id="slide-edit-name"
                placeholder="Введите заголовок"
                error={errors.name}
                {...register('name')}
            />

            <MyTextarea
                label="Описание"
                id="slide-edit-description"
                placeholder="Введите описание"
                error={errors.description}
                {...register('description')}
            />

            <div className="flex items-end gap-2">
                <MyInput
                    label="Фоновое изображение"
                    type="file"
                    id="slide-edit-bg-img"
                    error={errors.bg_img}
                    {...register('bg_img')}
                    onChange={handleBgImgChange}
                />

                <img
                    src={previewBgImg ?? slide?.bg_img}
                    alt=""
                    className="w-16 h-16 rounded-lg border border-my-border object-cover"
                />
            </div>

            <MyInput
                label="Текст кнопки"
                secondaryLabel="оставьте пустым, чтобы не показывать кнопку"
                type="text"
                id="slide-edit-button"
                placeholder="Например: Подробнее"
                error={errors.button}
                {...register('button')}
            />
        </ModalForm>
    );
}
