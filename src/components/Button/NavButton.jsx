export default function NavButton({
                                      onClick,
                                      children,
                                  }) {
    return (
        <button
            type="button"
            className="text-sm text-text-secondary cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-primary/20 transition-colors duration-300"
            onClick={onClick}
        >
            {children}
        </button>
    );
}
