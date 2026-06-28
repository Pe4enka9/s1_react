import {Link} from "react-router-dom";

export default function Logo() {
    return (
        <Link
            to="/"
            aria-label="На главную страницу"
            className="flex items-baseline select-none"
        >
            <span className="font-bold text-3xl text-white">S</span>
            <span className="font-bold text-3xl text-primary">1</span>
        </Link>
    );
}
