import clsx from "clsx";

export default function Loader({
                                   center = false,
                                   page = false,
                                   className = '',
                               }) {
    return (
        <div className={clsx(
            (center || page) && 'flex justify-center items-center',
            page && 'h-[50vh]',
            className,
        )}>
            <div className="loader"></div>
        </div>
    );
}
