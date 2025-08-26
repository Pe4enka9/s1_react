import play from '../img/icons/play.svg';

export default function MenuItem({img, title, bgImg}) {
    return (
        <div className="menu-item" style={{background: `url(${bgImg}) no-repeat center / cover`}}>
            <div className="top">
                <div className="icon">
                    <img src={img} alt="Иконка"/>
                </div>
            </div>

            <div className="bottom">
                <h6>{title}</h6>

                <div className="play">
                    <img src={play} alt="Вперед"/>
                </div>
            </div>
        </div>
    )
}