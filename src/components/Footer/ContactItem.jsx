export default function ContactItem({
                                        icon,
                                        href = '',
                                        children,
                                    }) {
    return (
        href ? (
            <a href={href} className="flex items-center gap-2">
                <div className="w-5 h-5">
                    <img src={icon} alt=""/>
                </div>

                <span className="text-white">{children}</span>
            </a>
        ) : (
            <div className="flex items-center gap-2">
                <div className="w-5 h-5">
                    <img src={icon} alt=""/>
                </div>

                <span className="text-white">{children}</span>
            </div>
        )
    );
}
