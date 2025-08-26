import {Link, NavLink} from "react-router-dom";

export default function Header() {
    return (
        <header>
            <div className="header-wrapper">
                <Link to="/" className="logo">
                    <span>S</span>
                    <span>1</span>
                </Link>

                <nav>
                    <NavLink to="/register">Регистрация</NavLink>
                    <NavLink to="/login">Вход</NavLink>
                </nav>
            </div>
        </header>
    )
}