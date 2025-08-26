import {Link} from "react-router-dom";
import Navigation from "./Navigation.jsx";
import telegram from '../img/icons/telegram.svg';

export default function Footer() {
    return (
        <footer>
            <div className="footer-wrapper">
                <div className="top">
                    <div>
                        <Link to="/" className="logo">
                            <span>S</span>
                            <span>1</span>
                        </Link>

                        <Navigation/>
                    </div>

                    <div>
                        <p>ул. Гоночная, 15, Москва</p>
                        <a href="tel:+74951234567">+7 (495) 123-45-67</a>
                        <a href="mailto:info@simrace.ru">info@simrace.ru</a>
                        <p>Ежедневно: 10:00 – 22:00</p>
                    </div>

                    <div>
                        <p>Подписывайтесь</p>

                        <div className="icons">
                            <img src={telegram} alt="Телеграм"/>
                            <img src={telegram} alt="Телеграм"/>
                            <img src={telegram} alt="Телеграм"/>
                            <img src={telegram} alt="Телеграм"/>
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