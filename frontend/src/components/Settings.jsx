import { useState, useEffect } from "react";
import axios from "axios";
import GoCardlessForm from "./GoCardlessForm";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import { IoMdAddCircle } from "react-icons/io";

function Settings() {
    const [gocardlessID, setGocardlessID] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkGocardless = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/gocardless`, {
                    withCredentials: true,
                });

                setGocardlessID(response.data[0].gocardless_id);
            } catch (error) {
                setGocardlessID(null);
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
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gocardlessID={gocardlessID}
                setGocardlessID={setGocardlessID}
            />
            <h1>Settings</h1>
            <h2>GoCardless user:</h2>
            <p>SecretID</p>
            <p>{gocardlessID && gocardlessID}</p> //short-circuit evaluation
            <p>
                <button className="icon-button" onClick={() => setIsOpen(true)}>
                    <IoMdAddCircle /> {gocardlessID ? "Update" : "Create"}
                </button>
            </p>
            {gocardlessID ? <h2>Bank accounts:</h2> : ""}
        </>
    );
}

export default Settings;
