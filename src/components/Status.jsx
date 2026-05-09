import clsx from "clsx";
import {STATUS_LABELS} from "../constants/statuses.js";

export default function Status({
                                   booking,
                                   onChange,
                               }) {
    return (
        onChange ? (
            <select onChange={onChange}>
                {Object.keys(STATUS_LABELS).map(key => (
                    <option key={key} value={key}>{STATUS_LABELS[key].label}</option>
                ))}
            </select>
        ) : (
            <div
                className={clsx(
                    'w-fit py-1 px-3 text-xs font-semibold rounded-full flex justify-center items-center gap-2',
                    STATUS_LABELS[booking.status].style.bg,
                    STATUS_LABELS[booking.status].style.text,
                )}
            >
                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                {STATUS_LABELS[booking.status].label}
            </div>
        )
    );
}
