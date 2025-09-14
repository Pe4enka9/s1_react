/** @type {string} */
import checkMark from '../img/icons/check-mark.svg';
/** @type {string} */
import crossCircle from '../img/icons/cross-circle.svg';

export default function Notification({text, failed = false, active = false}) {

    return (
        <div className={`notification ${active ? 'active' : ''}`}>
            <img src={failed ? crossCircle : checkMark} alt="Галочка"/>
            {text}
        </div>
    )
}