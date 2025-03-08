import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext.jsx";
const apiUrl = import.meta.env.VITE_API_URL;

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            // Redirigir a la página de login o home
            navigate("/login");
        } catch (error) {
            console.error("Error en el logout:", error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
