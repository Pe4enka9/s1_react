import CardInner from "./CardInner.jsx";
import {useUI} from "../../../hooks/useUI.js";
import {Link} from "react-router-dom";
import {LazyLoadImage} from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Card({menu}) {
    const {setIsOpenBooking} = useUI();

    const openBooking = () => setIsOpenBooking(true);

    return (
        menu.is_booking ? (
            <div
                className="relative p-3 rounded-lg bg-no-repeat bg-center bg-cover h-40 shadow-md shadow-black/40 overflow-hidden hover:shadow-primary/50 active:scale-95 transition-all duration-500 ease-initial cursor-pointer"
                onClick={openBooking}
            >
                <LazyLoadImage
                    src={menu.bg_img}
                    effect="blur"
                    wrapperClassName="absolute inset-0"
                    className="w-full h-full object-cover"
                />

                <CardInner
                    icon={menu.icon}
                    title={menu.name}
                />
            </div>
        ) : (
            <Link
                to={`/menus/${menu.id}`}
                className="relative p-3 rounded-lg bg-no-repeat bg-center bg-cover h-40 shadow-md shadow-black/40 overflow-hidden hover:shadow-primary/50 active:scale-95 transition-all duration-500 ease-initial cursor-pointer"
            >
                <LazyLoadImage
                    src={menu.bg_img}
                    effect="blur"
                    wrapperClassName="absolute inset-0"
                    className="w-full h-full object-cover"
                />

                <CardInner
                    icon={menu.icon}
                    title={menu.name}
                />
            </Link>
        )
    );
}
