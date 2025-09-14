import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ShowMenuItem from "./components/ShowMenuItem.jsx";
import React, {useEffect, useState} from "react";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import BookingForm from "./components/BookingForm.jsx";
import Notification from "./components/Notification.jsx";

export default function App() {
    const [isActive, setIsActive] = useState({
        register: false,
        login: false,
        booking: false,
    });
    const [notification, setNotification] = useState({
        text: '',
        failed: false,
        active: false,
    });

    useEffect(() => {
        const hasAnyActive = Object.values(isActive).some(value => value === true);

        if (hasAnyActive) document.body.style.overflowY = "hidden";
        else document.body.style.overflowY = "auto";
    }, [isActive]);

    return (
        <>
            <Notification
                text={notification.text}
                failed={notification.failed}
                active={notification.active}
            />

            <LoginForm
                isActive={isActive.login}
                setIsActive={setIsActive}
                setNotification={setNotification}
            />

            <RegisterForm
                isActive={isActive.register}
                setIsActive={setIsActive}
                setNotification={setNotification}
            />

            <BookingForm
                isActive={isActive.booking}
                setIsActive={setIsActive}
                setNotification={setNotification}
            />

            <div id="calendar"></div>

            <Header
                isActive={isActive}
                setIsActive={setIsActive}
                setNotification={setNotification}
            />

            <main>
                <Routes>
                    <Route path="/" element={<Home setIsActive={setIsActive}/>}/>
                    <Route path="/show" element={<ShowMenuItem setIsActive={setIsActive}/>}/>
                </Routes>
            </main>

            <Footer
                isActive={isActive}
                setIsActive={setIsActive}
                setNotification={setNotification}
            />
        </>
    )
}