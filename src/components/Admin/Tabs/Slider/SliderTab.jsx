import Slider from "../../../Slider/Slider.jsx";
import {useEffect, useState} from "react";
import client from "../../../../api/client.js";
import PrimaryButton from "../../../Button/PrimaryButton.jsx";
import Loader from "../../../Loader.jsx";
import SliderCreateForm from "./Forms/SliderCreateForm.jsx";
import SliderEditForm from "./Forms/SliderEditForm.jsx";
import 'react-lazy-load-image-component/src/effects/blur.css';
import TabCard from "../Cards/TabCard.jsx";

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

    const onDelete = async (id) => {
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
                        <TabCard
                            key={slider.id}
                            item={slider}
                            img={slider.bg_img}
                            onEdit={() => openEdit(slider)}
                            onDelete={() => onDelete(slider.id)}
                            deleteLoading={deleteLoading}
                        >
                            <div className="text-white">
                                <div className="font-medium">{slider.name}</div>
                                <div className="text-text-secondary text-sm">{slider.description}</div>
                            </div>
                        </TabCard>
                    ))}
                </div>
            </div>
        </>
    );
}
