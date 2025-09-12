import {useEffect, useState} from "react";
import axios from "axios";

export default function Navigation({isActive, setIsActive}) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const handleClick = (e) => {
        const button = e.target;

        if (button.id === 'register-btn') {
            setIsActive({register: true, login: false, booking: false});
            document.body.style.overflowY = 'hidden';
        } else {
            setIsActive({register: false, login: true, booking: false});
            document.body.style.overflowY = 'hidden';
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + '/logout',
                {},
                {
                    headers: {'Authorization': `Bearer ${token}`},
                });

            if (response.status === 204) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('storage'));
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        window.addEventListener('storage', () => {
            setToken(localStorage.getItem('token'));
        });

        return () => window.removeEventListener('storage', () => {});
    }, []);

    return (
        <nav>
            {!token ? (
                <>
                    <button
                        type="button"
                        className={isActive.register ? 'active' : ''}
                        id="register-btn"
                        onClick={handleClick}
                    >
                        Регистрация
                    </button>

                    <button
                        type="button"
                        className={isActive.login ? 'active' : ''}
                        id="login-btn"
                        onClick={handleClick}
                    >
                        Вход
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    onClick={handleLogout}
                >
                    Выход
                </button>
            )}
        </nav>
    )
}