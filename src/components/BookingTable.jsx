import ProfileButton from "./Button/ProfileButton.jsx";
import {Button, ListBox, Select, Skeleton, toast} from "@heroui/react";
import Status from "./Status.jsx";
import {Calendar} from "@gravity-ui/icons";
import {useEffect, useState} from "react";
import client from "../api/client.js";
import {STATUS_LABELS} from "../constants/statuses.js";

function TableSkeleton() {
    return (
        <div className="hidden sm:block border border-my-border rounded-xl overflow-hidden">
            <table className="w-full">
                <thead className="bg-[#262626] border-b border-my-border">
                <tr>
                    {Array.from({length: 6}).map((_, i) => (
                        <th key={i} className="p-3">
                            <Skeleton className="h-4 w-20 rounded"/>
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody className="bg-main">
                {Array.from({length: 6}).map((_, row) => (
                    <tr
                        key={row}
                        className="border-b border-[#75757533]"
                    >
                        {Array.from({length: 6}).map((_, col) => (
                            <td key={col} className="p-3">
                                <Skeleton className="h-4 w-full rounded"/>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function MobileSkeleton() {
    return (
        <div className="flex flex-col gap-3 sm:hidden">
            {Array.from({length: 4}).map((_, i) => (
                <div
                    key={i}
                    className="bg-main p-4 border border-my-border rounded-xl flex flex-col gap-4"
                >
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24 rounded"/>
                            <Skeleton className="h-3 w-16 rounded"/>
                        </div>
                        <Skeleton className="h-6 w-20 rounded"/>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {Array.from({length: 4}).map((_, j) => (
                            <div key={j} className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-16 rounded"/>
                                <Skeleton className="h-4 w-20 rounded"/>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function BookingTable({
                                         title,
                                         canEdit = false,
                                     }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeStatus, setActiveStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);

                const params = {
                    page: currentPage,
                    ...(activeStatus !== 'all' && {status: activeStatus})
                };

                const {data} = await client.get(
                    !canEdit ? '/user/bookings' : '/bookings',
                    {params}
                );

                setBookings(data.data);
                setLastPage(data.pagination.last_page);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [activeStatus, canEdit, currentPage]);

    const setActiveFilter = (status) => {
        setCurrentPage(1);
        setActiveStatus(status);
    };

    const prevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const nextPage = () => setCurrentPage(prev => Math.min(lastPage, prev + 1));

    const changeStatus = async (id, status) => {
        try {
            await client.patch(`/bookings/${id}`, {status});
            toast.success('Статус успешно изменен', {
                description: `Статус изменен на "${STATUS_LABELS[status].label}"`,
            });
        } catch {
            toast.danger('Не удалось обновить статус');
        }
    };

    return (
        <section className="col-span-1 flex flex-col gap-5 sm:col-span-9">
            <h2 className="text-white text-2xl font-semibold">{title}</h2>

            <nav className="flex gap-3 flex-wrap">
                <ProfileButton
                    key="all"
                    isActive={activeStatus === 'all'}
                    onClick={() => setActiveFilter('all')}
                >
                    Все
                </ProfileButton>

                {Object.keys(STATUS_LABELS).map(key => (
                    <ProfileButton
                        key={key}
                        isActive={activeStatus === key}
                        onClick={() => setActiveFilter(key)}
                    >
                        {STATUS_LABELS[key].label}
                    </ProfileButton>
                ))}
            </nav>

            {/* LOADING SKELETON */}
            {loading ? (
                <>
                    <TableSkeleton/>
                    <MobileSkeleton/>
                </>
            ) : (
                bookings.length > 0 ? (
                    <>
                        {/* DESKTOP TABLE */}
                        <div className="hidden sm:block border border-my-border rounded-xl overflow-hidden">
                            <table className="w-full">
                                <caption className="sr-only">
                                    Список бронирований пользователя
                                </caption>

                                <thead
                                    className="bg-[#262626] border-b border-my-border text-text-secondary text-sm uppercase text-left">
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
                                    <tr key={booking.id} className="border-b border-[#75757533] last:border-b-0">
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
                                            {canEdit ? (
                                                <Select
                                                    className="w-full sm:w-64"
                                                    defaultValue={booking.status}
                                                    onSelectionChange={value =>
                                                        changeStatus(booking.id, value)
                                                    }
                                                >
                                                    <Select.Trigger>
                                                        <Select.Value/>
                                                        <Select.Indicator/>
                                                    </Select.Trigger>

                                                    <Select.Popover>
                                                        <ListBox>
                                                            {Object.keys(STATUS_LABELS).map(key => {
                                                                if (key === 'all') return null;

                                                                return (
                                                                    <ListBox.Item
                                                                        key={key}
                                                                        id={key}
                                                                        textValue={STATUS_LABELS[key].label}
                                                                    >
                                                                        {STATUS_LABELS[key].label}
                                                                        <ListBox.ItemIndicator/>
                                                                    </ListBox.Item>
                                                                );
                                                            })}
                                                        </ListBox>
                                                    </Select.Popover>
                                                </Select>
                                            ) : (
                                                <Status booking={booking}/>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE */}
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
                                        <Status booking={booking}/>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="uppercase text-xs font-bold text-text-secondary">
                                                Телефон
                                            </div>
                                            <div>{booking.phone}</div>
                                        </div>

                                        <div>
                                            <div className="uppercase text-xs font-bold text-text-secondary">
                                                Часы
                                            </div>
                                            <div>{booking.duration} ч</div>
                                        </div>

                                        <div>
                                            <div className="uppercase text-xs font-bold text-text-secondary">
                                                Человек
                                            </div>
                                            <div>{booking.peoples}</div>
                                        </div>

                                        <div>
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
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="tertiary"
                                    onClick={prevPage}
                                    isDisabled={currentPage === 1}
                                >
                                    Назад
                                </Button>

                                <span className="text-center text-text-secondary">
                                    Страница {currentPage} из {lastPage}
                                </span>

                                <Button
                                    variant="tertiary"
                                    onClick={nextPage}
                                    isDisabled={currentPage === lastPage}
                                >
                                    Вперед
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1 py-12 text-text-secondary">
                        <Calendar className="w-20 h-20" aria-hidden="true"/>
                        <p className="text-lg">Бронирований пока нет</p>
                        <p className="text-sm">Здесь будет история ваших посещений</p>
                    </div>
                )
            )}
        </section>
    );
}