import { useEffect, useState } from "react";
import axios from "axios";
import { Landmark } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/user/accounts`, {
                    withCredentials: true,
                });
                setAccounts(Array.isArray(data) ? data : []);
            } catch {
                setError("Failed to fetch accounts.");
            }
        };
        fetchAccounts();
    }, []);

    if (error) return <p className="text-sm text-destructive">{error}</p>;

    if (accounts.length === 0)
        return <p className="text-sm text-muted-foreground">No accounts connected yet.</p>;

    return (
        <ul className="space-y-2">
            {accounts.map((account) => (
                <li
                    key={account.id}
                    className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
                >
                    <Landmark size={16} className="text-muted-foreground shrink-0" />
                    <span className="text-sm font-mono">{account.iban}</span>
                </li>
            ))}
        </ul>
    );
};

export default AccountList;
