import clsx from "clsx";

export default function PrimaryButton({
                                          type = 'button',
                                          disabled,
                                          onClick,
                                          className = '',
                                          children,
                                      }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                'flex justify-center items-center text-white bg-secondary hover:bg-secondary/70 font-medium rounded-lg py-2.5 px-5 cursor-pointer transition-all duration-300 active:scale-95 disabled:bg-secondary/30 disabled:cursor-not-allowed disabled:active:scale-100',
                className,
            )}
        >
            {children}
        </button>
    );
}
