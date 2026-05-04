import Slider from "../../../Slider/Slider.jsx";
import {useEffect, useState} from "react";
import client from "../../../../api/client.js";
import PrimaryButton from "../../../Button/PrimaryButton.jsx";
import Loader from "../../../Loader.jsx";
import SliderCreateForm from "./Forms/SliderCreateForm.jsx";
import SliderEditForm from "./Forms/SliderEditForm.jsx";

export default function SliderTab() {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [currentSlider, setCurrentSlider] = useState(null);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                setLoading(true);

                const {data} = await client.get('/sliders');

                setSliders(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    const openCreate = () => setIsOpenCreate(true);

    const openEdit = (slider) => {
        setCurrentSlider(slider);
        setIsOpenEdit(true);
    }

    const deleteSlider = async (id) => {
        try {
            setDeleteLoading(id);

            await client.delete(`/sliders/${id}`);

            setSliders(prev => prev.filter(slider => slider.id !== id));
        } catch (e) {
            console.log(e);
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return <Loader center/>;
    }

    return (
        <>
            <SliderCreateForm
                isOpen={isOpenCreate}
                setIsOpen={setIsOpenCreate}
                setSliders={setSliders}
            />

            <SliderEditForm
                isOpen={isOpenEdit}
                setIsOpen={setIsOpenEdit}
                setSliders={setSliders}
                slider={currentSlider}
            />

            <div className="text-white font-semibold mb-3">Предпросмотр слайдера</div>
            <Slider sliders={sliders}/>

            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="text-white font-semibold">Слайды</div>
                    <PrimaryButton onClick={openCreate}>Добавить слайд</PrimaryButton>
                </div>

                <div className="flex flex-col gap-2">
                    {sliders.map(slider => (
                        <div
                            key={slider.id}
                            className="bg-main border border-my-border rounded-lg p-4 flex items-center gap-4"
                        >
                            <img src={slider.bg_img} alt="" className="w-14 h-14 object-cover rounded-lg"/>

                            <div className="text-white">
                                <div className="font-medium">{slider.name}</div>
                                <div className="text-text-secondary text-sm">{slider.description}</div>
                            </div>

                            <div className="flex flex-1 justify-end gap-2">
                                <div
                                    className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-white/10 transition-colors duration-200"
                                    onClick={() => openEdit(slider)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>

                                <div
                                    className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-primary/20 hover:text-secondary/70 hover:border-secondary/70 transition-colors duration-200"
                                    onClick={() => deleteSlider(slider.id)}
                                >
                                    {deleteLoading === slider.id ? (
                                        <Loader center/>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path
                                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
