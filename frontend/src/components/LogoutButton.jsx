import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext.jsx";
import { CiLogout } from "react-icons/ci";

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <a onClick={handleLogout}>
            Logout <CiLogout className="logout-icon" />
        </a>
    );
};

export default LogoutButton;
