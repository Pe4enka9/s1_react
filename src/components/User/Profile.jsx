import Phone from "./components/Phone.jsx";
import { Person } from "@gravity-ui/icons";
import BookingTable from "../BookingTable.jsx";

export default function Profile() {
    return (
        <main className="grid grid-cols-1 gap-10 sm:grid-cols-12" aria-label="Профиль пользователя">
            {/* Левая колонка профиля */}
            <section
                className="col-span-1 sm:col-span-3"
                aria-labelledby="profile-title"
            >
                <div className="bg-main border border-my-border rounded-lg flex flex-col overflow-hidden">
                    <header
                        className="flex flex-col items-center gap-2.5 bg-linear-to-r from-secondary to-primary p-6"
                    >
                        <div
                            className="p-5 flex justify-center items-center bg-white/20 rounded-full border-2 border-white/40"
                            role="img"
                            aria-label="Аватар пользователя"
                        >
                            <Person className="w-12 h-12" aria-hidden="true" />
                        </div>

                        <h1
                            id="profile-title"
                            className="text-white text-lg font-semibold"
                        >
                            Профиль
                        </h1>
                    </header>

                    <div className="flex flex-col gap-5 p-6">
                        <Phone />
                    </div>
                </div>
            </section>

            {/* Основная таблица бронирований */}
            <section className="sm:col-span-9" aria-label="Бронирования пользователя">
                <BookingTable title="Мои бронирования" />
            </section>
        </main>
    );
}