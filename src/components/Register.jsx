import {useEffect, useRef, useState} from "react";
import {IMaskInput} from "react-imask";
import profile from '../img/icons/profile.svg';

export default function Register({isActive, setIsActive, step, setStep}) {
    const [formData, setFormData] = useState({
        phone_number: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
    });
    const [isClosing, setIsClosing] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isPasswordConfirmationHidden, setIsPasswordConfirmationHidden] = useState(true);

    const phoneInputRef = useRef(null);
    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordConfirmationInputRef = useRef(null);

    useEffect(() => {
        if (isActive.register) {
            const timer = setTimeout(() => setIsClosing(true), 1200);

            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => setIsClosing(false), 1000);

        return () => clearTimeout(timer);
    }, [isActive.register]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handlePhoneAccept = (value) => {
        setFormData({...formData, phone_number: value});
    };

    const preparePhoneValue = (appended, masked) => {
        if ((appended === '8' || appended.startsWith('8')) && masked.value === '') {
            return '' + appended.substring(1);
        }

        return appended;
    };

    const handleCancel = () => {
        document.body.style.overflowY = 'auto';
        setIsActive({register: false, login: false});
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleContinue = () => {
        if (step >= 3) return;
        setStep(prev => prev + 1);
    };

    const toggleEyePassword = () => {
        setIsPasswordHidden(prev => !prev);
    };

    const toggleEyePasswordConfirmation = () => {
        setIsPasswordConfirmationHidden(prev => !prev);
    };

    useEffect(() => {
        let startTouchY = 0;
        let endTouchY = 0;

        document.addEventListener('touchstart', (e) => {
            startTouchY = e.changedTouches[0].pageY;
        });

        document.addEventListener('touchend', (e) => {
            endTouchY = e.changedTouches[0].pageY;

            if (startTouchY < endTouchY && Math.abs(endTouchY - startTouchY) > 100) {
                handleCancel();
            }
        });
    }, []);

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        if (step === 2) {
            if (e.target.name === 'first_name') {
                lastNameInputRef.current?.focus();
            } else if (e.target.name === 'last_name') {
                passwordInputRef.current?.focus();
                handleContinue();
            }
        }

        if (step === 3) {
            if (e.target.name === 'password') {
                passwordConfirmationInputRef.current?.focus();
            } else if (e.target.name === 'password_confirmation') {
                handleSubmit(e);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (step === 3) {
            console.log('Submit!');
        }
    };

    return (
        <div id="register" className={isActive.register ? 'active' : ''}>
            <form className={`${isActive.register ? 'active' : ''} ${isClosing ? 'closing' : ''}`}
                  onSubmit={handleSubmit}>
                <div className={`steps-progress step-${step}`}>
                    <div className="steps-name">
                        <p className="small">Контакт</p>
                        <p className="small">Личные данные</p>
                        <p className="small">Пароль</p>
                    </div>

                    <div className="steps-progress-bar"></div>
                </div>

                <div className="title">
                    <div className="icon">
                        <img src={profile} alt="Создание аккаунта"/>
                    </div>

                    <h4>Создать аккаунт</h4>
                </div>

                <div className={`step ${step === 1 ? 'current' : 'prev'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="phone_number">Номер телефона</label>
                            <IMaskInput
                                mask="+{7} (000) 000-00-00"
                                type="tel"
                                inputMode="tel"
                                name="phone_number"
                                id="phone_number"
                                placeholder="+7 (000) 000-00-00"
                                value={formData.phone_number}
                                onAccept={handlePhoneAccept}
                                prepare={preparePhoneValue}
                                autoComplete="tel phone"
                                enterKeyHint="next"
                                inputRef={phoneInputRef}
                                onBlur={() => {
                                    firstNameInputRef.current?.focus();
                                    handleContinue();
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className={`step ${step === 2 ? 'current' : step === 3 ? 'prev' : 'next'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="first_name">Имя</label>
                            <input
                                type="text"
                                inputMode="text"
                                name="first_name"
                                id="first_name"
                                placeholder="Введите ваше имя"
                                autoComplete="given-name"
                                value={formData.first_name}
                                onChange={handleChange}
                                enterKeyHint="next"
                                onKeyDown={handleKeyDown}
                                ref={firstNameInputRef}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="last_name">Фамилия</label>
                            <input
                                type="text"
                                inputMode="text"
                                name="last_name"
                                id="last_name"
                                placeholder="Введите вашу фамилию"
                                autoComplete="family-name"
                                value={formData.last_name}
                                onChange={handleChange}
                                enterKeyHint="next"
                                onKeyDown={handleKeyDown}
                                ref={lastNameInputRef}
                            />
                        </div>
                    </div>
                </div>

                <div className={`step ${step === 3 ? 'current' : 'next'}`}>
                    <div>
                        <div className="field">
                            <label htmlFor="password">Пароль</label>
                            <input
                                type={isPasswordHidden ? "password" : "text"}
                                inputMode="text"
                                name="password"
                                id="password"
                                placeholder="Введите пароль"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                enterKeyHint="next"
                                onKeyDown={handleKeyDown}
                                ref={passwordInputRef}
                            />
                            <div className={`eye-password ${isPasswordHidden ? 'hidden' : 'visible'}`}
                                 onClick={toggleEyePassword}></div>
                        </div>

                        <div className="field">
                            <label htmlFor="password_confirmation">Повтор пароля</label>
                            <input
                                type={isPasswordConfirmationHidden ? "password" : "text"}
                                inputMode="text"
                                name="password_confirmation"
                                id="password_confirmation"
                                placeholder="Повторите пароль"
                                autoComplete="new-password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                enterKeyHint="done"
                                onKeyDown={handleKeyDown}
                                ref={passwordConfirmationInputRef}
                            />
                            <div className={`eye-password ${isPasswordConfirmationHidden ? 'hidden' : 'visible'}`}
                                 onClick={toggleEyePasswordConfirmation}></div>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button type="submit" className="btn"
                            onClick={handleContinue}>{step === 3 ? 'Зарегистрироваться' : 'Продолжить'}</button>
                    <button type="button" className="btn cancel"
                            onClick={step === 1 ? handleCancel : handleBack}>{step === 1 ? 'Отмена' : 'Назад'}</button>
                </div>
            </form>
        </div>
    )
}