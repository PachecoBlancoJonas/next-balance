import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/UserContext.jsx";
const apiUrl = import.meta.env.VITE_API_URL;

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);
            navigate("/"); // Redirigir a la página principal

            // Redirigir al usuario o hacer alguna otra acción después del login
        } catch (error) {            
            setError(error.message || "Error en el login");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default LoginForm;
