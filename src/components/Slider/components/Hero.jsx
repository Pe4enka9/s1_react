import {useState} from "react";
import Booking from "../../Forms/Booking/Booking.jsx";

export default function Hero({slider}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <article className="relative h-full overflow-hidden rounded-xl flex items-end justify-center">
            {/* IMAGE */}
            <img
                src={slider.bg_img}
                alt={slider.name}
                loading="eager"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={(e) => {
                    // e.currentTarget.src = "/fallback-hero.jpg";
                    // setLoaded(true);
                }}
                className={`
                    absolute inset-0 size-full object-cover z-0
                    transition-all duration-700 ease-out
                    ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
                `}
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/30 to-transparent"/>

            {/* CONTENT */}
            <div
                className="relative z-20 flex flex-col items-center gap-3 sm:gap-5 pb-8 sm:pb-12 px-4 text-center max-w-2xl">
                {/* BADGE */}
                {(slider.icon || slider.icon_text) && (
                    <div
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full py-1 px-3 text-xs sm:text-sm"
                        aria-label={slider.icon_text || "Информация"}
                    >
                        {slider.icon && (
                            <img
                                src={slider.icon}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                        )}

                        {slider.icon_text && (
                            <span className="text-white font-bold uppercase tracking-wide">
                                {slider.icon_text}
                            </span>
                        )}
                    </div>
                )}

                {/* TITLE */}
                <h2 className="text-white font-bold leading-tight text-2xl sm:text-4xl lg:text-5xl">
                    {slider.name}
                </h2>

                {/* DESCRIPTION */}
                {slider.description && (
                    <p className="text-white/80 text-sm sm:text-base max-w-lg">
                        {slider.description}
                    </p>
                )}

                {/* CTA */}
                {slider.button && (
                    <div className="w-full sm:w-auto mt-1 sm:mt-2">
                        <Booking button={slider.button}/>
                    </div>
                )}
            </div>
        </article>
    );
}
