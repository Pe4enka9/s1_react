import ProfileButton from "./Button/ProfileButton.jsx";
import {ListBox, Pagination, Select, Skeleton, Table, toast} from "@heroui/react";
import Status from "./Status.jsx";
import {Calendar} from "@gravity-ui/icons";
import {useEffect, useMemo, useState} from "react";
import api from "../api/api.js";
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

const columns = [
    {id: "phone", name: "Телефон"},
    {id: "datetime", name: "Дата и время"},
    {id: "duration", name: "Часы"},
    {id: "peoples", name: "Человек"},
    {id: "created_at", name: "Дата заявки"},
    {id: "status", name: "Статус"},
];

export default function BookingTable({
                                         title,
                                         canEdit = false,
                                     }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeStatus, setActiveStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        last_page: 1,
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);

                const params = {
                    page: currentPage,
                    status: activeStatus !== 'all' ? activeStatus : undefined,
                };

                const {data} = await api.get(
                    !canEdit ? '/user/bookings' : '/bookings',
                    {params}
                );

                setBookings(data.data);
                setPagination(data.pagination);
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

    const changeStatus = async (id, status) => {
        try {
            await api.patch(`/bookings/${id}`, {status});
            toast.success('Статус успешно изменен', {
                description: `Статус изменен на "${STATUS_LABELS[status].label}"`,
            });
        } catch {
            toast.danger('Не удалось обновить статус');
        }
    };

    const pages = useMemo(() =>
            Array.from({length: pagination.last_page}, (_, i) => i + 1),
        [pagination.last_page]);

    return (
        <section className="col-span-1 flex flex-col gap-5 sm:col-span-9">
            <h2 className="text-white text-2xl font-semibold">{title}</h2>

            {canEdit && (
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
            )}

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
                        <Table aria-label="Список бронирований">
                            <Table.ScrollContainer>
                                <Table.Content>
                                    <Table.Header columns={columns}>
                                        {column => (
                                            <Table.Column isRowHeader={column.id === 'phone'}>
                                                {column.name}
                                            </Table.Column>
                                        )}
                                    </Table.Header>

                                    <Table.Body items={bookings}>
                                        {booking => (
                                            <Table.Row key={booking.id}>
                                                <Table.Cell className="font-medium">
                                                    {booking.phone}
                                                </Table.Cell>

                                                <Table.Cell>
                                                    <div>{booking.date_formatted}</div>
                                                    <div className="text-text-secondary text-sm">
                                                        {booking.time_formatted}
                                                    </div>
                                                </Table.Cell>

                                                <Table.Cell>{booking.duration} ч</Table.Cell>
                                                <Table.Cell>{booking.peoples}</Table.Cell>
                                                <Table.Cell>{booking.created_at_date_formatted}</Table.Cell>

                                                <Table.Cell>
                                                    {canEdit ? (
                                                        <Select
                                                            className="w-64"
                                                            defaultValue={booking.status}
                                                            onSelectionChange={value => changeStatus(booking.id, value)}
                                                        >
                                                            <Select.Trigger>
                                                                <Select.Value/>
                                                                <Select.Indicator/>
                                                            </Select.Trigger>

                                                            <Select.Popover>
                                                                <ListBox>
                                                                    {Object.keys(STATUS_LABELS)
                                                                        .filter(key => key !== 'all')
                                                                        .map(key => (
                                                                            <ListBox.Item
                                                                                key={key}
                                                                                id={key}
                                                                                textValue={STATUS_LABELS[key].label}
                                                                            >
                                                                                {STATUS_LABELS[key].label}
                                                                                <ListBox.ItemIndicator/>
                                                                            </ListBox.Item>
                                                                        ))}
                                                                </ListBox>
                                                            </Select.Popover>
                                                        </Select>
                                                    ) : (
                                                        <Status booking={booking}/>
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table.Content>
                            </Table.ScrollContainer>

                            <Table.Footer>
                                <Pagination size="sm">
                                    <Pagination.Content>
                                        <Pagination.Item>
                                            <Pagination.Previous
                                                isDisabled={currentPage === 1}
                                                onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            >
                                                <Pagination.PreviousIcon/>
                                                Назад
                                            </Pagination.Previous>
                                        </Pagination.Item>
                                        {pages.map(p => (
                                            <Pagination.Item key={p}>
                                                <Pagination.Link
                                                    isActive={p === currentPage}
                                                    onPress={() => setCurrentPage(p)}
                                                >
                                                    {p}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Item>
                                            <Pagination.Next
                                                isDisabled={currentPage === pagination.last_page}
                                                onPress={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                                            >
                                                Вперед
                                                <Pagination.NextIcon/>
                                            </Pagination.Next>
                                        </Pagination.Item>
                                    </Pagination.Content>
                                </Pagination>
                            </Table.Footer>
                        </Table>

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

                        {/*{lastPage !== 1 && (*/}
                        {/*    <div className="flex justify-between items-center">*/}
                        {/*        <Button*/}
                        {/*            variant="tertiary"*/}
                        {/*            onClick={prevPage}*/}
                        {/*            isDisabled={currentPage === 1}*/}
                        {/*        >*/}
                        {/*            Назад*/}
                        {/*        </Button>*/}

                        {/*        <span className="text-center text-text-secondary">*/}
                        {/*        Страница {currentPage} из {lastPage}*/}
                        {/*    </span>*/}

                        {/*        <Button*/}
                        {/*            variant="tertiary"*/}
                        {/*            onClick={nextPage}*/}
                        {/*            isDisabled={currentPage === lastPage}*/}
                        {/*        >*/}
                        {/*            Вперед*/}
                        {/*        </Button>*/}
                        {/*    </div>*/}
                        {/*)}*/}
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