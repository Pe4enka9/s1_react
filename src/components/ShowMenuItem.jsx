import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import {useEffect, useState} from "react";
import Card from "./Card.jsx";
import cardBg1 from '../img/card-bg-1.jpg';
import cardBg2 from '../img/card-bg-2.webp';
import cardBg3 from '../img/card-bg-3.jpg';
import cardBg4 from '../img/card-bg-4.jpg';
import cardBg5 from '../img/card-bg-5.webp';

export default function ShowMenuItem() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [slides, setSlides] = useState([
        {
            bgImg: cardBg1,
            title: 'АДРЕНАЛИН',
            description: 'Гул моторов — это битва сердца. Вираж — это танец на грате сцепления. Здесь нет места полутонам, только чистая скорость.',
            button: false,
        },
        {
            bgImg: cardBg2,
            title: 'ТАКТИКА',
            description: 'Не просто быстрее всех. Это шахматы на 300 км/ч. Каждый круг, каждый пит-стоп — расчетливый ход к победе.',
            button: false,
        },
        {
            bgImg: cardBg3,
            title: 'ТЕХНОЛОГИИ',
            description: 'Каждая деталь — продукт инженерной мысли. Аэродинамика, сцепление, выносливость. Мощь, которую можно приручить.',
            button: false,
        },
        {
            bgImg: cardBg4,
            title: 'ИСТОРИЯ',
            description: 'От гравийных трасс до современных автодромов. Здесь писались легенды, которые вдохновляют и сегодня.',
            button: false,
        },
        {
            bgImg: cardBg5,
            title: 'ТВОЯ ОЧЕРЕДЬ',
            description: 'Хочешь почувствовать драйв на себе? Узнай, как оказаться по ту сторону трека.',
            button: true,
        },
    ]);

    return (
        <section className="show-menu-item">
            <Swiper
                direction="vertical"
                resistance={true}
                resistanceRatio={0}
                speed={800}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide><Card bgImg={slide.bgImg} number={`0${index + 1}`} title={slide.title}
                                       description={slide.description} button={slide.button}/></SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}