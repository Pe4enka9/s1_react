import CardInner from "./CardInner.jsx";
import {useUI} from "../../../hooks/useUI.js";
import {Link} from "react-router-dom";

export default function Card({menu}) {
    const {setIsOpenBooking} = useUI();

    const openBooking = () => setIsOpenBooking(true);

    return (
        menu.is_booking ? (
            <div
                className="relative p-3 rounded-lg bg-no-repeat bg-center bg-cover h-40 shadow-md shadow-black/40 overflow-hidden hover:shadow-primary/50 active:scale-95 transition-all duration-500 ease-initial cursor-pointer"
                style={{backgroundImage: `url(${menu.bg_img})`}}
                onClick={openBooking}
            >
                <CardInner
                    icon={menu.icon}
                    title={menu.name}
                />
            </div>
        ) : (
            <Link
                to={`/menus/${menu.id}`}
                className="relative p-3 rounded-lg bg-no-repeat bg-center bg-cover h-40 shadow-md shadow-black/40 overflow-hidden hover:shadow-primary/50 active:scale-95 transition-all duration-500 ease-initial cursor-pointer"
                style={{backgroundImage: `url(${menu.bg_img})`}}
            >
                <CardInner
                    icon={menu.icon}
                    title={menu.name}
                />
            </Link>
        )
    );
}
