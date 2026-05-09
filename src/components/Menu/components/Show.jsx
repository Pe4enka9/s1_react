import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";
import {Spinner} from "@heroui/react";

import Slide from "./Slide.jsx";
import client from "../../../api/client.js";

import "swiper/css";
import "swiper/css/pagination";

export default function Show() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {id} = useParams();

    useEffect(() => {
        let mounted = true;

        const fetchSlides = async () => {
            try {
                setLoading(true);
                setError(null);

                const {data} = await client.get(`/menus/${id}`);

                if (mounted) setSlides(data);
            } catch (e) {
                console.error(e);
                if (mounted) setError("Ошибка загрузки");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchSlides();

        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="xl"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                {error}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-10">
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
                watchSlidesProgress
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <Slide
                            slide={slide}
                            number={index + 1}
                        />
                    </SwiperSlide>
                ))}

                <div className="swiper-pagination vertical"/>
            </Swiper>
        </div>
    );
}
