import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Banner from "./components/Banner.jsx";

export default function App() {
    return (
        <>
            <Header/>

            <Banner/>

            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </main>
        </>
    )
}