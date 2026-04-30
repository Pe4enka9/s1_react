import {useState} from "react";
import {UIContext} from "../context/UIContext.js";

export const UIProvider = ({children}) => {
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenRegister, setIsOpenRegister] = useState(false);
    const [isOpenBooking, setIsOpenBooking] = useState(false);

    const value = {
        isOpenLogin,
        setIsOpenLogin,
        isOpenRegister,
        setIsOpenRegister,
        isOpenBooking,
        setIsOpenBooking,
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>
};
