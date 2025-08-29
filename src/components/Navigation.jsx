export default function Navigation({isActive, setIsActive, registerStep, setRegisterStep, loginStep, setLoginStep}) {
    const handleClick = (e) => {
        const button = e.target;

        if (button.id === 'register-btn') {
            setIsActive({register: true, login: false});
            document.body.style.overflowY = 'hidden';
            const currentStep = registerStep > 1 ? registerStep : 1;
            const timer = setTimeout(() => setRegisterStep(currentStep), 1000);

            return () => clearTimeout(timer);
        } else {
            setIsActive({register: false, login: true});
            document.body.style.overflowY = 'hidden';
            const currentStep = loginStep > 1 ? loginStep : 1;
            const timer = setTimeout(() => setLoginStep(currentStep), 1000);

            return () => clearTimeout(timer);
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