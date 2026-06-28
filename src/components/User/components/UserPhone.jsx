import {Skeleton} from "@heroui/react";
import {Handset} from "@gravity-ui/icons";

export default function UserPhone({user}) {
    if (!user) {
        return (
            <div
                className="flex items-center gap-3"
                role="status"
                aria-live="polite"
                aria-label="Загрузка телефона пользователя"
            >
                {/* Иконка skeleton */}
                <Skeleton className="w-10 h-10 rounded-lg"/>

                {/* Текст skeleton */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-20 h-3 rounded"/>
                    <Skeleton className="w-32 h-4 rounded"/>
                </div>
            </div>
        );
    }

    return (
        <dl className="flex items-center gap-3">
            <div className="p-2 bg-primary/40 rounded-lg" aria-hidden="true">
                <Handset className="w-6 h-6"/>
            </div>

            <div className="flex flex-col">
                <dt className="text-text-secondary text-xs uppercase font-bold">
                    Телефон
                </dt>
                <dd className="text-white font-medium">
                    {user.phone}
                </dd>
            </div>
        </dl>
    );
}