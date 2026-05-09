import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Pagination} from "swiper/modules";
import Hero from "./components/Hero.jsx";

import "swiper/css";
import "swiper/css/pagination";

export default function Slider({sliders}) {
    return (
        <Swiper
            className="h-[70vh] sm:h-[55vh] rounded-xl mb-5"
            loop
            speed={1000}
            modules={[Autoplay, Pagination]}
            watchSlidesProgress
            preloadImages={true}
            autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            pagination={{
                el: '.swiper-pagination',
                clickable: true,
                bulletClass: "custom-bullet",
                bulletActiveClass: "active",
            }}
        >
            {sliders.map(slider => (
                <SwiperSlide key={slider.id}>
                    <Hero slider={slider}/>
                </SwiperSlide>
            ))}

            <div className="swiper-pagination horizontal"/>
        </Swiper>
    );
}
