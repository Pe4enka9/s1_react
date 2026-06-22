import clsx from "clsx";
import {Card} from "@heroui/react";

export default function Slot({
                                 slot,
                                 handleSlotSelect,
                                 watchTime,
                             }) {
    return (
        <Card
            key={slot.id}
            variant="secondary"
            onClick={() => handleSlotSelect(slot.time)}
            className={clsx(
                'border hover:border-secondary active:scale-95 transition-all duration-300 cursor-pointer',
                watchTime === slot.time && 'border-primary',
            )}
        >
            <Card.Header className="flex items-center gap-1.5">
                <Card.Title className="text-xl">{slot.time}</Card.Title>

                <Card.Description className="text-xs text-center">
                    Свободных мест: {slot.free_spots}
                </Card.Description>
            </Card.Header>
        </Card>
    );
}
