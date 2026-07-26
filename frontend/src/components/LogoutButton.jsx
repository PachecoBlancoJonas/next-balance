import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext.jsx";
import { LogOut } from "lucide-react";

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
        <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <LogOut size={15} />
            <span className="hidden sm:block">Logout</span>
        </button>
    );
};

export default LogoutButton;
