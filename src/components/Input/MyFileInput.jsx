import {useEffect, useRef, useState} from "react";
import {Button, FieldError, Label, TextField} from "@heroui/react";
import {ArrowShapeDownToLine} from "@gravity-ui/icons";

export default function MyFileInput({
                                        label,
                                        value,
                                        onChange,
                                        error,
                                        description,
                                        accept,
                                        isRequired = false,
                                        button = 'Выберите файл',
                                        editPreview = null,
                                    }) {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        if (!value || value.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreview(null);
            setFile(null);
            return;
        }

        const file = value[0];
        const url = URL.createObjectURL(file);

        setFile(file);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [value]);

    const handleChange = (e) => {
        const files = e.target.files;
        if (!files?.length) return;

        onChange?.(files);
    };

    const handleRemove = () => {
        onChange?.(null);
        setPreview(null);
        setFile(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <TextField
            isInvalid={!!error}
            isRequired={isRequired}
        >
            <Label>{label}</Label>

            {value?.length && file ? (
                <div className="bg-default/50 rounded-lg py-2 px-3 flex items-center gap-4 w-full">
                    {preview && (
                        <div className="w-18 h-18 rounded-lg overflow-hidden">
                            <img src={preview} alt="" className="w-full h-full object-cover"/>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <div>
                            <div className="text-white">{file.name}</div>
                            <div className="text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>

                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onPress={() => inputRef.current?.click()}
                            >
                                Изменить
                            </Button>

                            <Button
                                size="sm"
                                variant="danger-soft"
                                onPress={handleRemove}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                editPreview ? (
                    <div className="bg-default/50 rounded-lg py-2 px-3 flex items-center gap-4 w-full">
                        <div className="w-18 h-18 rounded-lg overflow-hidden">
                            <img src={editPreview} alt="" className="w-full h-full object-cover"/>
                        </div>

                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onPress={() => inputRef.current?.click()}
                            >
                                Изменить
                            </Button>

                            <Button
                                size="sm"
                                variant="danger-soft"
                                onPress={handleRemove}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center gap-1.5 bg-default rounded-lg p-3 cursor-pointer"
                        onClick={() => inputRef.current?.click()}
                    >
                        <ArrowShapeDownToLine className="w-5 h-5"/>

                        <div className="text-white">{button}</div>
                        <div className="text-xs">{description}</div>
                    </div>
                )
            )}

            <input
                id={label}
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                hidden
            />

            <FieldError>{error?.message}</FieldError>
        </TextField>
    );
}
