import {Link} from "react-router-dom";
import Navigation from "./Navigation.jsx";

export default function Header({isActive, setIsActive, setStep}) {
    const handleClick = () => {
        setIsActive({register: false, login: false});
    };

    return (
        <header>
            <div className="header-wrapper">
                <Link to="/" className="logo" onClick={handleClick}>
                    <span>S</span>
                    <span>1</span>
                </Link>

                <Navigation isActive={isActive} setIsActive={setIsActive} setStep={setStep}/>
            </div>
        </header>
    )
}