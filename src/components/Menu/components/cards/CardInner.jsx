import {PlayFill} from "@gravity-ui/icons";

export default function CardInner({icon, title}) {
    return (
        <>
            {/* overlay */}
            <div
                className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent"
                aria-hidden="true"
            />

            <div className="relative z-10 h-full flex flex-col justify-between p-3">
                {/* icon */}
                <div
                    className="
                        w-11 h-11 rounded-xl
                        bg-white/10 backdrop-blur-md
                        border border-white/10
                        flex items-center justify-center
                    "
                    aria-hidden="true"
                >
                    <img
                        src={icon}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-6 h-6 object-contain opacity-90"
                    />
                </div>

                {/* title + action */}
                <div className="flex justify-between items-end gap-2">
                    <h3 className="text-white text-lg font-medium leading-tight">
                        {title}
                    </h3>

                    <div
                        className="
                            w-10 h-10 rounded-full
                            bg-white/10 backdrop-blur-md
                            border border-white/10
                            flex items-center justify-center
                            text-white/90
                            transition-all duration-300
                            group-hover:scale-110
                            group-hover:bg-white/20
                        "
                        aria-hidden="true"
                    >
                        <PlayFill className="w-5 h-5"/>
                    </div>
                </div>
            </div>
        </>
    );
}
