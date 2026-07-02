import {Form, Label, ListBox, Select, Spinner, TextField} from "@heroui/react";
import {useContext, useEffect, useState} from "react";
import api from "../../../../api/api.js";
import TabCard from "../Cards/TabCard.jsx";
import {Controller, useForm, useWatch} from "react-hook-form";
import {UserContext} from "../../../../context/UserContext.js";
import AdminEditForm from "./Forms/AdminEditForm.jsx";

export default function AdminTab() {
    const {user} = useContext(UserContext);

    const [admins, setAdmins] = useState([]);
    const [currentAdmin, setCurrentAdmin] = useState({});
    const [loading, setLoading] = useState(true);

    const {control} = useForm();
    const adminId = useWatch({
        control,
        name: 'admin',
        defaultValue: '',
    });

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const {data} = await api.get('/admins/current');

                setCurrentAdmin(data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchAdmin();
    }, []);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setLoading(true);

                const {data} = await api.get('/admins');

                setAdmins(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    useEffect(() => {
        const fetchCurrentAdmin = async () => {
            try {
                const {data} = await api.post(`/admins/current`, {
                    admin: adminId,
                });

                setCurrentAdmin(data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchCurrentAdmin();
    }, [adminId]);

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="text-white font-semibold">Администраторы</div>

                    <Form>
                        <Controller
                            control={control}
                            name="admin"
                            defaultValue=""
                            render={({field}) => (
                                <TextField>
                                    <Label>Текущий администратор</Label>

                                    <Select
                                        className="w-96"
                                        placeholder="Выберите текущего администратора"
                                        {...field}
                                    >
                                        <Select.Trigger>
                                            <Select.Value/>
                                            <Select.Indicator/>
                                        </Select.Trigger>

                                        <Select.Popover>
                                            <ListBox>
                                                {admins.map(admin => (
                                                    <ListBox.Item key={admin.id} id={admin.id} textValue={admin.name}>
                                                        {admin.name}
                                                        <ListBox.ItemIndicator/>
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </TextField>
                            )}
                        />
                    </Form>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-screen">
                        <Spinner size="xl"/>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {admins.map(admin => (
                        <TabCard
                            key={admin.id}
                            item={admin}
                            img={admin.avatar}
                            onEdit={
                                user.role === 'owner' &&
                                <AdminEditForm admin={admin} setAdmins={setAdmins}/>
                            }
                        >
                            <div className="text-white">
                                <div className="font-medium">{admin.phone}</div>
                            </div>
                        </TabCard>
                    ))}
                </div>
            </div>
        </>
    )
        ;
}
