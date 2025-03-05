import { Navigate } from "react-router-dom";

// TODO aki no se comprueba nada!!! solo que exista el token CORREGIR
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
