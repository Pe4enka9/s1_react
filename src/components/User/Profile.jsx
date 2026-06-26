import Phone from "./components/Phone.jsx";
import BookingTable from "../BookingTable.jsx";
import {Avatar, Input, Spinner} from "@heroui/react";
import {useContext, useState} from "react";
import {UserContext} from "../../context/UserContext.js";
import {Camera, Person} from "@gravity-ui/icons";
import api from "../../api/api.js";

export default function Profile() {
    const {user, setUser} = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const {data} = await api.post('/users/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUser(prev => ({...prev, avatar: data.avatar}));
        } catch (e) {
            console.error('Ошибка загрузки аватара:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="grid grid-cols-1 gap-10 sm:grid-cols-12" aria-label="Профиль пользователя">
            <section
                className="col-span-1 sm:col-span-3"
                aria-labelledby="profile-title"
            >
                <div className="bg-main border border-my-border rounded-lg flex flex-col overflow-hidden">
                    <header
                        className="flex flex-col items-center gap-2.5 bg-linear-to-r from-secondary to-primary p-6"
                    >
                        {user && (
                            <label className="cursor-pointer relative group">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={loading}
                                />
                                <div className="relative">
                                    <Avatar className="w-24 h-24">
                                        <Avatar.Image
                                            src={user.avatar}
                                            className="object-cover"
                                        />
                                        <Avatar.Fallback>
                                            <Person className="w-12 h-12"/>
                                        </Avatar.Fallback>
                                    </Avatar>

                                    {loading && (
                                        <div
                                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <Spinner size="lg"/>
                                        </div>
                                    )}

                                    <div
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-full transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Camera className="w-8 h-8 text-white"/>
                                    </div>
                                </div>
                            </label>
                        )}

                        <h1
                            id="profile-title"
                            className="text-white text-lg font-semibold"
                        >
                            Профиль
                        </h1>
                    </header>

                    <div className="flex flex-col gap-5 p-6">
                        <Phone/>
                    </div>
                </div>
            </section>

            <section className="sm:col-span-9" aria-label="Бронирования пользователя">
                <BookingTable title="Мои бронирования"/>
            </section>
        </main>
    );
}