export default function UserDataItem({
                                         icon,
                                         label,
                                         value,
                                     }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 p-2 bg-primary/40 rounded-lg">
                <img src={icon} alt=""/>
            </div>

            <div className="flex flex-col">
                <div className="text-text-secondary text-xs uppercase font-bold">{label}</div>
                <div className="text-white font-medium">{value}</div>
            </div>
        </div>
    );
}
