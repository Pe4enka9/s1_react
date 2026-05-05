import PrimaryButton from "../../../Button/PrimaryButton.jsx";
import Loader from "../../../Loader.jsx";
import {useEffect, useState} from "react";
import client from "../../../../api/client.js";
import Status from "../../../Status.jsx";
import MenuCreateForm from "./Forms/MenuCreateForm.jsx";
import MenuEditForm from "./Forms/MenuEditForm.jsx";
import 'react-lazy-load-image-component/src/effects/blur.css';
import TabCard from "../Cards/TabCard.jsx";

export default function MenuTab() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);

                const {data} = await client.get('/menus');

                setMenus(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const openCreate = () => setIsOpenCreate(true);

    const openEdit = (menu) => {
        setCurrentMenu(menu);
        setIsOpenEdit(true);
    }

    const onDelete = async (id) => {
        try {
            setDeleteLoading(id);

            await client.delete(`/menus/${id}`);

            setMenus(prev => prev.filter(menu => menu.id !== id));
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
            <MenuCreateForm
                isOpen={isOpenCreate}
                setIsOpen={setIsOpenCreate}
                setMenus={setMenus}
            />

            <MenuEditForm
                isOpen={isOpenEdit}
                setIsOpen={setIsOpenEdit}
                setMenus={setMenus}
                menu={currentMenu}
            />

            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="text-white font-semibold">Пункты меню</div>
                    <PrimaryButton onClick={openCreate}>Добавить пункт</PrimaryButton>
                </div>

                <div className="flex flex-col gap-2">
                    {menus.map(menu => (
                        <TabCard
                            key={menu.id}
                            item={menu}
                            img={menu.bg_img}
                            onEdit={() => openEdit(menu)}
                            onDelete={() => onDelete(menu.id)}
                            deleteLoading={deleteLoading}
                        >
                            <div className="text-white flex items-center gap-3">
                                <img
                                    src={menu.icon}
                                    alt=""
                                    className="w-10 h-10 border border-my-border rounded-lg p-1"
                                />

                                <div className="font-medium">{menu.name}</div>

                                {menu.is_booking && (
                                    <Status status="success">Форма бронирования</Status>
                                )}
                            </div>
                        </TabCard>
                    ))}
                </div>
            </div>
        </>
    );
}
