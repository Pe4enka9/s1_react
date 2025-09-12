export default function Card({
                                 bgImg,
                                 number,
                                 title,
                                 description,
                                 button = false,
                                 setIsActive = () => {}
                             }) {
    const handleClick = () => {
        setIsActive({register: false, login: false, booking: true});
    };

    return (
        <div className="card">
            <div className="card-bg"
                 style={{background: `linear-gradient(rgba(0, 0 ,0 , .3)), url(${bgImg}) no-repeat center / cover`}}></div>

            <h1 className="card-number">{number}</h1>

            <div className="card-content">
                <h2>{title}</h2>
                <p>{description}</p>
                {button && <button type="button" className="btn cta" onClick={handleClick}>Записаться</button>}
            </div>
        </div>
    )
}