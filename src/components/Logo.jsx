import {Link} from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/" className="flex">
            <span className="font-bold text-3xl text-primary">S</span>
            <span className="font-bold text-3xl text-white">1</span>
        </Link>
    );
}
