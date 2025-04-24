import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const AccountCard = () => {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/user/accounts`, {
                    withCredentials: true,
                });
                setAccounts(data);
            } catch (error) {
                setError("Failed to fetch accounts.");
            }
        };
        fetchAccounts();
    }, []);
    return (
        <div>
            <h3>Connected Bank Accounts</h3>
            {error && <p style={{ color: "#c92020" }}>{error}</p>}
            {accounts.length === 0 ? (
                <p>No accounts found.</p>
            ) : (
                accounts.map((account) => (
                    <div key={account.id} className="bank-card">
                        <p>
                            <strong>IBAN:</strong> {account.iban}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default AccountCard;
