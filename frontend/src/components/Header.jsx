import React from "react";
import { useAuth } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";

const Header = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <header>
            {user ? (
                <>
                    <span>Welcome, {user.email}</span>
                    <LogoutButton />
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/list">Users list</Link>
                    </nav>
                </>
            ) : (
                <>
                    <nav>
                        <Link to="/create-user">Create new user</Link>
                        <Link to="/login">Login</Link>
                    </nav>
                </>
            )}
        </header>
    );
};

export default Header;
