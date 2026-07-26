import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const apiUrl = import.meta.env.VITE_API_URL;

const TransactionCard = ({ accountId }) => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!accountId) return;

        const fetchTransactions = async () => {
            try {
                const { data } = await axios.get(
                    `${apiUrl}/user/transactions/${accountId}`,
                    { withCredentials: true }
                );
                setTransactions(Array.isArray(data) ? data : []);
            } catch (error) {
                setError(
                    error.response?.data?.error || "Error fetching transactions"
                );
            }
        };

        fetchTransactions();
    }, [accountId]);

    return (
        <div>
            <h3 className="text-sm font-semibold mb-2">Recent transactions</h3>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transactions found.</p>
            ) : (
                <table className="w-full table-fixed text-sm">
                        <colgroup>
                            <col className="w-24" />
                            <col />
                            <col className="w-24" />
                        </colgroup>
                        <thead>
                            <tr className="border-b border-border">
                                <th className="pb-2 text-left font-medium text-muted-foreground">Date</th>
                                <th className="pb-2 text-left font-medium text-muted-foreground px-2">Description</th>
                                <th className="pb-2 text-right font-medium text-muted-foreground">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
                                    <td className="py-2 text-muted-foreground whitespace-nowrap text-xs">
                                        {format(new Date(tx.value_date), "dd MMM yyyy")}
                                    </td>
                                    <td className="py-2 px-2 truncate">{tx.concept}</td>
                                    <td className={`py-2 text-right font-mono font-medium whitespace-nowrap ${parseFloat(tx.amount) < 0 ? "text-destructive" : "text-green-600"}`}>
                                        {parseFloat(tx.amount) > 0 ? "+" : ""}
                                        {tx.amount} €
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            )}
        </div>
    );
};

export default TransactionCard;
