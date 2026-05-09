import BookingStats from "./Stats/BookingStats.jsx";
import BookingTable from "../../../BookingTable.jsx";

export default function BookingTab() {
    return (
        <section
            className="flex flex-col gap-3"
            aria-label="Управление бронированиями"
        >
            <BookingStats />

            <BookingTable
                title="Бронирования"
                canEdit
            />
        </section>
    );
}