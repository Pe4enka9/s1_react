import {Route, Routes} from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {lazy, Suspense, useEffect, useState} from "react";
import Notification from "./components/Notification.jsx";
import PageLoader from "./components/PageLoader.jsx";
import 'react-datepicker/dist/react-datepicker.min.css';

const Home = lazy(() => import('./components/Home.jsx'));
const ShowMenuItem = lazy(() => import('./components/ShowMenuItem.jsx'));

const LazyLoginForm = lazy(() => import('./components/LoginForm.jsx'));
const LazyRegisterForm = lazy(() => import('./components/RegisterForm.jsx'));
const LazyBookingForm = lazy(() => import('./components/BookingForm.jsx'));

export default function App() {
    const [isActive, setIsActive] = useState({
        register: false,
        login: false,
        booking: false,
    });
    const [loadedModals, setLoadedModals] = useState({
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

    useEffect(() => {
        const toLoad = {};

        Object.keys(isActive).forEach(key => {
            if (isActive[key] && !loadedModals[key]) {
                toLoad[key] = true;
            }
        });

        if (Object.keys(toLoad).length > 0) {
            setLoadedModals(prev => ({...prev, ...toLoad}));
        }
    }, [isActive, loadedModals]);

    return (
        <>
            <Notification
                text={notification.text}
                failed={notification.failed}
                active={notification.active}
            />

            {loadedModals.login && (
                <Suspense fallback={<PageLoader isElement/>}>
                    <LazyLoginForm
                        isActive={isActive.login}
                        setIsActive={setIsActive}
                        setNotification={setNotification}
                    />
                </Suspense>
            )}

            {loadedModals.register && (
                <Suspense fallback={<PageLoader isElement/>}>
                    <LazyRegisterForm
                        isActive={isActive.register}
                        setIsActive={setIsActive}
                        setNotification={setNotification}
                    />
                </Suspense>
            )}

            {loadedModals.booking && (
                <Suspense fallback={<PageLoader isElement/>}>
                    <LazyBookingForm
                        isActive={isActive.booking}
                        setIsActive={setIsActive}
                        setNotification={setNotification}
                    />
                </Suspense>
            )}

            <div id="calendar"></div>

            <Header
                isActive={isActive}
                setIsActive={setIsActive}
                setNotification={setNotification}
            />

            <main>
                <Suspense fallback={<PageLoader/>}>
                    <Routes>
                        <Route path="/" element={<Home setIsActive={setIsActive}/>}/>
                        <Route path="/show" element={<ShowMenuItem setIsActive={setIsActive}/>}/>
                    </Routes>
                </Suspense>
            </main>

            <Footer
                isActive={isActive}
                setIsActive={setIsActive}
                setNotification={setNotification}
            />
        </>
    )
}