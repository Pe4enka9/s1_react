import playIcon from "../../../icons/play.svg";

export default function CardInner({
                                      icon,
                                      title,
                                  }) {
    return (
        <>
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>

            <div className="relative h-full flex flex-col justify-between">
                <div className="w-9 h-9 bg-black/30 rounded-lg p-1">
                    <img src={icon} alt=""/>
                </div>

                <div className="flex justify-end items-center gap-2">
                    <h3 className="text-white text-xl font-medium">{title}</h3>

                    <button type="button" className="w-7 h-7 bg-secondary rounded-md p-1.5">
                        <img src={playIcon} alt=""/>
                    </button>
                </div>
            </div>
        </>
    );
}
