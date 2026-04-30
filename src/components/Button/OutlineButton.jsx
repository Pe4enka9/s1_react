export default function OutlineButton({
                                          onClick,
                                          children,
                                      }) {
    return (
        <button
            type="button"
            className="text-primary border-2 border-primary hover:text-white hover:bg-primary font-medium rounded-lg p-2.5 cursor-pointer transition-all duration-300 active:scale-95 sm:w-full"
            onClick={onClick}
        >
            {children}
        </button>
    );
}
