import clsx from "clsx";

export default function PrimaryButton({
                                          disabled,
                                          onClick,
                                          className = '',
                                          children,
                                      }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                'flex justify-center items-center text-white bg-secondary hover:bg-secondary/70 font-medium rounded-lg p-2.5 cursor-pointer transition-all duration-300 active:scale-95 sm:w-full disabled:bg-secondary/30 disabled:cursor-not-allowed disabled:active:scale-100',
                className,
            )}
        >
            {children}
        </button>
    );
}
