import {useContext, useEffect, useState} from "react";
import UserDataItem from "./UserDataItem.jsx";
import {UserContext} from "../../../context/UserContext.js";
import profileIcon from '../../../icons/profile.svg';
import phoneIcon from '../../../icons/phone.svg';
import ProfileButton from "../../Button/ProfileButton.jsx";
import BookingStatus from "./BookingStatus.jsx";
import client from "../../../api/client.js";
import Loader from "../../Loader.jsx";
import calendarIcon from '../../../icons/calendar.svg';
import PrimaryButton from "../../Button/PrimaryButton.jsx";

export default function Profile() {
    const {user} = useContext(UserContext);

    const [bookings, setBookings] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [activeStatus, setActiveStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const statusLabels = {
        all: 'Все',
        pending: 'Ожидание',
        success: 'Подтверждено',
        cancelled: 'Отменено',
        finished: 'Завершено',
    };

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                setBookingLoading(true);

                const params = {
                    page: currentPage,
                    ...(activeStatus !== 'all' && {status: activeStatus})
                };

                const {data} = await client.get('/user/bookings', {params});

                setBookings(data.data);
                setLastPage(data.pagination.last_page);
            } catch (e) {
                console.log(e);
            } finally {
                setBookingLoading(false);
            }
        };

        fetchUserBookings();
    }, [activeStatus, currentPage]);

    const setActiveFilter = (status) => {
        setCurrentPage(1);
        setActiveStatus(status);
    }

    const prevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const nextPage = () => setCurrentPage(prev => Math.min(lastPage, prev + 1));

    if (!user) {
        return <Loader page/>
    }

    return (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-12">
            <div className="col-span-1 sm:col-span-3">
                <div className="bg-main border border-my-border rounded-lg flex flex-col overflow-hidden">
                    <div
                        className="flex flex-col items-center gap-2.5 bg-linear-to-r from-secondary to-primary p-6">
                        <div className="w-24 h-24 bg-white/20 rounded-full p-5 border-2 border-white/40">
                            <img src={profileIcon} alt=""/>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 p-6">
                        <UserDataItem
                            icon={phoneIcon}
                            label="Телефон"
                            value={user.phone}
                        />
                    </div>
                </div>
            </div>

            <div className="col-span-1 flex flex-col gap-5 sm:col-span-9">
                <div className="text-white text-2xl font-semibold">Мои бронирования</div>

                <div className="flex gap-3 flex-wrap">
                    {Object.keys(statusLabels).map(key => (
                        <ProfileButton
                            key={key}
                            isActive={activeStatus === key}
                            onClick={() => setActiveFilter(key)}
                        >
                            {statusLabels[key]}
                        </ProfileButton>
                    ))}
                </div>

                {bookingLoading ? (
                    <Loader center className="h-full"/>
                ) : (
                    bookings.length > 0 ? (
                        <>
                            <div className="hidden sm:block border border-my-border rounded-xl overflow-hidden">
                                <table className="w-full">
                                    <thead
                                        className="bg-[#262626] border-b border-my-border text-text-secondary text-sm uppercase text-left"
                                    >
                                    <tr>
                                        <th className="p-3">Телефон</th>
                                        <th className="p-3">Дата и время</th>
                                        <th className="p-3">Часы</th>
                                        <th className="p-3">Человек</th>
                                        <th className="p-3">Дата заявки</th>
                                        <th className="p-3">Статус</th>
                                    </tr>
                                    </thead>

                                    <tbody className="bg-main text-white">
                                    {bookings.map(booking => (
                                        <tr className="border-b border-[#75757533] last:border-b-0"
                                            key={booking.id}>
                                            <td className="p-3 font-medium">{booking.phone}</td>

                                            <td className="p-3">
                                                <div>{booking.date_formatted}</div>

                                                <div className="text-text-secondary text-sm">
                                                    {booking.time_formatted}
                                                </div>
                                            </td>

                                            <td className="p-3">{booking.duration} ч</td>
                                            <td className="p-3">{booking.peoples}</td>
                                            <td className="p-3">{booking.created_at_date_formatted}</td>

                                            <td className="p-3">
                                                <BookingStatus status={booking.status}>
                                                    {statusLabels[booking.status]}
                                                </BookingStatus>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col gap-3 sm:hidden text-white">
                                {bookings.map(booking => (
                                    <div
                                        key={booking.id}
                                        className="flex flex-col gap-4 bg-main p-4 border border-my-border rounded-xl"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold">{booking.date_formatted}</div>

                                                <div className="text-text-secondary text-sm">
                                                    {booking.time_formatted}
                                                </div>
                                            </div>

                                            <BookingStatus status={booking.status}>
                                                {statusLabels[booking.status]}
                                            </BookingStatus>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <div className="uppercase text-xs font-bold text-text-secondary">
                                                    Телефон
                                                </div>

                                                <div>{booking.phone}</div>
                                            </div>

                                            <div className="col-span-1">
                                                <div className="uppercase text-xs font-bold text-text-secondary">
                                                    Часы
                                                </div>

                                                <div>{booking.duration} ч</div>
                                            </div>

                                            <div className="col-span-1">
                                                <div className="uppercase text-xs font-bold text-text-secondary">
                                                    Человек
                                                </div>

                                                <div>{booking.peoples}</div>
                                            </div>

                                            <div className="col-span-1">
                                                <div className="uppercase text-xs font-bold text-text-secondary">
                                                    Дата заявки
                                                </div>

                                                <div>{booking.created_at_date_formatted}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {lastPage !== 1 && (
                                <div className="flex justify-between items-center mt-auto">
                                    <PrimaryButton
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className="flex-1"
                                    >
                                        Назад
                                    </PrimaryButton>

                                    <span className="text-center text-text-secondary flex-5">
                                        Страница {currentPage} из {lastPage}
                                    </span>

                                    <PrimaryButton
                                        onClick={nextPage}
                                        disabled={currentPage === lastPage}
                                        className="flex-1"
                                    >
                                        Вперед
                                    </PrimaryButton>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-1 py-12 text-text-secondary">
                            <div className="w-20 h-20">
                                <img src={calendarIcon} alt=""/>
                            </div>

                            <p className="text-lg">Бронирований пока нет</p>
                            <p className="text-sm">Здесь будет история ваших посещений</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
