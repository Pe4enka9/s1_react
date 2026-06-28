import {LazyLoadImage} from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import TabActions from "./TabActions.jsx";

export default function TabCard({
                                    item,
                                    img,
                                    onEdit,
                                    onView,
                                    onDelete,
                                    deleteLoading,
                                    children,
                                }) {
    return (
        <div className="bg-main border border-my-border rounded-lg p-4 flex items-center gap-4">
            <LazyLoadImage
                src={img}
                effect="blur"
                className="w-14 h-14 object-cover rounded-lg"
            />

            {children}

            <TabActions
                item={item}
                onEdit={onEdit}
                onView={onView}
                onDelete={onDelete}
                deleteLoading={deleteLoading}
            />
        </div>
    );
}
