import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
    return (
        <>
            <Header/>

            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </main>

            <Footer/>
        </>
    )
}