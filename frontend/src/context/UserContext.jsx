// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Verifica si hay una sesión activa
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/me`, {
                    withCredentials: true,
                }); // Endpoint que devuelve info del usuario autenticado
                setUser(response.data);
            } catch (error) {
                console.error("No hay sesión activa");
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);

