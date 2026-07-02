import Logo from "./Logo.jsx";
import Nav from "./Nav.jsx";
import {useEffect, useState} from "react";
import api from "../api/api.js";
import {Avatar} from "@heroui/react";

export default function Header() {
    const [currentAdmin, setCurrentAdmin] = useState({});

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const {data} = await api.get('/admins/current');

                setCurrentAdmin(data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchAdmin();
    }, []);

    return (
        <header
            className="bg-main/85 backdrop-blur-xs border-b border-b-primary/40 sticky top-0 z-40 mb-5"
            role="banner"
        >
            <div className="container mx-auto flex justify-between items-center py-2 px-3 sm:px-0">
                <Logo/>

                <div className="flex flex-col items-center gap-1">
                    <Avatar>
                        <Avatar.Image src={currentAdmin.avatar} className="object-cover"/>
                    </Avatar>

                    <h1>{currentAdmin.name}</h1>
                </div>

                <Nav/>
            </div>
        </header>
    );
}
