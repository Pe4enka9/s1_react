import {useState} from "react";
import {Link} from "react-router-dom";
import {Skeleton} from "@heroui/react";
import CardInner from "./CardInner.jsx";

export default function MenuCard({menu}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <article>
            <Link
                to={`/menus/${menu.id}`}
                aria-label={`Открыть меню: ${menu.name}`}
                className="
                    group block relative h-44 rounded-xl overflow-hidden
                    shadow-md shadow-black/30
                    transition-all duration-300
                    hover:shadow-primary/40
                    active:scale-[0.98]
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-primary
                    focus-visible:ring-offset-2 focus-visible:ring-offset-background
                "
            >
                {/* Skeleton */}
                {!loaded && (
                    <Skeleton className="absolute inset-0 rounded-xl"/>
                )}

                {/* Background image */}
                <img
                    src={menu.bg_img}
                    alt={menu.name}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={(e) => {
                        // e.currentTarget.src = "/fallback-menu.jpg";
                        // setLoaded(true);
                    }}
                    className={`
                        absolute inset-0 size-full object-cover
                        scale-105 group-hover:scale-110
                        transition-all duration-700 ease-out
                        ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"}
                    `}
                />

                <CardInner icon={menu.icon} title={menu.name}/>
            </Link>
        </article>
    );
}
