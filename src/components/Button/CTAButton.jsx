export default function CTAButton({
                                      onClick,
                                      children,
                                  }) {
    return (
        <button
            type="button"
            className="text-white bg-primary font-medium rounded-2xl text-xl py-2.5 px-4 cursor-pointer shadow-sm shadow-primary/70 hover:shadow-md transition-shadow duration-300"
            onClick={onClick}
        >
            {children}
        </button>
    );
}
