export default function MyTextarea({
                                       id,
                                       label,
                                       placeholder,
                                       error,
                                       secondaryLabel = '',
                                       ...rest
                                   }) {

    return (
        <div className="flex flex-col flex-1 gap-1.5">
            <label htmlFor={id} className="text-white font-medium flex items-center gap-1.5">
                {label}

                {secondaryLabel && (
                    <span className="text-my-border text-sm">({secondaryLabel})</span>
                )}
            </label>

            <textarea
                id={id}
                placeholder={placeholder}
                className="w-full bg-[#222] text-white border-2 border-my-border rounded-lg px-2.5 py-1.5 outline-none focus:border-secondary transition-colors duration-300"
                {...rest}
            ></textarea>

            {error && (
                <div className="text-secondary text-sm">{error.message}</div>
            )}
        </div>
    );
}
