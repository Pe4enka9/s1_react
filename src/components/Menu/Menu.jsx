import Card from "./Cards/Card.jsx";

export default function Menu({menus}) {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {menus.map(menu => (
                <Card
                    key={menu.id}
                    menu={menu}
                />
            ))}
        </div>
    );
}
