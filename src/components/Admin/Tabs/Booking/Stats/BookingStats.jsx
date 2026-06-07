import BookingStatsItem from "./BookingStatsItem.jsx";
import { useEffect, useState } from "react";
import client from "../../../../../api/api.js";

export default function BookingStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const { data } = await client.get('/bookings/stats');
                setStats(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <section
            className="flex flex-wrap gap-3"
            aria-label="Статистика бронирований"
            aria-busy={loading}
        >
            <BookingStatsItem
                status="pending"
                count={stats?.pending ?? 0}
                loading={loading}
            />

            <BookingStatsItem
                status="success"
                count={stats?.success ?? 0}
                loading={loading}
            />

            <BookingStatsItem
                status="finished"
                count={stats?.finished ?? 0}
                loading={loading}
            />

            <BookingStatsItem
                status="cancelled"
                count={stats?.cancelled ?? 0}
                loading={loading}
            />
        </section>
    );
}