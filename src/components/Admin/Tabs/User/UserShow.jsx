import {useEffect, useState} from "react";
import api from "../../../../api/api.js";
import {Avatar} from "@heroui/react";
import {Person} from "@gravity-ui/icons";
import UserPhone from "../../../User/components/UserPhone.jsx";
import BookingTable from "../../../BookingTable.jsx";
import {useParams} from "react-router-dom";
import UserComment from "../../../User/components/UserComment.jsx";

export default function UserShow() {
    const [user, setUser] = useState({});
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeStatus, setActiveStatus] = useState('all');
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        total: 0,
        last_page: 1,
    });

    const {id} = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                const params = {
                    page: currentPage,
                    status: activeStatus !== 'all' ? activeStatus : undefined,
                };

                const {data} = await api.get(`users/${id}`, {params});

                setUser(data.user);
                setBookings(data.bookings);
                setPagination(data.pagination);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [activeStatus, currentPage, id]);

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
                            <Avatar className="w-24 h-24">
                                <Avatar.Image
                                    src={user.avatar}
                                    className="object-cover"
                                />
                                <Avatar.Fallback>
                                    <Person className="w-12 h-12"/>
                                </Avatar.Fallback>
                            </Avatar>
                        )}

                        <h1
                            id="profile-title"
                            className="text-white text-lg font-semibold"
                        >
                            Профиль
                        </h1>
                    </header>

                    <div className="flex flex-col gap-5 p-6">
                        <UserPhone user={user}/>
                        <UserComment user={user}/>
                    </div>
                </div>
            </section>

            <section className="sm:col-span-9" aria-label="Бронирования пользователя">
                <BookingTable
                    title="Бронирования"
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    activeStatus={activeStatus}
                    setActiveStatus={setActiveStatus}
                    bookings={bookings}
                    setBookings={setBookings}
                    pagination={pagination}
                    loading={loading}
                    canEdit
                />
            </section>
        </main>
    );
}