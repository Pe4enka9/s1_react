import fire from '../img/icons/fire.svg';

export default function Banner() {
    return (
        <section className="banner">
            <div className="content">
                <div className="type">
                    <img src={fire} alt="Огонь"/>
                    <span>Акция</span>
                </div>

                <div className="text">
                    <h4>Скидка 30%</h4>
                    <h6>На все симуляторы до воскресенья</h6>
                </div>

                <button type="button" className="btn">Записаться</button>
            </div>

            <div className="indicators">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </section>
    )
}