import axios from "axios";
import { useState, useRef } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import { FiExternalLink } from "react-icons/fi";

const BankForm = (props) => {
    const { isOpenBank, setIsOpenBank } = props;

    // const [gocardless_key, setGocardless_key] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get New GoCardless Secret info from the Form

        try {
            // try create gocardlessToken with new GoCardless Secret before safe in the DB
            await axios.post(
                `${apiUrl}/gocardless/create-new-access-token`,
                {
                    gocardless_id,
                    gocardless_key,
                },
                { withCredentials: true }
            );

            // save GoCardless Secret in the user table in the DB
            await axios.post(
                `${apiUrl}/user/addgocardless`,
                {
                    gocardless_id,
                    gocardless_key,
                },
                { withCredentials: true }
            );
            setIsOpenBank(false);
        } catch (error) {
            setError(
                error.response?.data?.error || "Error in GoCardless process"
            );
        }
    };

    return (
        <dialog className="modal" open={isOpenBank}>
            <button onClick={() => setIsOpenBank(false)}>Cerrar</button>
            <h3>New Bank</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Country</label>
                    <select
                        autoFocus
                        autoComplete="off"
                        id="country"
                        type="select"
                        name="country"
                        placeholder="Country"
                        required
                    >
                        <option>Country</option>
                        <option>Country</option>
                        <option>Country</option>
                    </select>
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
                <button type="submit">"Create"</button>
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

export default BankForm;
