import {Route, Routes, useLocation} from "react-router-dom";
import Home from "./Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {useEffect, useState} from "react";
import api, {getCsrf} from "./api/api.js";
import {UserContext} from "./context/UserContext.js";
import Profile from "./components/User/Profile.jsx";
import Show from "./components/Menu/components/Show.jsx";
import {AnimatePresence, motion} from "framer-motion";
import AdminPanel from "./components/Admin/AdminPanel.jsx";
import {Toast} from "@heroui/react";

const PageWrapper = ({children}) => (
    <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: .3}}
        className="w-full"
    >
        {children}
    </motion.div>
);

export default function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getCsrf();
                const {data} = await api.get('/user');
                setUser(data);
            } catch {
                setUser(null);
            }
        };

        checkAuth();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <Toast.Provider placement="top"/>

            <Header/>

            <main className="container mx-auto grow px-3 sm:px-0">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageWrapper><Home/></PageWrapper>}/>
                        <Route path="/profile" element={<PageWrapper><Profile/></PageWrapper>}/>
                        <Route path="/menus/:id" element={<PageWrapper><Show/></PageWrapper>}/>
                        <Route path="/admin" element={<PageWrapper><AdminPanel/></PageWrapper>}/>
                    </Routes>
                </AnimatePresence>
            </main>

            <Footer/>
        </UserContext.Provider>
    );
}
