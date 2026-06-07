import { useEffect, useState } from "react";
import client from "../../../../api/api.js";
import MenuCreateForm from "./Forms/MenuCreateForm.jsx";
import "react-lazy-load-image-component/src/effects/blur.css";
import TabCard from "../Cards/TabCard.jsx";
import { Spinner } from "@heroui/react";
import MenuEditForm from "./Forms/MenuEditForm.jsx";

export default function MenuTab() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);

                const { data } = await client.get("/menus");
                setMenus(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const onDelete = async (id) => {
        try {
            setDeleteLoading(id);

            await client.delete(`/menus/${id}`);

            setMenus((prev) =>
                prev.filter((menu) => menu.id !== id)
            );
        } catch (e) {
            console.log(e);
        } finally {
            setDeleteLoading(null);
        }
    };

    return (
        <section className="flex flex-col gap-3" aria-label="Пункты меню">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">
                    Пункты меню
                </h3>

                <MenuCreateForm setMenus={setMenus} />
            </div>

            {/* LOADING */}
            {loading ? (
                <div
                    className="flex justify-center items-center py-10"
                    role="status"
                    aria-live="polite"
                    aria-label="Загрузка меню"
                >
                    <Spinner size="xl" />
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {menus.map((menu) => (
                        <li key={menu.id}>
                            <TabCard
                                item={menu}
                                img={menu.bg_img}
                                onEdit={
                                    <MenuEditForm
                                        setMenus={setMenus}
                                        menu={menu}
                                    />
                                }
                                onDelete={() => onDelete(menu.id)}
                                deleteLoading={deleteLoading}
                            >
                                <div className="text-white flex items-center gap-3">
                                    <img
                                        src={menu.icon}
                                        alt={menu.name ? `Иконка ${menu.name}` : "Иконка меню"}
                                        className="w-10 h-10 border border-my-border rounded-lg p-1"
                                    />

                                    <div className="font-medium">
                                        {menu.name}
                                    </div>
                                </div>
                            </TabCard>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}