import CTAButton from "../../Button/CTAButton.jsx";
import {useUI} from "../../../hooks/useUI.js";

export default function Slide({slide, number}) {
    const {setIsOpenBooking} = useUI();

    const openBooking = () => setIsOpenBooking(true);

    return (
        <div className="relative h-full flex flex-col justify-center items-center gap-8">
            <div
                className="absolute inset-0"
                style={{background: `linear-gradient(rgba(0, 0 , 0, .3), rgba(0, 0, 0, .3)), #2f2f2f url('${slide.bg_img}') no-repeat center / cover`}}
            ></div>

            <div
                className="w-24 h-24 flex justify-center items-center font-bold text-text-secondary text-5xl bg-black/50 rounded-full z-10"
            >
                {number < 10 ? `0${number}` : number}
            </div>

            <div className="flex flex-col items-center gap-6 z-10 p-3">
                <h2 className="text-white uppercase font-medium text-4xl font-oswald">{slide.name}</h2>
                <p className="text-white text-center">{slide.description}</p>

                {slide.button && (
                    <CTAButton onClick={openBooking}>
                        {slide.button}
                    </CTAButton>
                )}
            </div>
        </div>
    );
}
