import {NavLink} from "react-router-dom";

export default function Navigation() {
    return (
        <nav>
            <NavLink to="/register">Регистрация</NavLink>
            <NavLink to="/login">Вход</NavLink>
        </nav>
    )
}