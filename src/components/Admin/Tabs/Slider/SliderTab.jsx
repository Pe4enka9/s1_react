import Slider from "../../../Slider/Slider.jsx";
import { useEffect, useState } from "react";
import client from "../../../../api/client.js";
import SliderCreateForm from "./Forms/SliderCreateForm.jsx";
import "react-lazy-load-image-component/src/effects/blur.css";
import TabCard from "../Cards/TabCard.jsx";
import { Spinner } from "@heroui/react";
import SliderEditForm from "./Forms/SliderEditForm.jsx";

export default function SliderTab() {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                setLoading(true);

                const { data } = await client.get("/sliders");
                setSliders(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    const onDelete = async (id) => {
        try {
            setDeleteLoading(id);

            await client.delete(`/sliders/${id}`);

            setSliders((prev) =>
                prev.filter((slider) => slider.id !== id)
            );
        } catch (e) {
            console.log(e);
        } finally {
            setDeleteLoading(null);
        }
    };

    return (
        <section className="flex flex-col gap-5" aria-label="Управление слайдером">
            {/* PREVIEW */}
            <div>
                <h2 className="text-white font-semibold mb-3">
                    Предпросмотр слайдера
                </h2>

                {loading ? (
                    <div
                        className="flex justify-center items-center py-10"
                        role="status"
                        aria-live="polite"
                        aria-label="Загрузка слайдера"
                    >
                        <Spinner size="xl" />
                    </div>
                ) : (
                    <Slider sliders={sliders} />
                )}
            </div>

            {/* MANAGEMENT */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-semibold">
                        Слайды
                    </h3>

                    <SliderCreateForm setSliders={setSliders} />
                </div>

                {loading ? (
                    <div
                        className="flex justify-center py-6"
                        role="status"
                        aria-live="polite"
                    >
                        <Spinner />
                    </div>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {sliders.map((slider) => (
                            <li key={slider.id}>
                                <TabCard
                                    item={slider}
                                    img={slider.bg_img}
                                    onEdit={
                                        <SliderEditForm
                                            setSliders={setSliders}
                                            slider={slider}
                                        />
                                    }
                                    onDelete={() => onDelete(slider.id)}
                                    deleteLoading={deleteLoading}
                                >
                                    <div className="text-white">
                                        <div className="font-medium">
                                            {slider.name}
                                        </div>
                                        <div className="text-text-secondary text-sm">
                                            {slider.description}
                                        </div>
                                    </div>
                                </TabCard>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}