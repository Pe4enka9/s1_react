import TabItem from "./TabItem.jsx";
import {useState} from "react";
import SliderTab from "./Tabs/Slider/SliderTab.jsx";
import SlideTab from "./Tabs/Slide/SlideTab.jsx";
import MenuTab from "./Tabs/Menu/MenuTab.jsx";
import BookingTab from "./Tabs/Booking/BookingTab.jsx";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('bookings');

    return (
        <>
            <div
                className="bg-main text-text-secondary font-semibold border border-my-border rounded-xl p-2 flex gap-2 mb-5"
            >
                <TabItem
                    onClick={() => setActiveTab('bookings')}
                    isActive={activeTab === 'bookings'}
                >
                    Бронирования
                </TabItem>

                <TabItem
                    onClick={() => setActiveTab('slider')}
                    isActive={activeTab === 'slider'}
                >
                    Слайдер
                </TabItem>

                <TabItem
                    onClick={() => setActiveTab('menu')}
                    isActive={activeTab === 'menu'}
                >
                    Меню
                </TabItem>

                <TabItem
                    onClick={() => setActiveTab('slides')}
                    isActive={activeTab === 'slides'}
                >
                    Слайды меню
                </TabItem>

                {/*<TabItem*/}
                {/*    onClick={() => setActiveTab('admins')}*/}
                {/*    isActive={activeTab === 'admins'}*/}
                {/*>*/}
                {/*    Администраторы*/}
                {/*</TabItem>*/}
            </div>

            {activeTab === 'bookings' && (
                <BookingTab/>
            )}

            {activeTab === 'slider' && (
                <SliderTab/>
            )}

            {activeTab === 'menu' && (
                <MenuTab/>
            )}

            {activeTab === 'slides' && (
                <SlideTab/>
            )}
        </>
    );
}
