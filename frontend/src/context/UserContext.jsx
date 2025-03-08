import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Custom hook para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};

export const UserContext = ({ children }) => {
    const [user, setUser] = useState(null); // Estado para el usuario
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    // Verifica si hay un usuario al inicio (cuando se carga el componente)
    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/me`, {
                    withCredentials: true,
                });
                setUser(response.data); // Si el token es válido, se obtiene el usuario
            } catch (error) {
                setUser(null); // Si no se puede obtener el usuario, lo dejamos en null
            } finally {
                setLoading(false); // Se termina de cargar
            }
        };

        checkUser(); // Llamamos a la función al montar el componente
    }, []);

    // Función para iniciar sesión (se asume que ya tienes un backend que valida el login)
    const login = async (email, password) => {
        try {
            const response = await axios.post(
                `${apiUrl}/user/login`,
                { email, password },
                { withCredentials: true }
            );
            setUser(response.data);
        } catch (error) {
            throw new Error(error.response?.data?.error || "Error en el login");
        }
    };

    // Función para cerrar sesión (elimina la cookie)
    const logout = async () => {
        try {
            await axios.get(`${apiUrl}/user/logout`, { withCredentials: true });

            setUser(null);
        } catch (error) {
            throw new Error(error.response?.data?.error || "Error en el login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
