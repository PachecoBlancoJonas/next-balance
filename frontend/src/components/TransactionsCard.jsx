import { useEffect, useState } from "react";
import axios from "axios";

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
                setTransactions(data);
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
            {error && <p style={{ color: "#c92020" }}>{error}</p>}
            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                }}
                            >
                                Date
                            </th>
                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                }}
                            >
                                Description
                            </th>
                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                }}
                            >
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "8px",
                                    }}
                                >
                                    {new Date(
                                        tx.value_date
                                    ).toLocaleDateString()}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "8px",
                                    }}
                                >
                                    {tx.concept}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "8px",
                                    }}
                                >
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
