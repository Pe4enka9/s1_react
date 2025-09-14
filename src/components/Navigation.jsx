import {useEffect, useState} from "react";
import axios from "axios";

export default function Navigation({isActive, setIsActive, setNotification}) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const handleClick = (e) => {
        const button = e.target;

        if (button.id === 'register-btn') {
            setIsActive({register: true, login: false, booking: false});
        } else {
            setIsActive({register: false, login: true, booking: false});
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
                setNotification(prev => ({...prev, text: 'Вы вышли!', active: true}));

                setTimeout(() =>
                        setNotification(prev => ({...prev, active: false})),
                    2000
                );

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('storage'));
            }
        } catch (err) {
            console.log(err);

            setNotification({text: 'Не удалось выйти', failed: true, active: true});

            setTimeout(() =>
                    setNotification(prev => ({...prev, active: false})),
                2000
            );
        }
    };

    useEffect(() => {
        window.addEventListener('storage', () => {
            setToken(localStorage.getItem('token'));
        });

        return () => window.removeEventListener('storage', () => {
        });
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