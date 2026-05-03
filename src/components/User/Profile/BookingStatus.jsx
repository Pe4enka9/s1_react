import clsx from "clsx";

export default function BookingStatus({
                                   status,
                                   children,
                               }) {
    const statuses = {
        pending: 'bg-[#fbbf2426] text-[#fbbf24]',
        success: 'bg-[#22c55e26] text-[#4ade80]',
        cancelled: 'bg-[#ef444426] text-[#f87171]',
        finished: 'bg-[#6366f126] text-[#818cf8]',
    };

    return (
        <div
            className={clsx(
                'w-fit py-1 px-3 text-xs font-semibold rounded-full flex justify-center items-center gap-2',
                statuses[status],
            )}
        >
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            {children}
        </div>
    );
}
