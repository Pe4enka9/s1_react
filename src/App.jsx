import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ShowMenuItem from "./components/ShowMenuItem.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import {useState} from "react";

export default function App() {
    const [isActive, setIsActive] = useState({
        register: false,
        login: false,
    });
    const [step, setStep] = useState(0);

    return (
        <>
            <Register isActive={isActive} setIsActive={setIsActive} step={step} setStep={setStep}/>

            <Header isActive={isActive} setIsActive={setIsActive} step={step} setStep={setStep}/>

            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/show" element={<ShowMenuItem/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </main>

            <Footer isActive={isActive} setIsActive={setIsActive} step={step} setStep={setStep}/>
        </>
    )
}