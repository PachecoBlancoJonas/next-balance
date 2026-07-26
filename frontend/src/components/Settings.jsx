import { useState, useEffect } from "react";
import axios from "axios";
import GoCardlessForm from "./GoCardlessForm";
import BankForm from "./BankForm";
import AccountList from "./AccountList";
import { Plus, CheckCircle } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

function Settings() {
    const [gocardless_id, setGocardless_id] = useState("");
    const [isOpenSecret, setIsOpenSecret] = useState(false);
    const [isOpenBank, setIsOpenBank] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkGocardless = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/gocardless`, {
                    withCredentials: true,
                });
                setGocardless_id(response.data.gocardless_id);
            } catch {
                setGocardless_id(undefined);
            } finally {
                setLoading(false);
            }
        };
        checkGocardless();
    }, []);

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-8">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </main>
        );
    }

    return (
        <>
            <GoCardlessForm
                isOpenSecret={isOpenSecret}
                setIsOpenSecret={setIsOpenSecret}
                gocardless_id={gocardless_id}
                setGocardless_id={setGocardless_id}
            />
            <BankForm isOpenBank={isOpenBank} setIsOpenBank={setIsOpenBank} />

            <main className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-8 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your GoCardless credentials and bank accounts
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-base font-semibold">GoCardless API</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Required to connect your bank accounts
                            </p>
                        </div>
                        {gocardless_id && (
                            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <CheckCircle size={13} /> Connected
                            </span>
                        )}
                    </div>

                    {gocardless_id && (
                        <div className="rounded-md bg-muted px-3 py-2 text-sm font-mono text-muted-foreground">
                            {gocardless_id}
                        </div>
                    )}

                    <button
                        onClick={() => setIsOpenSecret(true)}
                        className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        <Plus size={14} />
                        {gocardless_id ? "Update credentials" : "Add credentials"}
                    </button>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <div>
                        <h2 className="text-base font-semibold">Bank Accounts</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Connect a bank account via GoCardless Open Banking
                        </p>
                    </div>

                    <button
                        onClick={() => setIsOpenBank(true)}
                        disabled={!gocardless_id}
                        className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus size={14} />
                        Add bank account
                    </button>
                    {!gocardless_id && (
                        <p className="text-xs text-muted-foreground">
                            Add your GoCardless credentials first to connect a bank account.
                        </p>
                    )}
                </div>

                {gocardless_id && (
                    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                        <h2 className="text-base font-semibold">Connected Accounts</h2>
                        <AccountList />
                    </div>
                )}
            </main>
        </>
    );
}

export default Settings;
