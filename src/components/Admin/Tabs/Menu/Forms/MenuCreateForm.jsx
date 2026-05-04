import MyInput from "../../../../Input/MyInput.jsx";
import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import client from "../../../../../api/client.js";
import {useState} from "react";
import {createMenuSchema} from "../../../../../validations/menu/createMenu.js";
import MyCheckbox from "../../../../Input/MyCheckbox.jsx";

export default function MenuCreateForm({
                                           isOpen,
                                           setIsOpen,
                                           setMenus,
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
        resolver: zodResolver(createMenuSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            bg_img: null,
            icon: null,
            is_booking: false,
        },
    });

    const bgImgOnChange = register('bg_img').onChange;
    const iconOnChange = register('icon').onChange;

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

    const handleIconChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewIcon(objectUrl);
        } else {
            setPreviewIcon(null);
        }

        iconOnChange(e);
    };

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
            const {data} = await client.post('/menus', formData);

            setMenus(prev => [...prev, data]);
            setIsOpen(false);
            setPreviewBgImg(null);
            setPreviewIcon(null);

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
            title="Добавить пункт меню"
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
                id="menu-create-name"
                placeholder="Введите заголовок"
                error={errors.name}
                {...register('name')}
            />

            <div className="flex items-end gap-2">
                <MyInput
                    label="Фоновое изображение"
                    type="file"
                    id="menu-create-bg-img"
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

            <div className="flex items-end gap-2">
                <MyInput
                    label="Иконка (SVG)"
                    type="file"
                    id="menu-create-icon"
                    error={errors.icon}
                    {...register('icon')}
                    onChange={handleIconChange}
                />

                <img
                    src={previewIcon}
                    alt=""
                    className="w-16 h-16 rounded-lg border border-my-border object-cover"
                />
            </div>

            <MyCheckbox
                id="menu-create-is-booking"
                label="Открывать форму бронирования"
                {...register('is_booking')}
            />
        </ModalForm>
    );
}
