import Logo from "./Logo.jsx";
import Nav from "./Nav.jsx";
import Contacts from "./Footer/Contacts.jsx";
import ContactItem from "./Footer/ContactItem.jsx";
import locationIcon from "../icons/location.svg";
import clockIcon from "../icons/clock.svg";
import phoneIcon from "../icons/phone.svg";
import emailIcon from "../icons/email.svg";
import telegramIcon from "../icons/telegram.svg";

export default function Footer({
                                   setIsOpenLogin,
                                   setIsOpenRegister,
                                   user,
                                   setUser,
                               }) {
    return (
        <footer className="bg-[#222] mt-5">
            <div className="container mx-auto flex flex-col gap-6 items-center pt-3 pb-5">
                <div className="container mx-auto flex justify-between items-center">
                    <Logo/>

                    <Nav
                        setIsOpenLogin={setIsOpenLogin}
                        setIsOpenRegister={setIsOpenRegister}
                        user={user}
                        setUser={setUser}
                    />
                </div>

                <Contacts>
                    <ContactItem icon={locationIcon}>
                        ул. Гоночная, 15, Москва
                    </ContactItem>

                    <ContactItem icon={clockIcon}>
                        Ежедневно: 10:00 – 22:00
                    </ContactItem>
                </Contacts>

                <Contacts>
                    <ContactItem icon={phoneIcon} href="tel:+74951234567">
                        +7 (495) 123-45-67
                    </ContactItem>

                    <ContactItem icon={emailIcon} href="mailto:info@simrace.ru">
                        info@simrace.ru
                    </ContactItem>
                </Contacts>

                <Contacts>
                    <p className="text-white">Подписывайтесь</p>

                    <div className="flex gap-3">
                        <a href="#" target="_blank" className="w-8 h-8 block">
                            <img src={telegramIcon} alt=""/>
                        </a>

                        <a href="#" target="_blank" className="w-8 h-8 block">
                            <img src={telegramIcon} alt=""/>
                        </a>

                        <a href="#" target="_blank" className="w-8 h-8 block">
                            <img src={telegramIcon} alt=""/>
                        </a>

                        <a href="#" target="_blank" className="w-8 h-8 block">
                            <img src={telegramIcon} alt=""/>
                        </a>
                    </div>
                </Contacts>

                <hr className="w-full border-primary/40"/>

                <div className="flex items-center gap-1.5">
                    <p className="text-white text-sm">&copy; 2025 S1</p>

                    <div className="bg-white w-1.5 h-1.5 rounded-full"></div>

                    <a href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                        Политика конфиденциальности
                    </a>

                    <div className="bg-white w-1.5 h-1.5 rounded-full"></div>

                    <a href="#" className="text-white/70 text-sm hover:text-white transition-colors">Оферта</a>
                </div>
            </div>
        </footer>

    );
}
