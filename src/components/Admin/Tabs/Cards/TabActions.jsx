import Loader from "../../../Loader.jsx";

export default function TabActions({
                                       item,
                                       onEdit,
                                       onDelete,
                                       deleteLoading,
                                   }) {
    return (
        <div className="flex flex-1 justify-end gap-2">
            <div
                className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-white/10 transition-colors duration-200"
                onClick={() => onEdit(item)}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </div>

            <div
                className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-primary/20 hover:text-secondary/70 hover:border-secondary/70 transition-colors duration-200"
                onClick={() => onDelete(item.id)}
            >
                {deleteLoading === item.id ? (
                    <Loader center/>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                )}
            </div>
        </div>
    );
}
