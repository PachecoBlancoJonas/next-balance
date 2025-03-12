import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const GoCardlessForm = () => {
    const [gocardless_id, setGocardless_id] = useState("");
    const [gocardless_key, setGocardless_key] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${apiUrl}/user/addgocardless`,
                {
                    gocardless_id,
                    gocardless_key,
                },
                { withCredentials: true }
            );
            navigate("/settings");
        } catch (error) {
            setError(
                error.response?.data?.error || "Create GoCardless secret error"
            );
        }
    };

    return (
        <div className="create_secret">
            <h1>New Cardless Secret:</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Secret ID:</label>
                    <input
                        autoFocus
                        id="gocardless_id"
                        type="password"
                        value={gocardless_id}
                        onChange={(e) => setGocardless_id(e.target.value)}
                        placeholder="Gocardless ID"
                        requiered
                    />
                </div>
                <div>
                    <label>Secret Key:</label>
                    <input
                        id="gocardless_key"
                        type="password"
                        value={gocardless_key}
                        onChange={(e) => setGocardless_key(e.target.value)}
                        placeholder="Gocardless Key"
                        requiered
                    />
                </div>
                <button type="submit">Create GoCardless Secret</button>
                {error && <p style={{ color: "#c92020" }}>{error}</p>}
            </form>
        </div>
    );
};

export default GoCardlessForm;
