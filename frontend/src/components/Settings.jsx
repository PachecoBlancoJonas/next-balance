import { useState, useEffect } from "react";
import axios from "axios";
import GoCardlessForm from "./GoCardlessForm";
const apiUrl = import.meta.env.VITE_API_URL;

function Settings() {
    const [gocardlessID, setGocardlessID] = useState(null);
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
            {gocardlessID ? (
                <>
                    <h1>Settings</h1>
                    <h2>GoCardless user:</h2>
                    <p>GoCardless SecretID: {gocardlessID}</p>
                    <p>GoCardless SecretKey:</p>
                    <h2>Bank accounts:</h2>
                </>
            ) : (
                <GoCardlessForm />
            )}
        </>
    );
}

export default Settings;
