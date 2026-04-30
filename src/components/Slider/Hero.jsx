import CTAButton from "../Button/CTAButton.jsx";
import {useUI} from "../../hooks/useUI.js";

export default function Hero({slider}) {
    const {setIsOpenBooking} = useUI();

    const openBooking = () => setIsOpenBooking(true);

    return (
        <div
            className="relative pb-12 h-full"
            style={{background: `#2f2f2f url(${slider.bg_img}) no-repeat center / cover`}}
        >
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>

            <div className="relative z-10 flex flex-col justify-end items-center gap-5 h-full">
                {(slider.icon || slider.icon_text) && (
                    <div className="flex items-center gap-2 bg-secondary rounded-full py-1 px-2">
                        {slider.icon && (
                            <div className="w-5 h-5">
                                <img src={slider.icon} alt=""/>
                            </div>
                        )}

                        {slider.icon_text && (
                            <span className="text-white font-bold uppercase">{slider.icon_text}</span>
                        )}
                    </div>
                )}

                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-white font-bold text-4xl">{slider.name}</h2>

                    {slider.description && (
                        <p className="text-white">{slider.description}</p>
                    )}
                </div>

                {slider.button && (
                    <CTAButton onClick={openBooking}>
                        {slider.button}
                    </CTAButton>
                )}
            </div>
        </div>
    );
}
