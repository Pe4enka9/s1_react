import ModalForm from "../../../../Forms/Base/ModalForm.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import api from "../../../../../api/api.js";
import {useEffect, useState} from "react";
import {Pencil, PencilToSquare} from "@gravity-ui/icons";
import FileInput from "../../../../Input/FileInput.jsx";
import {editAdminSchema} from "../../../../../validations/admin/editAdmin.js";

export default function AdminEditForm({setAdmins, admin}) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {
            isSubmitting,
        },
        setError,
        reset,
        clearErrors,
    } = useForm({
        resolver: zodResolver(editAdminSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            avatar: null,
        },
    });

    useEffect(() => {
        if (isOpen && admin) {
            clearErrors();

            reset({
                avatar: null,
            });
        }
    }, [admin, clearErrors, isOpen, reset]);

    const onSubmit = async (data) => {
        const formData = new FormData();

        if (data.avatar && data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0]);
        }

        try {
            const {data} = await api.patch(`/admins/${admin.id}`, formData);

            setAdmins(prev => prev.map(item =>
                item.id === data.id ? data : item
            ));

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
            id="edit-admin-form"
            title="Редактировать администратора"
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
            <FileInput
                control={control}
                name="avatar"
                label="Аватар"
                description="JPEG, JPG, PNG, WEBP до 2 MB"
                editPreview={admin.avatar}
                isRequired
            />
        </ModalForm>
    );
}
