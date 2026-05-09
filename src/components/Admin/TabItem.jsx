import clsx from "clsx";

export default function TabItem({
                                    onClick,
                                    isActive = false,
                                    children,
                                    id,
                                    ariaControls,
                                    ...props
                                }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
        }
    };

    return (
        <div
            role="tab"
            id={id}
            aria-selected={isActive}
            aria-controls={ariaControls}
            tabIndex={isActive ? 0 : -1}
            className={clsx(
                'flex-1 rounded-lg p-2 text-center cursor-pointer transition-colors duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive ? 'bg-primary' : 'hover:bg-[#3a3a3a]'
            )}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            {...props}
        >
            {children}
        </div>
    );
}