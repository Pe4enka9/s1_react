export default function Navigation({isActive, setIsActive, setStep}) {
    const handleClick = (e) => {
        const button = e.target;

        if (button.id === 'register-btn') {
            setIsActive({register: true, login: false});

            const timer = setTimeout(() => setStep(1), 1000);

            return () => clearTimeout(timer);
        } else {
            setIsActive({register: false, login: true});
        }
    };

    return (
        <nav>
            <button type="button" className={isActive.register ? 'active' : ''} id="register-btn"
                    onClick={handleClick}>Регистрация
            </button>
            <button type="button" className={isActive.login ? 'active' : ''} id="login-btn" onClick={handleClick}>Вход
            </button>
        </nav>
    )
}