import clsx from "clsx";

export default function MySelect({
                                     id,
                                     label,
                                     error,
                                     secondaryLabel = '',
                                     className = '',
                                     children,
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

            <select
                id={id}
                className={clsx(
                    'bg-[#222] text-white border-2 border-my-border rounded-lg px-2.5 py-1.5 outline-none focus:border-secondary transition-colors duration-300',
                    className,
                )}
                {...rest}
            >
                {children}
            </select>

            {error && (
                <div className="text-secondary text-sm">{error.message}</div>
            )}
        </div>
    );
}
