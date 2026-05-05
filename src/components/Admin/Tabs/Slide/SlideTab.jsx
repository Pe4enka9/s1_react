import PrimaryButton from "../../../Button/PrimaryButton.jsx";
import Loader from "../../../Loader.jsx";
import {useEffect, useState} from "react";
import client from "../../../../api/client.js";
import SlideCreateForm from "./Forms/SlideCreateForm.jsx";
import SlideEditForm from "./Forms/SlideEditForm.jsx";
import MySelect from "../../../Input/MySelect.jsx";
import {useForm, useWatch} from "react-hook-form";
import 'react-lazy-load-image-component/src/effects/blur.css';
import TabCard from "../Cards/TabCard.jsx";

export default function SlideTab() {
    const [slides, setSlides] = useState([]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null);

    const {register, control} = useForm();
    const menuId = useWatch({
        control,
        name: 'menu',
        defaultValue: '',
    });

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();

                if (menuId) {
                    params.append('menu', menuId);
                }

                const {data} = await client.get(`/slides?${params.toString()}`);

                setSlides(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, [menuId]);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const {data} = await client.get('/menus');

                setMenus(data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchMenus();
    }, []);

    const openCreate = () => setIsOpenCreate(true);

    const openEdit = (menu) => {
        setCurrentSlide(menu);
        setIsOpenEdit(true);
    }

    const onDelete = async (id) => {
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
                menus={menus}
            />

            <SlideEditForm
                isOpen={isOpenEdit}
                setIsOpen={setIsOpenEdit}
                setSlides={setSlides}
                slide={currentSlide}
                menus={menus}
            />

            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="text-white font-semibold">Слайды меню</div>
                    <PrimaryButton onClick={openCreate}>Добавить слайд</PrimaryButton>
                </div>

                <form>
                    <MySelect
                        id="filter-menu"
                        label="Фильтр по меню"
                        className="w-fit"
                        {...register('menu')}
                    >
                        <option value="">Все</option>

                        {menus.map(menu => (
                            !menu.is_booking &&
                            <option key={menu.id} value={menu.id}>{menu.name}</option>
                        ))}
                    </MySelect>
                </form>

                <div className="flex flex-col gap-2">
                    {slides.map(slide => (
                        <TabCard
                            key={slide.id}
                            item={slide}
                            img={slide.bg_img}
                            onEdit={() => openEdit(slide)}
                            onDelete={() => onDelete(slide.id)}
                            deleteLoading={deleteLoading}
                        >
                            <div className="text-white">
                                <div className="font-medium">{slide.name}</div>

                                <div className="text-text-secondary text-sm flex items-center gap-1.5">
                                    <div>{slide.menu.name}</div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                    <div>{slide.description}</div>
                                </div>
                            </div>
                        </TabCard>
                    ))}
                </div>
            </div>
        </>
    );
}
