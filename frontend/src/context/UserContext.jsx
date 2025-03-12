import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const UserContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/me`, {
                    withCredentials: true,
                });
                
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(
                `${apiUrl}/user/login`,
                { email, password },
                { withCredentials: true }
            );
            
            setUser(response.data);
        } catch (error) {
            throw new Error(error.response?.data?.error || "Login error");
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${apiUrl}/user/logout`, { withCredentials: true });

            setUser(null);
        } catch (error) {
            throw new Error(error.response?.data?.error || "Login error");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
