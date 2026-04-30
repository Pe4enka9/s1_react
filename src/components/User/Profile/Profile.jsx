import {useContext, useEffect, useState} from "react";
import UserDataItem from "./UserDataItem.jsx";
import {UserContext} from "../../../context/UserContext.js";
import profileIcon from '../../../icons/profile.svg';
import phoneIcon from '../../../icons/phone.svg';
import OutlineButton from "../../Button/OutlineButton.jsx";
import ProfileButton from "../../Button/ProfileButton.jsx";
import Status from "./Status.jsx";
import client from "../../../api/client.js";
import ModalForm from "../../Forms/Base/ModalForm.jsx";
import PhoneInput from "../../Input/PhoneInput.jsx";
import MyInput from "../../Input/MyInput.jsx";
import {useLockBodyScroll} from "../../../hooks/useLockBodyScroll.js";
import Loader from "../../Loader.jsx";
import calendarIcon from '../../../icons/calendar.svg';
import PrimaryButton from "../../Button/PrimaryButton.jsx";

const validators = {
    phone: (value) => {
        if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value.trim())) {
            return 'Введите корректный номер телефона.';
        }
    },
    firstName: (value) => {
        if (!/^[a-zA-Zа-яА-ЯёЁ]{2,}([-'][a-zA-Zа-яА-ЯёЁ]{2,})*$/.test(value.trim())) {
            return 'Имя обязательно.';
        }
    },
    lastName: (value) => {
        if (!/^[a-zA-Zа-яА-ЯёЁ]{2,}([-'][a-zA-Zа-яА-ЯёЁ]{2,})*$/.test(value.trim())) {
            return 'Фамилия обязательна.';
        }
    },
};

export default function Profile() {
    const {user, setUser} = useContext(UserContext);

    const [bookings, setBookings] = useState([]);
    const [activeStatus, setActiveStatus] = useState('all');
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        first_name: '',
        last_name: '',
    });
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useLockBodyScroll(isOpenEdit);

    const statusLabels = {
        all: 'Все',
        pending: 'Ожидание',
        success: 'Подтверждено',
        cancelled: 'Отменено',
        finished: 'Завершено',
    };

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({phone: user.phone, first_name: user.first_name, last_name: user.last_name});
        }
    }, [user]);

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                setBookingLoading(true);

                const params = {
                    page: currentPage,
                    ...(activeStatus !== 'all' && {status: activeStatus})
                };

                const {data} = await client.get('/user/bookings', {params});

                setBookings(data.data);
                setLastPage(data.pagination.last_page);
            } catch (e) {
                console.log(e);
            } finally {
                setBookingLoading(false);
            }
        };

        fetchUserBookings();
    }, [activeStatus, currentPage]);

    const setActiveFilter = (status) => {
        setCurrentPage(1);
        setActiveStatus(status);
    }

    const prevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const nextPage = () => setCurrentPage(prev => Math.min(lastPage, prev + 1));
    const openEditForm = () => setIsOpenEdit(true);

    const handleSubmit = async () => {
        try {
            setUserLoading(true);
            setErrors({});

            const {data} = await client.patch(`/users/${user.id}`, formData);

            setUser(data);
            setIsOpenEdit(false);
        } catch (e) {
            const errors = e.response.data.errors;

            setErrors(errors);
        } finally {
            setUserLoading(false);
        }
    };

    if (!user) {
        return <Loader page/>
    }

    return (
        <>
            <ModalForm
                title="Редактировать профиль"
                button="Сохранить"
                isOpen={isOpenEdit}
                setIsOpen={setIsOpenEdit}
                onSubmit={handleSubmit}
                loading={userLoading}
            >
                <PhoneInput
                    id="users_edit_phone"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.phone}
                />

                <MyInput
                    label="Имя"
                    type="text"
                    name="first_name"
                    id="users_edit_first_name"
                    placeholder="Иван"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.firstName}
                />

                <MyInput
                    label="Фамилия"
                    type="text"
                    name="last_name"
                    id="users_edit_last_name"
                    placeholder="Иванов"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    validate={validators.lastName}
                />
            </ModalForm>

            <div className="grid grid-cols-4 gap-10">
                <div className="col-span-1">
                    <div className="bg-main border border-my-border rounded-lg flex flex-col overflow-hidden">
                        <div
                            className="flex flex-col items-center gap-2.5 bg-linear-to-r from-secondary to-primary p-6">
                            <div className="w-24 h-24 bg-white/20 rounded-full p-5 border-2 border-white/40">
                                <img src={profileIcon} alt=""/>
                            </div>

                            <div className="text-white text-2xl font-bold">{user.first_name} {user.last_name}</div>
                        </div>

                        <div className="flex flex-col gap-5 p-6">
                            <UserDataItem
                                icon={phoneIcon}
                                label="Телефон"
                                value={user.phone}
                            />

                            <UserDataItem
                                icon={profileIcon}
                                label="Имя"
                                value={user.first_name}
                            />

                            <UserDataItem
                                icon={profileIcon}
                                label="Фамилия"
                                value={user.last_name}
                            />

                            <OutlineButton
                                onClick={openEditForm}
                            >
                                Редактировать профиль
                            </OutlineButton>
                        </div>
                    </div>
                </div>

                <div className="col-span-3 flex flex-col gap-5">
                    <div className="text-white text-2xl font-semibold">Мои бронирования</div>

                    <div className="flex gap-3">
                        {Object.keys(statusLabels).map(key => (
                            <ProfileButton
                                key={key}
                                isActive={activeStatus === key}
                                onClick={() => setActiveFilter(key)}
                            >
                                {statusLabels[key]}
                            </ProfileButton>
                        ))}
                    </div>

                    {bookingLoading ? (
                        <Loader center className="h-full"/>
                    ) : (
                        bookings.length > 0 ? (
                            <>
                                <div className="border border-my-border rounded-xl overflow-hidden">
                                    <table className="w-full">
                                        <thead
                                            className="bg-[#262626] border-b border-my-border text-text-secondary text-sm uppercase text-left"
                                        >
                                        <tr>
                                            <th className="p-3">Телефон</th>
                                            <th className="p-3">Дата и время</th>
                                            <th className="p-3">Часы</th>
                                            <th className="p-3">Человек</th>
                                            <th className="p-3">Дата заявки</th>
                                            <th className="p-3">Статус</th>
                                        </tr>
                                        </thead>

                                        <tbody className="bg-main text-white">
                                        {bookings.map(booking => (
                                            <tr className="border-b border-[#75757533] last:border-b-0"
                                                key={booking.id}>
                                                <td className="p-3 font-medium">{booking.phone}</td>

                                                <td className="p-3">
                                                    <div>{booking.date_formatted}</div>
                                                    <div
                                                        className="text-text-secondary text-sm">{booking.time_formatted}</div>
                                                </td>

                                                <td className="p-3">{booking.duration} ч</td>
                                                <td className="p-3">{booking.peoples}</td>
                                                <td className="p-3">{booking.created_at_date_formatted}</td>

                                                <td className="p-3">
                                                    <Status
                                                        status={booking.status}>{statusLabels[booking.status]}</Status>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {lastPage !== 1 && (
                                    <div className="flex justify-between items-center mt-auto">
                                        <PrimaryButton
                                            onClick={prevPage}
                                            disabled={currentPage === 1}
                                            className="flex-1"
                                        >
                                            Назад
                                        </PrimaryButton>

                                        <span className="text-center text-text-secondary flex-5">
                                        Страница {currentPage} из {lastPage}
                                    </span>

                                        <PrimaryButton
                                            onClick={nextPage}
                                            disabled={currentPage === lastPage}
                                            className="flex-1"
                                        >
                                            Вперед
                                        </PrimaryButton>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1 py-12 text-text-secondary">
                                <div className="w-20 h-20">
                                    <img src={calendarIcon} alt=""/>
                                </div>

                                <p className="text-lg">Бронирований пока нет</p>
                                <p className="text-sm">Здесь будет история ваших посещений</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
