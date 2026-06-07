import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Spinner, toast} from "@heroui/react";
import api from "../api/api.js";
import {UserContext} from "../context/UserContext.js";
import NavButton from "./Button/NavButton.jsx";
import Register from "./Forms/Auth/Register.jsx";
import Login from "./Forms/Auth/Login.jsx";

export default function Nav() {
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const [loading, setLoading] = useState(false);

    const toProfile = () => navigate("/profile");
    const toAdminPanel = () => navigate("/admin");

    const logout = async () => {
        if (loading) return;

        try {
            setLoading(true);

            await api.post("/logout");
            setUser(null);

            toast.success("Вы успешно вышли");
        } catch {
            toast.danger("Не удалось выйти", {
                description: "Попробуйте позже",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav
            className="flex items-center gap-2"
            aria-label="Основная навигация"
        >
            {user ? (
                <>
                    <NavButton
                        onClick={user.is_admin ? toAdminPanel : toProfile}
                    >
                        {user.is_admin ? "Админ панель" : "Профиль"}
                    </NavButton>

                    <NavButton
                        onClick={logout}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Spinner size="sm"/>
                                Выход...
                            </span>
                        ) : (
                            "Выход"
                        )}
                    </NavButton>
                </>
            ) : (
                <>
                    <Register/>
                    <Login/>
                </>
            )}
        </nav>
    );
}
