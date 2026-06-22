import Booking from "../../Forms/Booking/Booking.jsx";
import {useState} from "react";

export default function Slide({slide, number}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <article className="relative h-full flex flex-col justify-center items-center gap-8">

            {/* IMAGE */}
            <img
                src={slide.bg_img}
                alt={slide.name}
                loading="eager"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`
                    absolute inset-0 w-full h-full object-cover
                    transition-opacity duration-700 ease-out
                    ${loaded ? "opacity-100" : "opacity-0"}
                `}
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"/>

            {/* NUMBER */}
            <div
                className="
                    w-24 h-24 flex justify-center items-center
                    font-bold text-text-secondary text-5xl
                    bg-black/50 rounded-full z-10
                "
                aria-hidden="true"
            >
                {number < 10 ? `0${number}` : number}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col items-center gap-6 z-10 p-3 text-center">
                <h2 className="text-white uppercase font-medium text-4xl font-oswald">
                    {slide.name}
                </h2>

                {slide.description && (
                    <p className="text-white/90">
                        {slide.description}
                    </p>
                )}

                {slide.button && (
                    <Booking button={slide.button}/>
                )}
            </div>
        </article>
    );
}
