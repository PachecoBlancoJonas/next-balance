// frontend/src/components/UserForm.jsx
import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const UserForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const passwordRef = useRef(null);
    const repeatPasswordRef = useRef(null);

    // Toggle password
    const tooglePassword = (e) => {
        if (
            passwordRef.current.type === "password" &&
            repeatPasswordRef.current.type === "password"
        ) {
            passwordRef.current.type = "text";
            repeatPasswordRef.current.type = "text";
            e.target.textContent = "🙈"; // Cambia el icono
        } else {
            passwordRef.current.type = "password";
            repeatPasswordRef.current.type = "password";
            e.target.textContent = "👁️";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check password
        if (password !== repeatPassword) {
            setErrorMessage("Password does not match.");
            passwordRef.current.value = "";
            repeatPasswordRef.current.value = "";
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/user/create`, {
                email,
                password,
            });
            // localStorage.setItem("token", response.data.token);
            console.log(response.data.message); // debug

            navigate("/");
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error || "Error al crear usuario"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Repeat password:</label>
                <input
                    id="repeatPassword"
                    type="password"
                    ref={repeatPasswordRef}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />
            </div>
                <button
                    type="button"
                    id="togglePassword"
                    onClick={tooglePassword}
                >
                    👁️
                </button>
            <button type="submit">Create</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
};

export default UserForm;
