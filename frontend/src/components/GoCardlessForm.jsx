import axios from "axios";
import { useState, useRef } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import { FiExternalLink } from "react-icons/fi";

const GoCardlessForm = (props) => {
    const { isOpen, setIsOpen, gocardless_id, setGocardless_id } = props;

    // const [gocardless_key, setGocardless_key] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const gocardless_id = formData.get("gocardless_id");
        const gocardless_key = formData.get("gocardless_key");

        try {
            // verify creating gocardlessToken with secret
            await axios.post(
                `${apiUrl}/gocardless/create-access-token`,
                {
                    gocardless_id,
                    gocardless_key,
                },
                { withCredentials: true }
            );

            // save secret on user in db
            await axios.post(
                `${apiUrl}/user/addgocardless`,
                {
                    gocardless_id,
                    gocardless_key,
                },
                { withCredentials: true }
            );
            setGocardless_id(gocardless_id);
            setIsOpen(false);
        } catch (error) {
            setError(
                error.response?.data?.error || "Error in GoCardless process"
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
                        autoComplete="off"
                        id="gocardless_id"
                        type="text"
                        name="gocardless_id"
                        placeholder="Gocardless ID"
                        required
                    />
                </div>
                <div>
                    <label>Key</label>
                    <input
                        id="gocardless_key"
                        autoComplete="off"
                        type="text"
                        name="gocardless_key"
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
                    {gocardless_id ? "Update" : "Create"}
                </button>
                {error && <p style={{ color: "#c92020" }}>{error}</p>}
            </form>
            <a
                className="icon-button"
                href="https://bankaccountdata.gocardless.com/user-secrets/"
                target="_blank"
            >
                GoCardless web
                <FiExternalLink />
            </a>
        </dialog>
    );
};

export default GoCardlessForm;
