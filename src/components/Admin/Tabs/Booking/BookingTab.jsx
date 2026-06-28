import BookingStats from "./Stats/BookingStats.jsx";
import BookingTable from "../../../BookingTable.jsx";
import {useEffect, useState} from "react";
import api from "../../../../api/api.js";

export default function BookingTab() {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeStatus, setActiveStatus] = useState('all');
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        total: 0,
        last_page: 1,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                const params = {
                    page: currentPage,
                    status: activeStatus !== 'all' ? activeStatus : undefined,
                };

                const {data} = await api.get('/bookings', {params});

                setBookings(data.data);
                setPagination(data.pagination);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [activeStatus, currentPage]);

    return (
        <section
            className="flex flex-col gap-3"
            aria-label="Управление бронированиями"
        >
            <BookingStats/>

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
    );
}