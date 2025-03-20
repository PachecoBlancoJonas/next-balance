import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import { useAuth } from "../context/UserContext.jsx";

const NewUserForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const passwordRef = useRef(null);
    const repeatPasswordRef = useRef(null);

    const { login } = useAuth();

    const tooglePassword = (e) => {
        if (
            passwordRef.current.type === "password" &&
            repeatPasswordRef.current.type === "password"
        ) {
            passwordRef.current.type = "text";
            repeatPasswordRef.current.type = "text";
            e.target.textContent = "🙈";
        } else {
            passwordRef.current.type = "password";
            repeatPasswordRef.current.type = "password";
            e.target.textContent = "👁️";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setErrorMessage("Password does not match.");
            passwordRef.current.value = "";
            repeatPasswordRef.current.value = "";
            return;
        }
        try {
            await axios.post(
                `${apiUrl}/user/create`,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            await login(email, password);
            navigate("/");
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Create user error");
        }
    };

    return (
        <div className="userForm">
            <h1>Create new user</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        autoFocus
                        type="email"
                        value={email}
                        placeholder="JohnDoe@domain.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
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
                        placeholder="Repeat Password"
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
                <button type="submit">Create user</button>
                {errorMessage && (
                    <p style={{ color: "#c92020" }}>{errorMessage}</p>
                )}
            </form>
        </div>
    );
};

export default NewUserForm;
