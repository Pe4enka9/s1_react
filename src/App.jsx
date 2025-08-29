import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ShowMenuItem from "./components/ShowMenuItem.jsx";
import Register from "./components/Register.jsx";
import {useState} from "react";
import Login from "./components/Login.jsx";

export default function App() {
    const [isActive, setIsActive] = useState({
        register: false,
        login: false,
    });
    const [registerStep, setRegisterStep] = useState(0);
    const [loginStep, setLoginStep] = useState(0);

    return (
        <>
            <Register
                isActive={isActive}
                setIsActive={setIsActive}
                registerStep={registerStep}
                setRegisterStep={setRegisterStep}
            />

            <Login
                isActive={isActive}
                setIsActive={setIsActive}
                loginStep={loginStep}
                setLoginStep={setLoginStep}
            />

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
                    <Route path="/" element={<Home/>}/>
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