import { useAuth } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";
import SettingsButton from "./SettingsButton.jsx";


const Header = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <header>
            {user ? (
                <>
                    <nav>
                        <Link to="/">NEXT_BALANCE</Link>
                        <Link to="/transactions">NEXT_TRANSACTIONS</Link>
                        <Link to="/list">User list</Link>
                        <div className="rigth-links">
                            <span>Welcome, {user.email}</span>
                            <LogoutButton />
                            <SettingsButton />
                        </div>
                    </nav>
                </>
            ) : (
                <>
                    <nav>
                        <Link to="/login">Login</Link>
                        <Link to="/create-user">Create new user</Link>
                    </nav>
                </>
            )}
        </header>
    );
};

export default Header;
