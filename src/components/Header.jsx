import {Link} from "react-router-dom";
import Navigation from "./Navigation.jsx";

export default function Header() {
    return (
        <header>
            <div className="header-wrapper">
                <Link to="/" className="logo">
                    <span>S</span>
                    <span>1</span>
                </Link>

                <Navigation/>
            </div>
        </header>
    )
}