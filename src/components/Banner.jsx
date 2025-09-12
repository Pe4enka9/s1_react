export default function Banner({
                                   setIsActive,
                                   bgImg,
                                   icon = '',
                                   iconText = '',
                                   title = '',
                                   description = '',
                                   button = 'Записаться'
                               }) {
    const handleClick = () => {
        document.body.style.overflowY = 'hidden';
        setIsActive({register: false, login: false, booking: true});
    };

    return (
        <div className="banner" style={{background: `url(${bgImg}) no-repeat center / cover`}}>
            <div className="content">
                {icon || iconText ? (
                    <div className="type">
                        <img src={icon} alt={iconText}/>
                        <span>{iconText}</span>
                    </div>
                ) : null}

                {title || description ? (
                    <div className="text">
                        <h4>{title}</h4>
                        <h6>{description}</h6>
                    </div>
                ) : null}

                <button type="button" className="btn cta" onClick={handleClick}>{button}</button>
            </div>
        </div>
    )
}