import {useEffect, useState} from "react";
import client from "../../../../api/api.js";
import SlideCreateForm from "./Forms/SlideCreateForm.jsx";
import {Controller, useForm, useWatch} from "react-hook-form";
import 'react-lazy-load-image-component/src/effects/blur.css';
import TabCard from "../Cards/TabCard.jsx";
import {Form, Label, ListBox, Select, Spinner, TextField} from "@heroui/react";
import SlideEditForm from "./Forms/SlideEditForm.jsx";

export default function SlideTab() {
    const [slides, setSlides] = useState([]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const {control} = useForm();
    const menuId = useWatch({
        control,
        name: 'menu',
        defaultValue: '',
    });

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);

                const {data} = await client.get(`/slides`, {
                    params: {menu: menuId},
                });

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
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="xl"/>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="text-white font-semibold">Слайды меню</div>
                    <SlideCreateForm setSlides={setSlides} menus={menus}/>
                </div>

                <Form>
                    <Controller
                        control={control}
                        name="menu"
                        defaultValue=""
                        render={({field}) => (
                            <TextField>
                                <Label>Фильтр по меню</Label>

                                <Select
                                    className="w-96"
                                    {...field}
                                >
                                    <Select.Trigger>
                                        <Select.Value/>
                                        <Select.Indicator/>
                                    </Select.Trigger>

                                    <Select.Popover>
                                        <ListBox>
                                            <ListBox.Item id="" textValue="Все">
                                                Все
                                                <ListBox.ItemIndicator/>
                                            </ListBox.Item>
                                            {menus.map(menu => (
                                                <ListBox.Item key={menu.id} id={menu.id} textValue={menu.name}>
                                                    {menu.name}
                                                    <ListBox.ItemIndicator/>
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </TextField>
                        )}
                    />
                </Form>

                <div className="flex flex-col gap-2">
                    {slides.map(slide => (
                        <TabCard
                            key={slide.id}
                            item={slide}
                            img={slide.bg_img}
                            onEdit={<SlideEditForm setSlides={setSlides} slide={slide} menus={menus}/>}
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
