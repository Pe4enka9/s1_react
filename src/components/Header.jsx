import Logo from "./Logo.jsx";
import Nav from "./Nav.jsx";

export default function Header() {
    return (
        <header className="bg-main/85 backdrop-blur-xs border-b border-b-primary/40 sticky top-0 z-40 mb-5">
            <div className="container mx-auto flex justify-between items-center py-2">
                <Logo/>
                <Nav/>
            </div>
        </header>
    );
}
