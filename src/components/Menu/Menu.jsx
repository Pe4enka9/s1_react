import MenuCard from "./components/cards/MenuCard.jsx";

export default function Menu({menus}) {
    return (
        <section aria-labelledby="menu-title">
            <h2 id="menu-title" className="sr-only">
                Меню
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {menus?.map((menu) => (
                    <MenuCard key={menu.id} menu={menu}/>
                ))}
            </div>
        </section>
    );
}
