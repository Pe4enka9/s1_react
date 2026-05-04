import PrimaryButton from "../../../Button/PrimaryButton.jsx";
import Loader from "../../../Loader.jsx";
import {useEffect, useState} from "react";
import client from "../../../../api/client.js";
import BookingStatus from "../../../User/Profile/BookingStatus.jsx";
import MenuCreateForm from "./Forms/MenuCreateForm.jsx";
import MenuEditForm from "./Forms/MenuEditForm.jsx";

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

    const deleteMenu = async (id) => {
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
                        <div
                            key={menu.id}
                            className="bg-main border border-my-border rounded-lg p-4 flex items-center gap-4"
                        >
                            <img src={menu.bg_img} alt="" className="w-14 h-14 object-cover rounded-lg"/>

                            <div className="text-white flex items-center gap-3">
                                <img
                                    src={menu.icon}
                                    alt=""
                                    className="w-10 h-10 border border-my-border rounded-lg p-1"
                                />

                                <div className="font-medium">{menu.name}</div>

                                {menu.is_booking && (
                                    <BookingStatus status="success">Форма бронирования</BookingStatus>
                                )}
                            </div>

                            <div className="flex flex-1 justify-end gap-2">
                                <div
                                    className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-white/10 transition-colors duration-200"
                                    onClick={() => openEdit(menu)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>

                                <div
                                    className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-primary/20 hover:text-secondary/70 hover:border-secondary/70 transition-colors duration-200"
                                    onClick={() => deleteMenu(menu.id)}
                                >
                                    {deleteLoading === menu.id ? (
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
