import axios from "axios";
import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { X } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const GoCardlessForm = ({ isOpenSecret, setIsOpenSecret, gocardless_id, setGocardless_id }) => {
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const new_id = formData.get("gocardless_id");
        const gocardless_key = formData.get("gocardless_key");

        try {
            await axios.post(
                `${apiUrl}/gocardless/create-new-access-token`,
                { gocardless_id: new_id, gocardless_key },
                { withCredentials: true }
            );
            await axios.post(
                `${apiUrl}/user/addgocardless`,
                { gocardless_id: new_id, gocardless_key },
                { withCredentials: true }
            );
            setGocardless_id(new_id);
            setIsOpenSecret(false);
            setError("");
        } catch (error) {
            setError(error.response?.data?.error || "Error in GoCardless process");
        }
    };

    if (!isOpenSecret) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsOpenSecret(false)}
            />
            <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg space-y-5 mx-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">GoCardless Credentials</h3>
                    <button
                        onClick={() => setIsOpenSecret(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Secret ID</label>
                        <input
                            autoFocus
                            autoComplete="off"
                            id="gocardless_id"
                            type="text"
                            name="gocardless_id"
                            placeholder="Your GoCardless Secret ID"
                            required
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Secret Key</label>
                        <input
                            autoComplete="off"
                            id="gocardless_key"
                            type="text"
                            name="gocardless_key"
                            placeholder="Your GoCardless Secret Key"
                            required
                            className={inputClass}
                        />
                    </div>

                    <p className="text-xs text-muted-foreground bg-muted rounded-md p-3">
                        Your secret key is stored securely and will never be displayed
                        on the dashboard. Keep a copy in a safe place.
                    </p>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex items-center justify-between pt-1">
                        <a
                            href="https://bankaccountdata.gocardless.com/user-secrets/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Get credentials <FiExternalLink size={13} />
                        </a>
                        <button
                            type="submit"
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            {gocardless_id ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoCardlessForm;
