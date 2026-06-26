import {Form, Label, SearchField, Spinner} from "@heroui/react";
import {useEffect, useState} from "react";
import api from "../../../../api/api.js";
import TabCard from "../Cards/TabCard.jsx";
import UserEditForm from "./Forms/UserEditForm.jsx";
import {Controller, useForm, useWatch} from "react-hook-form";

export default function UserTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const {control} = useForm();
    const searchValue = useWatch({
        control,
        name: 'search',
        defaultValue: '',
    });

    const useDebounce = (value, delay) => {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const timer = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(timer);
        }, [delay, value]);

        return debouncedValue;
    };

    const debouncedSearch = useDebounce(searchValue, 500);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const params = {};

                if (debouncedSearch) {
                    params.phone = debouncedSearch;
                }

                const {data} = await api.get('/users', {params});

                setUsers(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [debouncedSearch]);

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="text-white font-semibold">Пользователи</div>
                </div>

                <Form>
                    <Controller
                        control={control}
                        name="search"
                        defaultValue=""
                        render={({field}) => (
                            <SearchField
                                className="w-96"
                                {...field}
                            >
                                <Label>Поиск пользователей</Label>

                                <SearchField.Group>
                                    <SearchField.SearchIcon/>
                                    <SearchField.Input placeholder="Введите номер телефона"/>
                                    <SearchField.ClearButton/>
                                </SearchField.Group>
                            </SearchField>
                        )}
                    />
                </Form>

                {loading && (
                    <div className="flex justify-center items-center h-screen">
                        <Spinner size="xl"/>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {users.map(user => (
                        <TabCard
                            key={user.id}
                            item={user}
                            img={user.avatar}
                            onEdit={<UserEditForm setUsers={setUsers} user={user}/>}
                        >
                            <div className="text-white">
                                <div className="font-medium">{user.phone}</div>

                                <div className="text-text-secondary text-sm">
                                    {user.comment}
                                </div>
                            </div>
                        </TabCard>
                    ))}
                </div>
            </div>
        </>
    );
}
