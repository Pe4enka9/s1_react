import {useEffect, useState} from "react";
import Slide from "./Slide.jsx";
import client from "../../../api/client.js";
import {useParams} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Loader from "../../Loader.jsx";

export default function Show() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(false);

    const {id} = useParams();

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);

                const {data} = await client.get(`/menus/${id}`);
                setSlides(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    if (loading) {
        return <Loader page/>
    }

    return (
        <div className="fixed inset-0">
            <Swiper
                className="w-full h-full"
                direction="vertical"
                speed={800}
                modules={[Pagination]}
                pagination={{
                    el: '.swiper-pagination',
                    clickable: true,
                    bulletClass: 'custom-bullet',
                    bulletActiveClass: 'active',
                }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide>
                        <Slide
                            key={slide.id}
                            slide={slide}
                            number={index + 1}
                        />
                    </SwiperSlide>
                ))}

                <div className="swiper-pagination vertical"></div>
            </Swiper>
        </div>
    );
}
