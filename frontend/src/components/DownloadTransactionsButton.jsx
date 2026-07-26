import { useState } from "react";
import { RefreshCw } from "lucide-react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function DownloadTransactionsButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            await axios.get(`${apiUrl}/gocardless/transactions`, {
                withCredentials: true,
            });
            setMessage("Transactions synced successfully.");
        } catch (error) {
            setIsError(true);
            setMessage(
                error.response?.data?.message ||
                    "An error occurred while syncing transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                onClick={handleDownload}
                disabled={loading}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                {loading ? "Syncing..." : "Sync transactions"}
            </button>
            {message && (
                <p className={`text-xs ${isError ? "text-destructive" : "text-muted-foreground"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
