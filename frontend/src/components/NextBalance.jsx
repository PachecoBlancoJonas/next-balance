import AccountCard from "./AccountCard";
import DownloadTransactionsButton from "./DownloadTransactionsButton";

function NextBalance() {
    return (
        <main className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Your connected bank accounts and transactions
                    </p>
                </div>
                <DownloadTransactionsButton />
            </div>
            <AccountCard />
        </main>
    );
}

export default NextBalance;
