export default function MyCheckbox({
                                       id,
                                       label,
                                       ...rest
                                   }) {
    return (
        <div className="flex gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    id={id}
                    type="checkbox"
                    className="sr-only peer"
                    {...rest}
                />

                <div
                    className="group peer bg-main rounded-full duration-300 w-12 h-6 ring-2 ring-my-border after:duration-300 after:bg-white peer-checked:after:bg-white peer-checked:ring-secondary after:rounded-full after:absolute after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95"
                ></div>
            </label>

            <div className="text-white font-medium flex items-center gap-1.5">{label}</div>
        </div>
    );
}
