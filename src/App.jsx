import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ShowMenuItem from "./components/ShowMenuItem.jsx";
import React, {useState} from "react";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import BookingForm from "./components/BookingForm.jsx";

export default function App() {
    const [isActive, setIsActive] = useState({
        register: false,
        login: false,
        booking: false,
    });

    return (
        <>
            <LoginForm
                isActive={isActive.login}
                setIsActive={setIsActive}
            />

            <RegisterForm
                isActive={isActive.register}
                setIsActive={setIsActive}
            />

            <BookingForm
                isActive={isActive.booking}
                setIsActive={setIsActive}
            />

            <div id="calendar"></div>

            <Header
                isActive={isActive}
                setIsActive={setIsActive}
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
            />
        </>
    )
}