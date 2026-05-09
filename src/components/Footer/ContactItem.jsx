export default function ContactItem({icon, href, children}) {
    const Component = href ? "a" : "div";

    return (
        <Component
            href={href}
            className="flex items-center gap-2 text-white hover:text-white/90 transition-colors"
        >
            <span aria-hidden="true">{icon}</span>
            <span>{children}</span>
        </Component>
    );
}
