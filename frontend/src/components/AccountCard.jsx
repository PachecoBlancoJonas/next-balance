import { useEffect, useState } from "react";
import axios from "axios";
import TransactionCard from "./TransactionsCard";

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
                setAccounts(Array.isArray(data) ? data : []);
            } catch {
                setError("Failed to fetch accounts.");
            }
        };
        fetchAccounts();
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Connected Bank Accounts</h2>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {accounts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    No accounts connected yet. Go to{" "}
                    <span className="font-medium text-foreground">Settings</span> to add
                    a bank account.
                </div>
            ) : (
                accounts.map((account) => (
                    <div
                        key={account.id}
                        className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3"
                    >
                        <p className="text-sm font-mono text-muted-foreground">
                            <span className="text-foreground font-medium">IBAN:</span>{" "}
                            {account.iban}
                        </p>
                        <TransactionCard accountId={account.id} />
                    </div>
                ))
            )}
        </div>
    );
};

export default AccountCard;
