import { useState, useEffect } from "react";
import axios from "axios";
import GoCardlessForm from "./GoCardlessForm";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import { IoMdAddCircle } from "react-icons/io";

function Settings() {
    const [gocardless_id, setGocardless_id] = useState("");
    const [isOpenSecret, setIsOpenSecret] = useState(false);
    const [isOpenBank, setIsOpenBank] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkGocardless = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/gocardless`, {
                    withCredentials: true,
                });

                setGocardless_id(response.data.gocardless_id);
            } catch (error) {
                setGocardless_id(undefined);
            } finally {
                setLoading(false);
            }
        };

        checkGocardless();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <GoCardlessForm
                isOpenSecret={isOpenSecret}
                setIsOpenSecret={setIsOpenSecret}
                gocardless_id={gocardless_id}
                setGocardless_id={setGocardless_id}
            />
            <h1>Settings</h1>
            <h2>GoCardless user:</h2>
            <p>SecretID</p>
            {/* short-circuit evaluation */}
            <p>{gocardless_id && gocardless_id}</p>
            <p>
                <button
                    className="icon-button"
                    onClick={() => setIsOpenSecret(true)}
                >
                    <IoMdAddCircle /> {gocardless_id ? "Update" : "Create"}
                </button>
            </p>
            {gocardless_id ? <h2>Bank accounts:</h2> : ""}
            <p>
                <button
                    className="icon-button"
                    onClick={() => setIsOpenBank(true)}
                >
                    <IoMdAddCircle /> Add bank account
                </button>
            </p>
        </>
    );
}

export default Settings;
