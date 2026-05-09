import Logo from "./Logo.jsx";
import Nav from "./Nav.jsx";
import Contacts from "./Footer/Contacts.jsx";
import ContactItem from "./Footer/ContactItem.jsx";

import {Clock, Envelope, Handset, LogoTelegram, MapPin,} from "@gravity-ui/icons";

export default function Footer() {
    return (
        <footer className="bg-[#222] mt-5" role="contentinfo">
            <div className="container mx-auto flex flex-col gap-6 items-center pt-3 pb-5 px-3 sm:px-0">

                {/* TOP */}
                <div className="w-full flex justify-between items-center">
                    <Logo/>
                    <Nav/>
                </div>

                {/* CONTACTS */}
                <address className="not-italic w-full flex flex-col gap-6 items-center">
                    <Contacts>
                        <ContactItem icon={<MapPin/>}>
                            ул. Гоночная, 15, Москва
                        </ContactItem>

                        <ContactItem icon={<Clock/>}>
                            Ежедневно: 10:00 – 22:00
                        </ContactItem>
                    </Contacts>

                    <Contacts>
                        <ContactItem icon={<Handset/>} href="tel:+74951234567">
                            +7 (495) 123-45-67
                        </ContactItem>

                        <ContactItem icon={<Envelope/>} href="mailto:info@simrace.ru">
                            info@simrace.ru
                        </ContactItem>
                    </Contacts>
                </address>

                {/* SOCIALS */}
                <section aria-label="Социальные сети" className="flex flex-col items-center gap-2">
                    <p className="text-white">Подписывайтесь</p>

                    <div className="flex gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <a
                                key={i}
                                href="https://telegram.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Telegram"
                                className="
                                    w-10 h-10 flex justify-center items-center
                                    bg-default border border-my-border
                                    rounded-full
                                    transition-colors hover:bg-white/10
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                                "
                            >
                                <LogoTelegram className="w-6 h-6"/>
                            </a>
                        ))}
                    </div>
                </section>

                {/* DIVIDER */}
                <hr className="w-full border-primary/40"/>

                {/* BOTTOM */}
                <div className="flex flex-col items-center gap-1.5 sm:flex-row">
                    <p className="text-white text-sm">&copy; 2025 S1</p>

                    <span className="hidden sm:block text-white/40">•</span>

                    <a
                        href="#"
                        className="text-white/70 text-sm hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                    >
                        Политика конфиденциальности
                    </a>

                    <span className="hidden sm:block text-white/40">•</span>

                    <a
                        href="#"
                        className="text-white/70 text-sm hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                    >
                        Оферта
                    </a>
                </div>
            </div>
        </footer>
    );
}
