import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ShowMenuItem from "./components/ShowMenuItem.jsx";
import {useState} from "react";
import LoginForm from "./components/LoginForm.jsx";
import BookingForm from "./components/BookingForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";

export default function App() {
    const [isActive, setIsActive] = useState({
        register: false,
        login: false,
        booking: false,
    });
    const [registerStep, setRegisterStep] = useState(0);
    const [loginStep, setLoginStep] = useState(0);
    const [bookingStep, setBookingStep] = useState(0)

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

            {/*<BookingForm*/}
            {/*    isActive={isActive}*/}
            {/*    setIsActive={setIsActive}*/}
            {/*    bookingStep={bookingStep}*/}
            {/*    setBookingStep={setBookingStep}*/}
            {/*/>*/}

            {/*<div id="calendar"></div>*/}

            <Header
                isActive={isActive}
                setIsActive={setIsActive}
                registerStep={registerStep}
                setRegisterStep={setRegisterStep}
                loginStep={loginStep}
                setLoginStep={setLoginStep}
            />

            <main>
                <Routes>
                    <Route path="/"
                           element={<Home
                               setIsActive={setIsActive}
                               bookingStep={bookingStep}
                               setBookingStep={setBookingStep}
                           />}
                    />
                    <Route path="/show" element={<ShowMenuItem/>}/>
                </Routes>
            </main>

            <Footer
                isActive={isActive}
                setIsActive={setIsActive}
                registerStep={registerStep}
                setRegisterStep={setRegisterStep}
                loginStep={loginStep}
                setLoginStep={setLoginStep}
            />
        </>
    )
}