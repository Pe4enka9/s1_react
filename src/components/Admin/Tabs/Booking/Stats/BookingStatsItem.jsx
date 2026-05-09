import clsx from "clsx";
import {Spinner} from "@heroui/react";
import {STATUS_LABELS} from "../../../../../constants/statuses.js";

export default function BookingStatsItem({
                                             status,
                                             count,
                                         }) {
    return (
        <div className="flex-1 bg-main border border-my-border rounded-lg p-4">
            <div className="text-white font-medium">{STATUS_LABELS[status].label}</div>

            <div className={clsx(
                'text-2xl font-semibold',
                STATUS_LABELS[status].style.text,
            )}>
                {!count && count !== 0 ? (
                    <div className="flex items-center">
                        <Spinner color="current"/>
                    </div>
                ) : count}
            </div>
        </div>
    );
}
