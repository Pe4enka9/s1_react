/** @type {string} */
import play from '../img/icons/play.svg';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function MenuItem({img, title, bgImg}) {
    const navigate = useNavigate();

    const [isActive, setIsActive] = useState(false);
    const [isAnimate, setIsAnimate] = useState(false);

    const handleClick = () => {
        setIsActive(prev => !prev);

        const timeout = setTimeout(() =>
                navigate('/show'),
            1000);

        return () => clearTimeout(timeout);
    };

    useEffect(() => {
        const interval = setInterval(() =>
                setIsAnimate(prev => !prev),
            5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`menu-item ${isActive ? 'active' : ''}`}
             style={{background: `url(${bgImg}) no-repeat center / cover`}}>
            <div className="top">
                <div className="icon">
                    <img src={img} alt="Иконка" loading="lazy"/>
                </div>
            </div>

            <div className="bottom">
                <h6>{title}</h6>

                <button type="button" className={`play ${isAnimate ? 'animate' : ''}`} onClick={handleClick}>
                    <img src={play} alt="Вперед" className={isAnimate ? 'animate' : ''}/>
                </button>
            </div>
        </div>
    )
}