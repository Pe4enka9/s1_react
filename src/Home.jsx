import Slider from "./components/Slider/Slider.jsx";
import {useEffect, useState} from "react";
import client from "./api/client.js";
import Loader from "./components/Loader.jsx";
import Menu from "./components/Menu/Menu.jsx";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [sliders, setSliders] = useState([]);
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [slidersRes, menusRes] = await Promise.all([
                    client.get('/sliders'),
                    client.get('/menus'),
                ]);

                setSliders(slidersRes.data);
                setMenus(menusRes.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        loading ? (
            <Loader page/>
        ) : (
            <>
                <Slider sliders={sliders}/>
                <Menu menus={menus}/>
            </>
        )
    );
}
