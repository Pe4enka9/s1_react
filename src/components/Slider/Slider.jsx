import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Pagination} from "swiper/modules";
import Hero from "./Hero.jsx";
import "swiper/css";
import "swiper/css/pagination";

export default function Slider({sliders}) {
    return (
        <Swiper
            className="h-[50vh] rounded-lg mb-5"
            loop={true}
            speed={800}
            autoplay={{delay: 5000}}
            modules={[Pagination, Autoplay]}
            pagination={{
                el: '.swiper-pagination',
                clickable: true,
                bulletClass: 'custom-bullet',
                bulletActiveClass: 'active',
            }}
        >
            {sliders.map(slider => (
                <SwiperSlide key={slider.id}>
                    <Hero slider={slider}/>
                </SwiperSlide>
            ))}

            <div className="swiper-pagination"></div>
        </Swiper>
    );
}
