import clsx from "clsx";

export default function TabItem({
                                    onClick,
                                    isActive = false,
                                    children
                                }) {
    return (
        <div
            className={clsx(
                'flex-1 rounded-lg p-2 text-center cursor-pointer transition-colors duration-300',
                isActive ? 'bg-primary' : 'hover:bg-[#3a3a3a]',
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
