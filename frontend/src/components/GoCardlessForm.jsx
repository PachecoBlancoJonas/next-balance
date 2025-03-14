import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const GoCardlessForm = (props) => {
    const { isOpen, setIsOpen, gocardlessID, setGocardlessID } = props;

    // const [gocardless_id, setGocardless_id] = useState(null);
    const [gocardless_key, setGocardless_key] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${apiUrl}/user/addgocardless`,
                {
                    gocardlessID,
                    gocardless_key,
                },
                { withCredentials: true }
            );
            setIsOpen(false);
        } catch (error) {
            setError(
                error.response?.data?.error || "Create GoCardless secret error"
            );
        }
    };

    return (
        <dialog className="modal" open={isOpen}>
            <button onClick={() => setIsOpen(false)}>Cerrar</button>
            <h3>User Secret</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID</label>
                    <input
                        autoFocus
                        id="gocardlessID"
                        type="text"
                        value={gocardlessID}
                        onChange={(e) => setGocardlessID(e.target.value)}
                        placeholder="Gocardless ID"
                        required
                    />
                </div>
                <div>
                    <label>Key</label>
                    <input
                        id="gocardless_key"
                        type="text"
                        value={gocardless_key}
                        onChange={(e) => setGocardless_key(e.target.value)}
                        placeholder="Gocardless Key"
                        required
                    />
                </div>
                <p>
                    This is a secret key for authentication. It will not be
                    displayed later anywhere on the dashboard or website. Make
                    sure you store it somewhere safe and don't share it
                </p>
                <button type="submit">
                    {gocardlessID ? "Update" : "Create"}
                </button>
                {error && <p style={{ color: "#c92020" }}>{error}</p>}
            </form>
            <a
                href="https://bankaccountdata.gocardless.com/user-secrets/"
                target="_blank"
            >
                GoCardless web
            </a>
        </dialog>
    );
};

export default GoCardlessForm;
