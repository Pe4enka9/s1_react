import PrimaryButton from "../../../Button/PrimaryButton.jsx";
import Loader from "../../../Loader.jsx";
import {useEffect, useState} from "react";
import client from "../../../../api/client.js";
import SlideCreateForm from "./Forms/SlideCreateForm.jsx";
import SlideEditForm from "./Forms/SlideEditForm.jsx";

export default function SlideTab() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);

                const {data} = await client.get('/slides');

                setSlides(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    const openCreate = () => setIsOpenCreate(true);

    const openEdit = (menu) => {
        setCurrentSlide(menu);
        setIsOpenEdit(true);
    }

    const deleteSlide = async (id) => {
        try {
            setDeleteLoading(id);

            await client.delete(`/slides/${id}`);

            setSlides(prev => prev.filter(slide => slide.id !== id));
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
            <SlideCreateForm
                isOpen={isOpenCreate}
                setIsOpen={setIsOpenCreate}
                setSlides={setSlides}
            />

            <SlideEditForm
                isOpen={isOpenEdit}
                setIsOpen={setIsOpenEdit}
                setSlides={setSlides}
                slide={currentSlide}
            />

            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="text-white font-semibold">Слайды меню</div>
                    <PrimaryButton onClick={openCreate}>Добавить слайд</PrimaryButton>
                </div>

                <div className="flex flex-col gap-2">
                    {slides.map(slide => (
                        <div
                            key={slide.id}
                            className="bg-main border border-my-border rounded-lg p-4 flex items-center gap-4"
                        >
                            <img src={slide.bg_img} alt="" className="w-14 h-14 object-cover rounded-lg"/>

                            <div className="text-white">
                                <div className="font-medium">{slide.name}</div>

                                <div className="text-text-secondary text-sm flex items-center gap-1.5">
                                    <div>{slide.menu.name}</div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                    <div>{slide.description}</div>
                                </div>
                            </div>

                            <div className="flex flex-1 justify-end gap-2">
                                <div
                                    className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-white/10 transition-colors duration-200"
                                    onClick={() => openEdit(slide)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>

                                <div
                                    className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-primary/20 hover:text-secondary/70 hover:border-secondary/70 transition-colors duration-200"
                                    onClick={() => deleteSlide(slide.id)}
                                >
                                    {deleteLoading === slide.id ? (
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
