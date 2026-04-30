import NavButton from "./Button/NavButton.jsx";
import client from "../api/client.js";
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext.js";
import {useUI} from "../hooks/useUI.js";
import {useNavigate} from "react-router-dom";
import Loader from "./Loader.jsx";

export default function Nav() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {user, setUser} = useContext(UserContext);
    const {setIsOpenLogin, setIsOpenRegister} = useUI();

    const openLogin = () => setIsOpenLogin(true);
    const openRegister = () => setIsOpenRegister(true);

    const toProfile = () => navigate('/profile');

    const logout = async () => {
        try {
            setLoading(true);

            await client.post('/logout');
            setUser(null);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="flex items-center gap-2">
            {user ? (
                <>
                    <NavButton onClick={toProfile}>Профиль</NavButton>

                    {loading ? (
                        <Loader/>
                    ) : (
                        <NavButton onClick={logout}>Выход</NavButton>
                    )}
                </>
            ) : (
                <>
                    <NavButton onClick={openRegister}>Регистрация</NavButton>
                    <NavButton onClick={openLogin}>Вход</NavButton>
                </>
            )}
        </nav>
    );
}
