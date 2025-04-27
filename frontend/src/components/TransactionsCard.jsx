import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
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
        // <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        //     {error && <p style={{ color: "#c92020" }}>{error}</p>}
        //     {transactions.length === 0 ? (
        //         <p>No transactions found.</p>
        //     ) : (
        //         <table
        //             style={{
        //                 width: "100%",
        //                 borderCollapse: "collapse",
        //             }}
        //         >
        //             <thead>
        //                 <tr>
        //                     <th
        //                         style={{
        //                             border: "1px solid #ccc",
        //                             padding: "8px",
        //                         }}
        //                     >
        //                         Date
        //                     </th>
        //                     <th
        //                         style={{
        //                             border: "1px solid #ccc",
        //                             padding: "8px",
        //                         }}
        //                     >
        //                         Description
        //                     </th>
        //                     <th
        //                         style={{
        //                             border: "1px solid #ccc",
        //                             padding: "8px",
        //                         }}
        //                     >
        //                         Amount
        //                     </th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {transactions.map((tx) => (
        //                     <tr key={tx.id}>
        //                         <td
        //                             style={{
        //                                 border: "1px solid #ccc",
        //                                 padding: "8px",
        //                             }}
        //                         >
        //                             {new Date(
        //                                 tx.value_date
        //                             ).toLocaleDateString()}
        //                         </td>
        //                         <td
        //                             style={{
        //                                 border: "1px solid #ccc",
        //                                 padding: "8px",
        //                             }}
        //                         >
        //                             {tx.concept}
        //                         </td>
        //                         <td
        //                             style={{
        //                                 border: "1px solid #ccc",
        //                                 padding: "8px",
        //                             }}
        //                         >
        //                             {tx.amount} €
        //                         </td>
        //                     </tr>
        //                 ))}
        //             </tbody>
        //         </table>
        //     )}
        // </div>
        <div className="p-4 bg-white rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">Transactions</h3>
            {error && <p className="text-red-600">{error}</p>}
            {transactions.length === 0 ? (
                <p>No transactions available</p>
            ) : (
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b">
                                <td className="px-4 py-2">
                                    {format(
                                        new Date(transaction.value_date),
                                        "dd/MM/yyyy"
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    {transaction.concept}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    {transaction.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Button className="mt-4">See More</Button>
        </div>
    );
};

export default TransactionCard;
