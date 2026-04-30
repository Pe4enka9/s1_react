import clsx from "clsx";

export default function ProfileButton({
                                          onClick,
                                          isActive = false,
                                          children,
                                      }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={clsx(
                'text-sm font-semibold py-1.5 px-4 border rounded-lg cursor-pointer transition-colors duration-300',
                isActive
                    ? 'text-white bg-primary border-primary'
                    : 'text-text-secondary bg-[#1a1a1a] border-my-border hover:border-secondary hover:text-white',
            )}
        >
            {children}
        </button>
    );
}
