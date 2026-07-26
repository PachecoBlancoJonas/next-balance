import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/UserContext.jsx";
import { Eye, EyeOff } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const NewUserForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setErrorMessage("Passwords do not match.");
            setPassword("");
            setRepeatPassword("");
            return;
        }
        try {
            await axios.post(
                `${apiUrl}/user/create`,
                { email, password },
                { withCredentials: true }
            );
            await login(email, password);
            navigate("/");
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Could not create account");
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
                    <p className="text-sm text-muted-foreground">
                        Start managing your finances
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium leading-none">
                            Email
                        </label>
                        <input
                            autoFocus
                            type="email"
                            value={email}
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium leading-none">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={inputClass + " pr-10"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium leading-none">
                            Confirm password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-destructive">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Create account
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default NewUserForm;
