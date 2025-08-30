import MenuItem from "./MenuItem.jsx";
import raceTrack from '../img/icons/race-track.svg';
import raceCar from '../img/icons/race-car.svg';
import wheel from '../img/icons/wheel.svg';
import news from '../img/icons/news.svg';
import game from '../img/icons/game.svg';
import calendar from '../img/icons/calendar.svg';
import menuBg1 from '../img/menu-bg-1.webp';
import menuBg2 from '../img/menu-bg-2.webp';
import menuBg3 from '../img/menu-bg-3.jpg';
import menuBg4 from '../img/menu-bg-4.jpg';
import menuBg5 from '../img/menu-bg-5.jpg';
import menuBg6 from '../img/menu-bg-6.jpg';
import banner from '../img/banner.jpg';
/** @type {string} */
import fire from '../img/icons/fire.svg';
import Banner from "./Banner.jsx";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Pagination} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-creative';

export default function Home({isActive, setIsActive, bookingStep, setBookingStep}) {
    return (
        <>
            <div style={{width: '100vw'}}>
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{
                        clickable: true,
                        bulletClass: 'custom-pagination',
                        bulletActiveClass: 'active',
                    }}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        waitForTransition: true,
                    }}
                    speed={800}
                >
                    <SwiperSlide><Banner bgImg={banner} icon={fire} iconText="Акция" title="Скидка 30%"
                                         description="На все симуляторы до воскресенья"/></SwiperSlide>
                    <SwiperSlide><Banner bgImg={menuBg1} icon={fire} iconText="Акция" title="Скидка 20%"
                                         description="На все симуляторы до воскресенья"/></SwiperSlide>
                    <SwiperSlide><Banner bgImg={menuBg2} icon={fire} iconText="Акция" title="Скидка 10%"
                                         description="На все симуляторы до воскресенья"/></SwiperSlide>
                </Swiper>
            </div>

            <section className="menu-wrapper">
                <MenuItem img={raceTrack} title="Кольцевые гонки" bgImg={menuBg1}/>
                <MenuItem img={raceCar} title="F1 гонки" bgImg={menuBg2}/>
                <MenuItem img={wheel} title="Дрифт" bgImg={menuBg3}/>
                <MenuItem img={news} title="Шокирующие события" bgImg={menuBg4}/>
                <MenuItem img={game} title="Sim Racing" bgImg={menuBg5}/>
                <MenuItem
                    img={calendar}
                    title="Запись в клубе"
                    bgImg={menuBg6}
                    isActiveForm={isActive}
                    setIsActiveForm={setIsActive}
                    bookingStep={bookingStep}
                    setBookingStep={setBookingStep}
                    booking
                />
            </section>
        </>
    )
}