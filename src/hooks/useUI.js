import {useContext} from "react";
import {UIContext} from "../context/UIContext.js";

export const useUI = () => {
    return useContext(UIContext);
};
