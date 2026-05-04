import MyInput from "../../../../Input/MyInput.jsx";
import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/client.js";
import {useEffect, useState} from "react";
import {editMenuSchema} from "../../../../../validations/menu/editMenu.js";
import MyCheckbox from "../../../../Input/MyCheckbox.jsx";
import {handleImgChange} from "../../../../../functions/handleImgChange.js";
import MyFileInput from "../../../../Input/MyFileInput.jsx";

export default function MenuEditForm({
                                         isOpen,
                                         setIsOpen,
                                         setMenus,
                                         menu,
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
        resolver: zodResolver(editMenuSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            bg_img: null,
            icon: null,
            is_booking: false,
        },
    });

    useEffect(() => {
        if (isOpen && menu) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewBgImg(null);
            setPreviewIcon(null);

            reset({
                name: menu.name,
                bg_img: null,
                icon: null,
                is_booking: menu.is_booking || false,
            });
        }
    }, [isOpen, reset, menu]);

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('is_booking', data.is_booking ? '1' : '0');

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
            title="Редактировать пункт меню"
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
                id="menu-edit-name"
                placeholder="Введите заголовок"
                error={errors.name}
                {...register('name')}
            />

            <MyFileInput
                label="Фоновое изображение"
                id="menu-edit-bg-img"
                error={errors.bg_img}
                preview={previewBgImg || menu?.bg_img}
                {...register('bg_img')}
                onChange={(e) =>
                    handleImgChange(e, setPreviewBgImg, register('bg_img').onChange)
                }
            />

            <MyFileInput
                label="Иконка (SVG)"
                id="menu-edit-icon"
                error={errors.icon}
                preview={previewIcon || menu?.icon}
                {...register('icon')}
                onChange={(e) =>
                    handleImgChange(e, setPreviewIcon, register('icon').onChange)
                }
            />

            <MyCheckbox
                id="menu-edit-is-booking"
                label="Открывать форму бронирования"
                {...register('is_booking')}
            />
        </ModalForm>
    );
}
