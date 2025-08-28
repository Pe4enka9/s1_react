import {Link} from "react-router-dom";
import Navigation from "./Navigation.jsx";
import telegram from '../img/icons/telegram.svg';
import location from '../img/icons/location.svg';
import clock from '../img/icons/clock.svg';
import phone from '../img/icons/phone.svg';
import email from '../img/icons/email.svg';

export default function Footer({isActive, setIsActive}) {
    return (
        <footer>
            <div className="footer-wrapper">
                <div className="top">
                    <div>
                        <Link to="/" className="logo">
                            <span>S</span>
                            <span>1</span>
                        </Link>

                        <Navigation isActive={isActive} setIsActive={setIsActive}/>
                    </div>

                    <div>
                        <div>
                            <span>
                                <img src={location} alt="Адрес"/>
                                <p>ул. Гоночная, 15, Москва</p>
                            </span>

                            <span>
                                <img src={clock} alt="Время работы"/>
                                <p>Ежедневно: 10:00 – 22:00</p>
                            </span>
                        </div>

                        <div>
                            <a href="tel:+74951234567">
                                <img src={phone} alt="Номер телефона"/>
                                <p>+7 (495) 123-45-67</p>
                            </a>

                            <a href="mailto:info@simrace.ru">
                                <img src={email} alt="Электронная почта"/>
                                <p>info@simrace.ru</p>
                            </a>
                        </div>
                    </div>

                    <div>
                        <p>Подписывайтесь</p>

                        <div className="social">
                            <a href="https://t.me/S1racee"><img src={telegram} alt="Телеграм"/></a>
                            <a href="https://t.me/S1racee"><img src={telegram} alt="Телеграм"/></a>
                            <a href="https://t.me/S1racee"><img src={telegram} alt="Телеграм"/></a>
                            <a href="https://t.me/S1racee"><img src={telegram} alt="Телеграм"/></a>
                        </div>
                    </div>
                </div>

                <hr/>

                <div className="bottom">
                    <p>&copy; 2025 S1</p>
                    <div></div>
                    <Link to="">Политика конфиденциальности</Link>
                    <div></div>
                    <Link to="">Оферта</Link>
                </div>
            </div>
        </footer>
    )
}