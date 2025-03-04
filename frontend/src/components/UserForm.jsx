// frontend/src/components/UserForm.jsx
import axios from "axios";
import React, { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const UserForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const passwordInput = document.getElementById("password");
    const repeatPasswordInput = document.getElementById("repeatPassword");

    // Toggle password
    const tooglePassword = (e) => {
        if (
            passwordInput.type === "password" &&
            repeatPasswordInput.type === "password"
        ) {
            passwordInput.type = "text";
            repeatPasswordInput.type = "text";
            e.target.textContent = "🙈"; // Cambia el icono
        } else {
            passwordInput.type = "password";
            repeatPasswordInput.type = "password";
            e.target.textContent = "👁️";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check password
        if (password !== repeatPassword) {
            setErrorMessage("Password does not match.");
            passwordInput.value = "";
            repeatPasswordInput.value = "";
            return;
        }

        axios
            .post(`${apiUrl}/users`, { email, password })
            .then((response) => {
                console.log("User created:", response.data);
                // You could clear the form or update the user list here
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    // console.error("Server error:", error.response.data.error); // Muestra solo el mensaje del servidor
                    setErrorMessage(error.response.data.error); // Show error message in UI
                } else {
                    console.error("Unexpected error:", error);
                }
            });
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    id="togglePassword"
                    onClick={tooglePassword}
                >
                    👁️
                </button>
            </div>
            <div>
                <label>Repeat password:</label>
                <input
                    id="repeatPassword"
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
};

export default UserForm;
