import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";

export default function DownloadTransactionsButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDownload = async () => {
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.get(`${apiUrl}/gocardless/transactions`, {
                withCredentials: true,
            });

            setMessage("Transactions downloaded successfully!");
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                "An error occurred while syncing transactions.";
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <button
                onClick={handleDownload}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? "Downloading..." : "Download Transactions"}
            </button>
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
