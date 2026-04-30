export default function BorderButton({
                                         onClick,
                                         children,
                                     }) {
    return (
        <button
            type="button"
            className="text-white bg-transparent border border-my-border hover:bg-my-border/50 font-medium rounded-lg p-2.5 cursor-pointer transition-all duration-300 active:scale-95 sm:w-full"
            onClick={onClick}
        >
            {children}
        </button>
    );
}
