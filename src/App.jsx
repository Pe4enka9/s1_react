import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ShowMenuItem from "./components/ShowMenuItem.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";

export default function App() {
    return (
        <>
            <Header/>

            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/show" element={<ShowMenuItem/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </main>

            <Footer/>
        </>
    )
}