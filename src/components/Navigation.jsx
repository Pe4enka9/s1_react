export default function Navigation({isActive, setIsActive, step, setStep}) {
    const handleClick = (e) => {
        const button = e.target;

        if (button.id === 'register-btn') {
            setIsActive({register: true, login: false});
            document.body.style.overflowY = 'hidden';
            const currentStep = step > 1 ? step : 1;
            const timer = setTimeout(() => setStep(currentStep), 1000);

            return () => clearTimeout(timer);
        } else {
            setIsActive({register: false, login: true});
            document.body.style.overflowY = 'hidden';
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