export default function MyFileInput({
                                        id,
                                        label,
                                        error,
                                        preview,
                                        secondaryLabel = '',
                                        ...rest
                                    }) {
    return (
        <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1.5">
                <label htmlFor={id} className="text-white font-medium flex items-center gap-1.5">
                    {label}

                    {secondaryLabel && (
                        <span className="text-my-border text-sm">({secondaryLabel})</span>
                    )}
                </label>

                <input
                    type="file"
                    id={id}
                    className="w-full bg-[#222] text-white border-2 border-my-border rounded-lg px-2.5 py-1.5 outline-none focus:border-secondary transition-colors duration-300"
                    {...rest}
                />

                {error && (
                    <div className="text-secondary text-sm">{error.message}</div>
                )}
            </div>

            <div className="w-18 h-18 rounded-lg border border-my-border overflow-hidden">
                {preview && (
                    <img
                        src={preview}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
        </div>
    );
}

