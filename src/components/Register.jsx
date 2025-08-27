import {useState} from "react";
import {IMaskInput} from "react-imask";

export default function Register() {
    const [formData, setFormData] = useState({
        phone_number: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handlePhoneAccept = (value) => {
        setFormData({...formData, phone_number: value});
    };

    const preparePhoneValue = (appended, masked) => {
        if ((appended === '8' || appended.startsWith('8')) && masked.value === '') {
            return '' + appended.substring(1);
        }
        return appended;
    };

    return (
        <form>
            <div className="field">
                <IMaskInput
                    mask="+{7} (000) 000-00-00"
                    name="phone_number"
                    id="phone_number"
                    placeholder="+7 (000) 000-00-00"
                    value={formData.phone_number}
                    onAccept={handlePhoneAccept}
                    prepare={preparePhoneValue}
                    autoComplete="phone phone_number telephone"
                />
            </div>

            <div className="field">
                <label htmlFor="first_name">Имя</label>
                <input type="text" name="first_name" id="first_name" placeholder="Введите ваше имя"
                       autoComplete="name first_name" value={formData.first_name} onChange={handleChange}/>
            </div>

            <div className="field">
                <label htmlFor="last_name">Фамилия</label>
                <input type="text" name="last_name" id="last_name" placeholder="Введите вашу фамилию"
                       autoComplete="last_name surname" value={formData.last_name} onChange={handleChange}/>
            </div>

            <div className="field">
                <label htmlFor="password">Пароль</label>
                <input type="password" name="password" id="password" placeholder="Введите пароль" autoComplete="off"
                       value={formData.password} onChange={handleChange}/>
            </div>

            <div className="field">
                <label htmlFor="password_confirmation">Повтор пароля</label>
                <input type="password" name="password_confirmation" id="password_confirmation"
                       placeholder="Повторите пароль" autoComplete="off" value={formData.password_confirmation}
                       onChange={handleChange}/>
            </div>

            <button type="submit" className="btn">Зарегистрироваться</button>
        </form>
    )
}